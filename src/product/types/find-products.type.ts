export type FindProductsQuery = {
  page?: number;
  rowCount?: number;
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};
