export type ProjectForm = {
  title: string;
  description: string;
  type: string;
  genre: string;
  year: string;
  maturityRating: string;
  runtime: string;
  creatorName: string;
  creatorCompany: string;
};

export type UploadKey =
  | "mainVideoFile"
  | "trailerFile"
  | "thumbnailFile"
  | "backdropFile"
  | "titleLogoFile";

export type UploadFiles = Record<UploadKey, File | null>;

export type PreviewMode = "main" | "trailer";

export type SubmissionSectionId =
  | "project-details"
  | "video-uploads"
  | "artwork"
  | "live-preview"
  | "submit-project";

export type ReadinessItem = {
  label: string;
  complete: boolean;
  required: boolean;
};