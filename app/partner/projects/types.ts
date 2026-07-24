export type ReviewStage =
  | "submission"
  | "metadata_review"
  | "content_review"
  | "rights_review"
  | "approved"
  | "scheduled"
  | "published";

export type PartnerProject = {
  id: string;
  title: string;

  description?: string | null;
  type?: string | null;
  genre?: string | null;

  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  videoUrl?: string | null;
  mainVideoUrl?: string | null;

  workflowStage: string;

  scheduledAt?: string | null;
  publishedAt?: string | null;

  reviewNotes?: string | null;
  metadataNotes?: string | null;
  contentNotes?: string | null;
  rightsNotes?: string | null;

  recognitionLevel?: string | null;

  featured?: boolean | null;

  year?: number | null;
  runtime?: string | null;
  maturityRating?: string | null;

  creatorName?: string | null;
  creatorCompany?: string | null;
};