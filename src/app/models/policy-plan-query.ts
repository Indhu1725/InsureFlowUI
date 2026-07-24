export interface PolicyPlanQuery {

  pageNumber: number;

  pageSize: number;

  sortField: string;

  sortDirection: string;

  productId?: number;

  isActive?: boolean;

}