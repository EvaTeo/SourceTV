export type CollectionRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export type UpdateCollectionInput =
  Record<string, unknown>;

export type CollectionResponse<T = unknown> = {
  success: boolean;
  collection?: T;
  error?: string;
};