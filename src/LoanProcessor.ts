import StateMachineBuilder from '@andybalham/state-machine-builder-v2';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  IntegrationPattern,
  IStateMachine,
  JsonPath,
  StateMachine,
} from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { ValuationCallbackFunctionEnv } from './LoanProcessor.ValuationCallbackFunction';
import { ValuationRequestFunctionEnv } from './LoanProcessor.ValuationRequestFunction';

export interface LoanProcessorProps {
  valuationServiceUrl: string;
}

export default class LoanProcessor extends Construct {
  readonly stateMachine: IStateMachine;

  constructor(scope: Construct, id: string, props: LoanProcessorProps) {
    super(scope, id);

    const taskTokenTable = new Table(this, 'TaskTokenTable', {
      partitionKey: { name: 'keyReference', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const valuationCallbackApi = new HttpApi(this, 'ValuationCallbackApi', {
      description: 'Valuation Callback API',
    });

    const VALUATION_CALLBACK_PATH = 'valuation-callback';

    const valuationRequestFunction = new NodejsFunction(
      this,
      'ValuationRequestFunction',
      {
        environment: {
          [ValuationRequestFunctionEnv.SERVICE_URL]: props.valuationServiceUrl,
          [ValuationRequestFunctionEnv.CALLBACK_URL]: `${valuationCallbackApi.url}${VALUATION_CALLBACK_PATH}`,
          [ValuationRequestFunctionEnv.TASK_TOKEN_TABLE_NAME]:
            taskTokenTable.tableName,
        },
      }
    );

    taskTokenTable.grantWriteData(valuationRequestFunction);

    this.stateMachine = new StateMachine(this, 'LoanProcessorStateMachine', {
      definition: new StateMachineBuilder()
        .lambdaInvoke('RequestValuation', {
          lambdaFunction: valuationRequestFunction,
          integrationPattern: IntegrationPattern.WAIT_FOR_TASK_TOKEN,
          parameters: {
            taskToken: JsonPath.taskToken,
            'loanApplication.$': '$',
          },
        })
        .build(this, {
          defaultProps: {
            lambdaInvoke: {
              // payloadResponseOnly: true,
            },
          },
        }),
    });

    const valuationCallbackFunction = new NodejsFunction(
      this,
      'ValuationCallbackFunction',
      {
        environment: {
          [ValuationCallbackFunctionEnv.TASK_TOKEN_TABLE_NAME]:
            taskTokenTable.tableName,
        },
      }
    );

    this.stateMachine.grantTaskResponse(valuationCallbackFunction);

    taskTokenTable.grantReadData(valuationCallbackFunction);

    valuationCallbackApi.addRoutes({
      path: `/${VALUATION_CALLBACK_PATH}`,
      methods: [HttpMethod.POST],
      integration: new HttpLambdaIntegration(
        'ValuationCallbackIntegration',
        valuationCallbackFunction
      ),
    });
  }
}
