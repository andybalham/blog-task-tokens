/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/prefer-default-export */
export const VALUATION_SERVICE_URL = 'VALUATION_SERVICE_URL';

const valuationServiceUrl = process.env[VALUATION_SERVICE_URL] ?? '<undefined>';

export const handler = async (event: any): Promise<void> => {
  console.log(JSON.stringify({ event }, null, 2));
  console.log(JSON.stringify({ valuationServiceUrl }, null, 2));

  // const valuationResponse: ValuationResponse = {
  //   valuationReference: event.valuationReference,
  //   propertyValue: 666000,
  // };

  // const response = await axios.post(event.callbackUrl, valuationResponse);

  // console.log(JSON.stringify({ 'response.status': response.status }, null, 2));
};
