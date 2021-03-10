#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { InfrastructureStack } from "../lib/infrastructure-stack";
import { CertificateStack } from "../lib/certificate-stack";

const env = { account: "395475280310", region: "us-east-1" };

const app = new cdk.App();

new CertificateStack(app, "SJCertificateStack", {
  stackName: "SJCertificateStack",
  env: env,
});

new InfrastructureStack(app, "SJInfrastructureStack", {
  stackName: "SJInfrastructureStack",
  env: env,
});
