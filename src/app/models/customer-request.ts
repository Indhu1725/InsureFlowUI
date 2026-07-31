export interface CustomerRequest {
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  nomineeName: string;
  nomineeRelation: string;
  profileImage?: File;
}