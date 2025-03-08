import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'

export class HonoLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const fn = new lambda.Function(this, 'lambda', {
      code: lambda.Code.fromAsset('dist/lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    })
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })
    new apigw.LambdaRestApi(this, 'myapi', {
      handler: fn,
    })
  }
}