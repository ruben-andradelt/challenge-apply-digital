export type Paginated<T> = {
  totalItems: number;
  totalPages: number;
  page: number;
  count: number;
  items: T[];
};
