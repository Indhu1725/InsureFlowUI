export interface PagedResponse<T> {
  records: T[];
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  isLastPage: boolean;
  sortField: string;
  sortDirection: string;
}