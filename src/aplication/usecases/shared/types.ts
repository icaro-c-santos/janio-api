export type PaginatedResult<T> = {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
};
