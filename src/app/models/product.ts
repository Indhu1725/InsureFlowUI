export enum ProductType {
  Health = 0,
  Motor = 1,
  Life = 2,
  Travel = 3
}

export interface Product {
  productId: number;
  productName: string;
  productType: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
}

export interface ProductRequest {
  productName: string;
  productType: ProductType;
  description: string;
  isActive: boolean;
}