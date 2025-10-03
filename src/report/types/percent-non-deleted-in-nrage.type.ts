export type PercentNonDeletedInRangeQuery = {
  start: string;
  end: string;
  minPrice?: number;
  maxPrice?: number;
};

export type PercentNonDeletedInRangeResponse = {
  total: number;
  nonDeletedInRange: number;
  percent: number;
};
