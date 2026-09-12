export type ContentEditorForm = {
  id: string;

  title?: string | null;
  description?: string | null;

  type?: string | null;
  genre?: string | null;
  year?: number | string | null;
  runtime?: string | null;
  maturityRating?: string | null;

  creatorName?: string | null;
  creatorEmail?: string | null;
  creatorCompany?: string | null;

  revenueShare?: number | null;

  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  cardArtUrl?: string | null;
  titleLogoUrl?: string | null;

  videoUrl?: string | null;
  mainVideoUrl?: string | null;
  trailerUrl?: string | null;

  status?: string | null;
  workflowStage?: string | null;

  scheduledAt?: string | null;

  featured?: boolean | null;
  featuredRank?: number | null;

  heroBadge?: string | null;
  heroPriority?: number | null;
  heroStartDate?: string | null;
  heroEndDate?: string | null;

  [key: string]: unknown;
};

export type ArtworkAssetType =
  | "poster"
  | "backdrop"
  | "cardArt"
  | "titleLogo";

export type VideoAssetType =
  | "main"
  | "trailer";

export type PartnerMessageInput = {
  partnerEmail: string;
  partnerName: string;
  senderTeam: string;
  subject: string;
  message: string;
};