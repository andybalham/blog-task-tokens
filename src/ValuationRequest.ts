export interface ValuationRequest {
  property: {
    nameOrNumber: string;
    postcode: string;
  };
  callbackUrl: string;
}
