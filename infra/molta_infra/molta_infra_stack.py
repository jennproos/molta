import os

from aws_cdk import (
    CfnOutput,
    Duration,
    RemovalPolicy,
    Stack,
    aws_apigatewayv2 as apigwv2,
    aws_apigatewayv2_integrations as apigwv2_integrations,
    aws_certificatemanager as acm,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_iam as iam,
    aws_lambda as _lambda,
    aws_route53 as route53,
    aws_route53_targets as route53_targets,
    aws_s3 as s3,
    aws_secretsmanager as secretsmanager,
    aws_ses as ses,
)
from constructs import Construct

class MoltaInfraStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, stack_name="MoltaWebsiteInfraStack", **kwargs)

        domain_name = "moltabakery.com"
        subdomain = f"www.{domain_name}"
        contact_sender_email = f"contact@{domain_name}"
        contact_recipient_email = "moltagrandrapids@gmail.com"

        domain_bucket = s3.Bucket(
            self,
            "DomainBucket",
            bucket_name=domain_name,
            public_read_access=True,
            block_public_access=s3.BlockPublicAccess(
                block_public_acls=False,
                block_public_policy=False,
                ignore_public_acls=False,
                restrict_public_buckets=False
            ),
            removal_policy=RemovalPolicy.DESTROY,
            website_index_document="index.html"
        )

        # IMPORTANT: Before deploying this stack, you must first create a registered domain
        # that matches the domain_name (moltabakery.com) in Route 53. This will automatically
        # create a hosted zone. This code is just to look up the existing hosted zone.
        hosted_zone = route53.HostedZone.from_lookup(
            self,
            "HostedZone",
            domain_name=domain_name
        )

        # IMPORTANT: One-time manual step required after running 'cdk deploy':
        # 1. Go to the AWS Console
        # 2. Navigate to AWS Certificate Manager
        # 3. Find this certificate
        # 4. Click "Create records in Route 53" to complete DNS validation
        certificate = acm.Certificate(
            self,
            "WebsiteCertificate",
            domain_name=domain_name,
            certificate_name="Molta Website Certificate",
            subject_alternative_names=[subdomain],
            validation=acm.CertificateValidation.from_dns(hosted_zone)
        )

        distribution = cloudfront.Distribution(
            self,
            "SiteDistribution",
            certificate=certificate,
            default_root_object="index.html",
            domain_names=[domain_name, subdomain],
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3StaticWebsiteOrigin(domain_bucket),
                allowed_methods=cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
            )
        )

        route53.ARecord(
            self,
            "SiteAliasRecord",
            zone=hosted_zone,
            target=route53.RecordTarget.from_alias(route53_targets.CloudFrontTarget(distribution))
        )

        route53.ARecord(
            self,
            "WWWSiteAliasRecord",
            zone=hosted_zone,
            record_name=subdomain,
            target=route53.RecordTarget.from_alias(route53_targets.CloudFrontTarget(distribution))
        )

        github_deployment_user = iam.User(
            self,
            "GitHubDeploymentUser",
            user_name="molta-github-deployment-user"
        )

        github_deployment_user.add_to_policy(
            iam.PolicyStatement(
                actions=[
                    "s3:ListBucket",
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:DeleteObject",
                    "s3:PutBucketWebsite"
                ],
                resources=[
                    domain_bucket.bucket_arn,
                    f"{domain_bucket.bucket_arn}/*"
                ]
            )
        )

        github_deployment_user.add_to_policy(
            iam.PolicyStatement(
                actions=["cloudfront:CreateInvalidation"],
                resources=[f"arn:aws:cloudfront::{self.account}:distribution/{distribution.distribution_id}"]
            )
        )

        access_key = iam.AccessKey(self, "GitHubDeploymentUserAccessKey", user=github_deployment_user)
        CfnOutput(self, "GitHubDeploymentUserAccessKeyId", value=access_key.access_key_id)

        secretsmanager.Secret(
            self,
            "GitHubDeploymentUserAccessKeySecret",
            secret_name="molta-github-deployment-user-secret-access-key-secret",
            secret_string_value=access_key.secret_access_key
        )

        # ─── CONTACT FORM: SES ──────────────────────────────
        #
        # Domain identity for the FROM address (contact@moltabakery.com).
        # Because we pass the existing Route 53 hosted zone, CDK automatically
        # creates the Easy DKIM CNAME records in that zone. No manual
        # verification step is required for this identity. Note: no real
        # mailbox needs to exist at this address — it is a sending-only
        # identity, and replies go to the visitor's own email instead.
        sender_identity = ses.EmailIdentity(
            self,
            "SesDomainIdentity",
            identity=ses.Identity.public_hosted_zone(hosted_zone),
        )

        # IMPORTANT: One-time manual step required after running 'cdk deploy':
        # 1. AWS will automatically send a verification email to
        #    moltagrandrapids@gmail.com (this is a plain Gmail inbox with no
        #    DNS this stack controls, so it can only be verified as an SES
        #    "email identity", not a domain identity).
        # 2. Open that email (from no-reply-aws@amazon.com) and click the
        #    verification link.
        # 3. Until this is done, SES (in sandbox mode) will reject sends to
        #    this address with a MessageRejected error.
        recipient_identity = ses.EmailIdentity(
            self,
            "SesRecipientEmailIdentity",
            identity=ses.Identity.email(contact_recipient_email),
        )

        # ─── CONTACT FORM: LAMBDA ───────────────────────────
        contact_handler = _lambda.Function(
            self,
            "ContactFormHandler",
            function_name="molta-contact-form-handler",
            runtime=_lambda.Runtime.PYTHON_3_13,
            handler="handler.lambda_handler",
            code=_lambda.Code.from_asset(
                os.path.join(os.path.dirname(__file__), "..", "lambda_handlers", "contact_handler")
            ),
            timeout=Duration.seconds(10),
            memory_size=128,
            environment={
                "SENDER_EMAIL": contact_sender_email,
                "RECIPIENT_EMAIL": contact_recipient_email,
            },
        )

        # Least-privilege: scoped to these two identities' own ARNs, not "*".
        # Both grants are required: SES's IAM authorization checks every
        # identity referenced in a SendEmail call, and since the recipient
        # is itself a verified SES identity in this account (required for
        # sandbox mode), permission on the sender identity alone isn't enough.
        sender_identity.grant_send_email(contact_handler)
        recipient_identity.grant_send_email(contact_handler)

        # ─── CONTACT FORM: HTTP API ─────────────────────────
        contact_http_api = apigwv2.HttpApi(
            self,
            "ContactHttpApi",
            api_name="molta-contact-api",
            create_default_stage=False,
            cors_preflight=apigwv2.CorsPreflightOptions(
                allow_origins=[
                    f"https://{domain_name}",
                    f"https://{subdomain}",
                    "http://localhost:3000",
                ],
                allow_methods=[apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS],
                allow_headers=["content-type"],
                max_age=Duration.hours(1),
            ),
        )

        contact_http_api.add_routes(
            path="/contact",
            methods=[apigwv2.HttpMethod.POST],
            integration=apigwv2_integrations.HttpLambdaIntegration(
                "ContactFormIntegration", contact_handler
            ),
        )

        contact_api_stage = contact_http_api.add_stage(
            "ContactApiDefaultStage",
            stage_name="$default",
            auto_deploy=True,
            throttle=apigwv2.ThrottleSettings(rate_limit=5, burst_limit=10),
        )

        CfnOutput(self, "ContactApiUrl", value=contact_api_stage.url)