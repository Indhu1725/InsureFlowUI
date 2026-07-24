export enum PremiumType {
  OneTime = 0,
  Annual = 1
}

export enum ProductType {
  Health = 0,
  Motor = 1,
  Life = 2,
  Travel = 3
}

export interface PolicyPlan {

  planId: number;
  productId: number;

  productName: string;

  productType: ProductType;

  planName: string;

  coverageAmount: number;

  premiumAmount: number;

  premiumType: PremiumType;

  durationYears: number;

  termsAndConditions: string;

  isActive: boolean;
  createdDate: string;
}