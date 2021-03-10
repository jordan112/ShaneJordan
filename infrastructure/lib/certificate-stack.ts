import * as cdk from "@aws-cdk/core";
import * as cm from "@aws-cdk/aws-certificatemanager";
import { ValidationMethod } from "@aws-cdk/aws-certificatemanager";
import { CfnOutput } from "@aws-cdk/core";

const domainName = "shanejordan.com";

export class CertificateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      env: { region: "us-east-1" },
    });

    const certificate = new cm.Certificate(this, "CustomDomainCertificate", {
      domainName: domainName,
      validationMethod: ValidationMethod.DNS,
    });

    const certificateArn = certificate.certificateArn;
    new CfnOutput(this, "CertificateArn", {
      value: certificateArn,
    });
  }
}
