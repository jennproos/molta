import aws_cdk as core
import aws_cdk.assertions as assertions

from infra.molta_infra.molta_infra_stack import MoltaInfraStack

def test_sqs_queue_created():
    app = core.App()
    stack = MoltaInfraStack(app, "infra")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
