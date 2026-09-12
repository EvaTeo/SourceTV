export type UserUpdateInput = {
  id: string;
  name?: string;
  role?: string;
  status?: string;
};

export type UserRouteResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type UserSummary = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};