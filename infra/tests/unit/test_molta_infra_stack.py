import aws_cdk as core
import aws_cdk.assertions as assertions

from molta_infra.molta_infra_stack import MoltaInfraStack


# Helper to create test environment
def get_test_env():
    return core.Environment(account='120086452202', region='us-east-1')


def test_s3_bucket_created():
    """Test that S3 bucket is created with correct configuration"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    # Verify S3 bucket exists with correct properties
    template.has_resource_properties("AWS::S3::Bucket", {
        "BucketName": "moltabakery.com",
        "PublicAccessBlockConfiguration": {
            "BlockPublicAcls": False,
            "BlockPublicPolicy": False,
            "IgnorePublicAcls": False,
            "RestrictPublicBuckets": False
        },
        "WebsiteConfiguration": {
            "IndexDocument": "index.html"
        }
    })


def test_cloudfront_distribution_created():
    """Test that CloudFront distribution is created with correct configuration"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    # Verify CloudFront distribution exists
    template.has_resource_properties("AWS::CloudFront::Distribution", {
        "DistributionConfig": {
            "DefaultRootObject": "index.html",
            "Aliases": ["moltabakery.com", "www.moltabakery.com"],
            "ViewerCertificate": {
                "AcmCertificateArn": assertions.Match.any_value(),
                "SslSupportMethod": "sni-only"
            },
            "DefaultCacheBehavior": {
                "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
                "ViewerProtocolPolicy": "redirect-to-https"
            }
        }
    })


def test_acm_certificate_created():
    """Test that ACM certificate is created with correct domain names"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    # Verify certificate exists with correct domains
    template.has_resource_properties("AWS::CertificateManager::Certificate", {
        "DomainName": "moltabakery.com",
        "SubjectAlternativeNames": ["www.moltabakery.com"],
        "DomainValidationOptions": assertions.Match.any_value()
    })


def test_route53_records_created():
    """Test that Route 53 A records are created for both root and www domains"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    # Should have 2 A records: one for root domain and one for www subdomain.
    # (The stack's Route53 zone also carries 3 CNAME records for the SES
    # domain identity's DKIM tokens, counted separately in
    # test_contact_form_resource_counts, so we match on "Type": "A" here
    # rather than the RecordSet count as a whole.)
    a_records = template.find_resources("AWS::Route53::RecordSet", {
        "Properties": {"Type": "A"}
    })
    assert len(a_records) == 2

    # Verify root domain A record
    template.has_resource_properties("AWS::Route53::RecordSet", {
        "Type": "A",
        "AliasTarget": {
            "DNSName": assertions.Match.any_value(),
            "HostedZoneId": assertions.Match.any_value()
        }
    })


def test_stack_has_correct_resource_count():
    """Test that the stack creates the expected number of resources"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    # Verify expected resource counts
    template.resource_count_is("AWS::S3::Bucket", 1)
    template.resource_count_is("AWS::CloudFront::Distribution", 1)
    template.resource_count_is("AWS::CertificateManager::Certificate", 1)
    # 2 A records (root + www) + 3 CNAME records auto-created for the SES
    # domain identity's DKIM tokens (see test_ses_domain_identity_created).
    template.resource_count_is("AWS::Route53::RecordSet", 5)


def test_s3_bucket_has_removal_policy():
    """Test that S3 bucket has DESTROY removal policy"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    # Verify bucket has deletion policy set to Delete (RemovalPolicy.DESTROY)
    template.has_resource("AWS::S3::Bucket", {
        "DeletionPolicy": "Delete",
        "UpdateReplacePolicy": "Delete"
    })


def test_ses_domain_identity_created():
    """Test that the SES domain identity for the sender address is created"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::SES::EmailIdentity", {
        "EmailIdentity": "moltabakery.com"
    })


def test_ses_recipient_identity_created():
    """Test that the SES email identity for the notification recipient is created"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::SES::EmailIdentity", {
        "EmailIdentity": "moltagrandrapids@gmail.com"
    })


def test_contact_lambda_created():
    """Test that the contact form Lambda is created with correct runtime and handler"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::Lambda::Function", {
        "FunctionName": "molta-contact-form-handler",
        "Runtime": "python3.13",
        "Handler": "handler.lambda_handler",
        "Timeout": 10
    })


def test_contact_http_api_created():
    """Test that the contact form HTTP API is created"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::ApiGatewayV2::Api", {
        "Name": "molta-contact-api",
        "ProtocolType": "HTTP"
    })


def test_contact_route_created():
    """Test that the POST /contact route is created"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::ApiGatewayV2::Route", {
        "RouteKey": "POST /contact"
    })


def test_contact_stage_has_throttling():
    """Test that the contact API's default stage has throttling configured"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    template.has_resource_properties("AWS::ApiGatewayV2::Stage", {
        "StageName": "$default",
        "DefaultRouteSettings": {
            "ThrottlingBurstLimit": 10,
            "ThrottlingRateLimit": 5
        }
    })


def test_contact_form_resource_counts():
    """Test that exactly the expected number of contact-form resources exist"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    template.resource_count_is("AWS::SES::EmailIdentity", 2)
    template.resource_count_is("AWS::Lambda::Function", 1)
    template.resource_count_is("AWS::ApiGatewayV2::Api", 1)
    template.resource_count_is("AWS::ApiGatewayV2::Route", 1)
    template.resource_count_is("AWS::ApiGatewayV2::Stage", 1)


def test_cloudfront_uses_s3_origin():
    """Test that CloudFront distribution uses S3 as origin"""
    app = core.App()
    stack = MoltaInfraStack(app, "infra", env=get_test_env())
    template = assertions.Template.from_stack(stack)

    # Verify CloudFront has an origin configured
    template.has_resource_properties("AWS::CloudFront::Distribution", {
        "DistributionConfig": {
            "Origins": assertions.Match.array_with([
                assertions.Match.object_like({
                    "CustomOriginConfig": assertions.Match.any_value()
                })
            ])
        }
    })
