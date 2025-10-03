export type CountProductsQuery = {
  start?: Date;
  end?: Date;
  minPrice?: number;
  maxPrice?: number;
  withDeleted?: boolean;
};
