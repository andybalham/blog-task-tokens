import { ValuationRequest } from './ValuationRequest';

export interface ValuationStateMachineData extends ValuationRequest {
  valuationReference: string;
}