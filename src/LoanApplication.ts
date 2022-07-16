export interface LoanApplication {
  applicationReference: string;
  property: {
    nameOrNumber: string;
    postcode: string;
  };
}
