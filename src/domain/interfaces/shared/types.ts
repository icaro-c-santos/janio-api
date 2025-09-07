export type RepositoryPaginatedResult<T> = {
  total: number;
  take: number;
  skip: number;
  items: T[];
};

export type RepositoryPaginatedInput = {
  take: number;
  skip: number;
};
