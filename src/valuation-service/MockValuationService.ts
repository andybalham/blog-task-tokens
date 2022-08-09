/* eslint-disable no-new */
import { Construct } from 'constructs';
import {} from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import {
  LogLevel,
  StateMachine,
  StateMachineType,
  WaitTime,
} from 'aws-cdk-lib/aws-stepfunctions';
import StateMachineBuilder from '@andybalham/state-machine-builder-v2';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { STATE_MACHINE_ARN } from './MockValuationService.RequestHandlerFunction';

export default class MockValuationService extends Construct {
  readonly serviceUrl: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const responseSenderFunction = new NodejsFunction(
      this,
      'ResponseSenderFunction',
      { logRetention: RetentionDays.ONE_DAY }
    );

    const stateMachine = new StateMachine(this, 'MockValuationStateMachine', {
      stateMachineType: StateMachineType.EXPRESS,
      logs: {
        destination: new LogGroup(this, 'MockValuationStateMachineLogGroup', {
          removalPolicy: RemovalPolicy.DESTROY,
          retention: RetentionDays.ONE_DAY,
        }),
        level: LogLevel.ALL,

        includeExecutionData: false,
      },
      definition: new StateMachineBuilder()
        .wait('Wait', {
          time: WaitTime.duration(Duration.seconds(6)),
        })
        .lambdaInvoke('SendResponse', {
          lambdaFunction: responseSenderFunction,
        })
        .build(this, {
          defaultProps: {
            lambdaInvoke: {
              payloadResponseOnly: true,
            },
          },
        }),
    });

    const requestHandlerFunction = new NodejsFunction(
      this,
      'RequestHandlerFunction',
      {
        logRetention: RetentionDays.ONE_DAY,
        environment: {
          [STATE_MACHINE_ARN]: stateMachine.stateMachineArn,
        },
      }
    );

    stateMachine.grantStartExecution(requestHandlerFunction);

    const httpApi = new HttpApi(this, 'MockValuationHttpApi', {
      description: 'Mock Valuation API',
    });

    httpApi.addRoutes({
      path: '/valuation-request',
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'ValuationRequestIntegration',
        requestHandlerFunction
      ),
    });

    new CfnOutput(this, 'MockValuationApiBaseUrl', {
      value: httpApi.url ?? '<undefined>',
      description: 'The base URL for the Mock Valuation API',
    });

    this.serviceUrl = `${httpApi.url}valuation-request`;

    new CfnOutput(this, 'MockValuationApiRequestPath', {
      value: this.serviceUrl,
      description: 'Valuation Request path for the Mock Valuation API',
    });
  }
}
