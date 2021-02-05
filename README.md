# APIGW REST API Basic Authentication CDK App

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


### deploy to specific region

```bash
REGION=us-east-1
export AWS_DEFAULT_REGION=$REGION
cdk deploy
unset AWS_DEFAULT_REGION
```


### tail Lambda function log

```bash
REGION=us-east-1
LOG_GROUP=/aws/lambda/xxx
aws --region $REGION logs tail $LOG_GROUP --follow
```