export interface PremiumDue {
  policyId: number;
  policyNumber: string;
  coverageAmount: number;
  premiumAmount: number;
  nextPremiumDueDate: string;
  lastPremiumPaymentDate: string;
  status: string;
}