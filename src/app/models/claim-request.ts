import { SupportingDocument } from "./supporting-document";

export interface ClaimRequest {

  policyId: number;

  claimAmount: number;

  claimReason: string;

  incidentDate: string;

}