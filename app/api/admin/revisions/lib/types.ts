export type RevisionQuery = {
  page: number;
  limit: number;
  status?: string;
  projectId?: string;
};

export type RevisionPage = {
  items: unknown[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};