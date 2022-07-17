/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import axios from 'axios';
import { LoanApplication } from './LoanApplication';
import TaskTokenStore from './TaskTokenStore';
import {
  ValuationRequest,
  ValuationRequestResponse,
} from './valuation-service/ValuationRequest';

export class ValuationRequestFunctionEnv {
  static readonly SERVICE_URL = 'SERVICE_URL';

  static readonly CALLBACK_URL = 'CALLBACK_URL';

  static readonly TASK_TOKEN_TABLE_NAME = 'TASK_TOKEN_TABLE_NAME';
}

const valuationServiceUrl =
  process.env[ValuationRequestFunctionEnv.SERVICE_URL] ?? '<undefined>';
const callbackUrl =
  process.env[ValuationRequestFunctionEnv.CALLBACK_URL] ?? '<undefined>';

const taskTokenStore = new TaskTokenStore(
  process.env[ValuationRequestFunctionEnv.TASK_TOKEN_TABLE_NAME]
);

export const handler = async (event: {
  taskToken: string;
  loanApplication: LoanApplication;
}): Promise<void> => {
  console.log(JSON.stringify({ event }, null, 2));

  const valuationRequest: ValuationRequest = {
    property: event.loanApplication.property,
    callbackUrl,
  };

  const response = await axios.post(valuationServiceUrl, valuationRequest);

  if (response.status !== 201) {
    throw new Error(`Unexpected response.status: ${response.status}`);
  }

  console.log(JSON.stringify({ 'response.data': response.data }, null, 2));

  const valuationRequestResponse = response.data as ValuationRequestResponse;

  await taskTokenStore.putAsync({
    keyReference: valuationRequestResponse.valuationReference,
    taskToken: event.taskToken,
  });
};
