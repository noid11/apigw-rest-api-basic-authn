import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

export class ApigwRestApiBasicAuthnStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backendFunction = new lambda.Function(this, 'BackendFunciton', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lib/lambda/backend')
    });

    const api = new apigw.LambdaRestApi(this, 'BasicAuthenticationAPI', {
      handler: backendFunction,
      proxy: false
    });

    const basicAuthenticationFunction = new lambda.Function(this, 'BasicAuthenticationFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lib/lambda/authorizer')
    });
  
    const authorizer = new apigw.RequestAuthorizer(this, 'BasicAuthenticationAuthorizer', {
      handler: basicAuthenticationFunction,
      identitySources: [apigw.IdentitySource.header('Authorization')],
      resultsCacheTtl: cdk.Duration.seconds(0)
    });

    api.root.addMethod('ANY', new apigw.LambdaIntegration(backendFunction, {
      integrationResponses: [
        { statusCode: '200' }
      ],
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }'
      },
    }), {
      methodResponses: [
        { statusCode: '200' }
      ],
      authorizer
    });

    api.addGatewayResponse('UnauthorizedResponse', {
      type: apigw.ResponseType.UNAUTHORIZED,
      statusCode: '401',
      // currently, addGatewayResponse not work by following issue
      // https://github.com/aws/aws-cdk/issues/11306
      // responseHeaders: {
      //   'WWW-Authenticate': 'Basic'
      // },
      templates: {
        'application/json': '{ "message": $context.error.messageString }'
      }
    });
  }
}
