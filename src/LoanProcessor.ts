import StateMachineBuilder from '@andybalham/state-machine-builder-v2';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { IStateMachine, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Construct } from 'constructs';
import { VALUATION_SERVICE_URL } from './LoanProcessor.ValuationRequestFunction';

export interface LoanProcessorProps {
  valuationServiceUrl: string;
}

export default class LoanProcessor extends Construct {
  readonly stateMachine: IStateMachine;

  constructor(scope: Construct, id: string, props: LoanProcessorProps) {
    super(scope, id);

    const valuationRequestFunction = new NodejsFunction(
      this,
      'ValuationRequestFunction',
      {
        environment: {
          [VALUATION_SERVICE_URL]: props.valuationServiceUrl,
        },
      }
    );

    this.stateMachine = new StateMachine(this, 'LoanProcessorStateMachine', {
      definition: new StateMachineBuilder()
        .lambdaInvoke('RequestValuation', {
          lambdaFunction: valuationRequestFunction,
        })
        .build(this, {
          defaultProps: {
            lambdaInvoke: {
              payloadResponseOnly: true,
            },
          },
        }),
    });
  }
}
