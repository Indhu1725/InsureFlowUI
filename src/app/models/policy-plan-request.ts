import { PremiumType } from "./policy-plan";

export interface PolicyPlanRequest {

  productId: number;

  planName: string;

  coverageAmount: number;

  premiumAmount: number;

  premiumType: PremiumType;

  durationYears: number;

  termsAndConditions: string;

  isActive: boolean;

}