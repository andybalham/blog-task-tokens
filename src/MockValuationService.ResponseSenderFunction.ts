/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import axios from 'axios';
import { ValuationResponse } from './ValuationResponse';
import { ValuationStateMachineData } from './ValuationStateMachineData';

export const handler = async (
  event: ValuationStateMachineData
): Promise<void> => {
  console.log(JSON.stringify({ event }, null, 2));

  const valuationResponse: ValuationResponse = {
    valuationReference: event.valuationReference,
    propertyValue: 666000,
  };

  const response = await axios.post(event.callbackUrl, valuationResponse);

  console.log(JSON.stringify({ response }, null, 2));
};
