export type AdsQuery = {
  page: number;
  limit: number;
  status?: string;
  type?: string;
  search?: string;
};

export type AdsPage = {
  items: unknown[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UpdateAdStatusInput = {
  id: string;
  status: string;
};