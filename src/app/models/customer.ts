export interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  nomineeName: string;
  nomineeRelation: string;
  isActive:boolean;
  createdDate:string;
  updatedDate?:string;
}