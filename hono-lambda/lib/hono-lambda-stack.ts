import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class HonoLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambda.Function(this, "lambda", {
      code: lambda.Code.fromAsset("dist/lambda"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_20_X,
    });

    // Function URL のCORS設定
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ["*"],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        allowCredentials: true,
      },
    });

    // API GatewayのCORS設定
    const api = new apigw.LambdaRestApi(this, "myapi", {
      handler: fn,
      deployOptions: {
        stageName: "prod", // 明示的にステージ名を指定
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS,
        allowMethods: apigw.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Requested-With",
          "X-Api-Key",
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Methods",
        ],
        allowCredentials: true,
        maxAge: cdk.Duration.days(1),
      },
    });

    // CORSヘッダーをエラーレスポンスに追加
    new apigw.GatewayResponse(this, "GatewayResponse", {
      restApi: api,
      type: apigw.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Headers":
          "'Content-Type,Authorization,X-Requested-With'",
        "Access-Control-Allow-Methods": "'GET,POST,PUT,DELETE,OPTIONS'",
        "Access-Control-Allow-Credentials": "'true'",
      },
    });

    new apigw.GatewayResponse(this, "Gateway5XXResponse", {
      restApi: api,
      type: apigw.ResponseType.DEFAULT_5XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Headers":
          "'Content-Type,Authorization,X-Requested-With'",
        "Access-Control-Allow-Methods": "'GET,POST,PUT,DELETE,OPTIONS'",
        "Access-Control-Allow-Credentials": "'true'",
      },
    });
  }
}
