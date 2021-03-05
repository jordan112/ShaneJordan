import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as cm from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import { PriceClass } from '@aws-cdk/aws-cloudfront';
import { CacheControl } from '@aws-cdk/aws-s3-deployment';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = 'shanejordan.com';

    // S3 website to host shanejordan.com code
    const websiteBucket = new s3.Bucket(this, 'SJSourceCodeDeployBucket', {
      bucketName: 'ui-shanejordan-source',
      versioned: true,
      // this bucket should not be open to the public and only accessible via CloudFront
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      websiteIndexDocument: 'index.html',
      autoDeleteObjects: true,
      // this is only for development at this point until stabilized
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // create access identity to allow CloudFront to access S3
    const cloudFrontSJOriginAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      'CloudFrontSDKOriginAccessIdentity',
      {
        comment: 'Allows CloudFront SJ to reach to the SJ public site bucket!',
      },
    );

    // grant S3 read access to the CloudFront resource
    websiteBucket.grantRead(cloudFrontSJOriginAccessIdentity);

    // custom cache policy
    const cloudFrontSDKCachePolicy = new cloudfront.CachePolicy(
      this,
      'SJCachePolicy',
      {
        cachePolicyName: 'SJCachePolicy',
        comment: 'Custom Cache Policy for SJ site',
        cookieBehavior: cloudfront.CacheCookieBehavior.all(),
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
      },
    );

    // Cloudfront that will host SDK files
    const cloudFrontForShaneJordan = new cloudfront.CloudFrontWebDistribution(
      this,
      'SJSite',
      {
        comment: `SJ source files for SJSite`,
        priceClass: PriceClass.PRICE_CLASS_100,
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: websiteBucket,
              originAccessIdentity: cloudFrontSJOriginAccessIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                allowedMethods:
                  cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              },
            ],
          },
        ],
      },
    );

    const route53HostedZone = new route53.PublicHostedZone(this, 'SJHostedZone', {
      zoneName: domainName,
    });

    // add an A record to route domain to cloudfront dist
    new route53.ARecord(this, domainName, {
      zone: route53HostedZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(cloudFrontForShaneJordan),
      ),
      recordName: domainName,
    });

    // we want the www to route as well
    new route53.CnameRecord(this, `www.${domainName}`, {
      zone: route53HostedZone,
      domainName: domainName,
      comment: 'www cname',
      recordName: `www.${domainName}`,
    });

    // Deployment of source files.  This will probably move in the future to have this be IaC only.
    // This also has limitations since it runs in a Lambda and will timeout if too large
    // const src = new s3Deploy.BucketDeployment(
    //   this,
    //   `SJDeployment`,
    //   {
    //     sources: [s3Deploy.Source.asset('../build')],
    //     destinationBucket: websiteBucket,
    //     // cache set to 10 minutes at the browser level since we want to control this better at the cloudfront level
    //     cacheControl: [
    //       CacheControl.fromString(
    //         'max-age=600,no-cache,no-store,must-revalidate',
    //       ),
    //     ],
    //     // by designated this it will invalidate the CloudFront cache
    //     distribution: cloudFrontForShaneJordan,
    //     distributionPaths: ['/*'],
    //   },
    // );

  }
}
