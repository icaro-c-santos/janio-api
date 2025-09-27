export interface PaginatedUseCase {
  page?: number;
  pageSize?: number;
}
export type PaginatedResult<T> = {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
};
