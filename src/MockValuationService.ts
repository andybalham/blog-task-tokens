import { Construct } from 'constructs';
import {} from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { CfnOutput } from 'aws-cdk-lib';

export default class MockValuationService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // TODO 13Jul22: Define the function to make the return call

    // TODO 13Jul22: Define the step function to call back

    const httpApi = new HttpApi(this, 'MockValuationHttpApi', {
      description: 'Mock Valuation API',
    });

    // We want to change the following to output the actual route

    // eslint-disable-next-line no-new
    new CfnOutput(this, 'MockValuationHttpApiUrl', {
      value: httpApi.url ?? '<undefined>',
      description: 'The base URL for the Mock Valuation API',
    });
  }
}
