export type Submission = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  status: string;

  year?: string | number | null;
  runtime?: string | null;
  maturityRating?: string | null;

  creatorName?: string | null;
  creatorCompany?: string | null;

  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;

  videoUrl?: string | null;
  mainVideoUrl?: string | null;
  trailerUrl?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
};

export type StatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "denied";

export type Notice = {
  type: "success" | "error";
  message: string;
};

export type SubmissionMetrics = {
  total: number;
  pending: number;
  approved: number;
  denied: number;
};