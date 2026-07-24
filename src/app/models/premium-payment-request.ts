export interface PremiumPaymentRequest {
  policyId: number;
  amount: number;
  paymentMode: number;
  transactionReference: string;
}