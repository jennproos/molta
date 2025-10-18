#!/usr/bin/env python3
from aws_cdk import (
    App,
    Environment
)

from molta_infra.molta_infra_stack import MoltaInfraStack

app = App()
env = Environment(account='120086452202', region='us-east-1')
MoltaInfraStack(app, "MoltaInfraStack", env=env)

app.synth()