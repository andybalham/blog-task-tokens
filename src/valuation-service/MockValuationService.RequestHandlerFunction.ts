/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import { APIGatewayEvent } from 'aws-lambda';
import StepFunctions, {
  StartExecutionInput,
} from 'aws-sdk/clients/stepfunctions';
import { nanoid } from 'nanoid';
import { ValuationRequest, ValuationRequestResponse } from './ValuationRequest';
import { ValuationStateMachineData } from './ValuationStateMachineData';

export const STATE_MACHINE_ARN = 'STATE_MACHINE_ARN';
const stateMachineArn = process.env[STATE_MACHINE_ARN] ?? '<undefined>';

const stepFunctions = new StepFunctions();

export const handler = async (event: APIGatewayEvent): Promise<any> => {
  console.log(JSON.stringify({ event }, null, 2));

  if (event.body === null) {
    throw new Error(`No body supplied`);
  }

  const valuationRequest = JSON.parse(event.body) as ValuationRequest;
  const valuationReference = nanoid();

  const stateMachineData: ValuationStateMachineData = {
    ...valuationRequest,
    valuationReference,
  };
  const params: StartExecutionInput = {
    stateMachineArn,
    input: JSON.stringify(stateMachineData),
  };

  await stepFunctions.startExecution(params).promise();

  const valuationRequestResponse: ValuationRequestResponse = {
    valuationReference,
  };

  return {
    statusCode: 201,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(valuationRequestResponse),
  };
};
