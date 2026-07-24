export interface ClaimPaginationRequest {

  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;
  claimStatus?: string;
  customerId?: number;
  policyId?: number;

}