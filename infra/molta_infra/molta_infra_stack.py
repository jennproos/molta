from aws_cdk import (
    CfnOutput,
    RemovalPolicy,
    Stack,
    aws_certificatemanager as acm,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_iam as iam,
    aws_route53 as route53,
    aws_route53_targets as route53_targets,
    aws_s3 as s3,
    aws_secretsmanager as secretsmanager,
)
from constructs import Construct

class MoltaInfraStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, stack_name="MoltaWebsiteInfraStack", **kwargs)

        domain_name = "moltabakery.com"
        subdomain = f"www.{domain_name}"

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