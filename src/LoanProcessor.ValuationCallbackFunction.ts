/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { APIGatewayEvent } from 'aws-lambda';
import TaskTokenStore from './TaskTokenStore';
import { ValuationResponse } from './valuation-service/ValuationResponse';

export class ValuationCallbackFunctionEnv {
  static readonly TASK_TOKEN_TABLE_NAME = 'TASK_TOKEN_TABLE_NAME';
}

const taskTokenStore = new TaskTokenStore(
  process.env[ValuationCallbackFunctionEnv.TASK_TOKEN_TABLE_NAME]
);

export const handler = async (event: APIGatewayEvent): Promise<void> => {
  console.log(JSON.stringify({ event }, null, 2));

  if (event.body === null) {
    throw new Error(`No body supplied`);
  }

  const valuationResponse = JSON.parse(event.body) as ValuationResponse;

  const taskTokenItem = await taskTokenStore.getAsync(
    valuationResponse.valuationReference
  );

  if (taskTokenItem === undefined)
    throw new Error('taskTokenItem === undefined');

  console.log(JSON.stringify({ taskTokenItem }, null, 2));
};
