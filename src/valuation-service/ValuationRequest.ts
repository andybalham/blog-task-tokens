export interface ValuationRequest {
  property: {
    nameOrNumber: string;
    postcode: string;
  };
  callbackUrl: string;
}

export interface ValuationRequestResponse {
  valuationReference: string;
}