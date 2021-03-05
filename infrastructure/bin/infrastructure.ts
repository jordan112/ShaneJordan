#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { InfrastructureStack } from "../lib/infrastructure-stack";

const env = { account: "395475280310", region: "us-east-1" };

const app = new cdk.App();
new InfrastructureStack(app, "SJInfrastructureStack", {
  stackName: "SJInfrastructureStack",
  env: env,
});
