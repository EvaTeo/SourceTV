export type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  revenueShare?: number | null;
  views?: number | null;
  status: string;
  scheduledAt?: string | null;
  thumbnailUrl?: string | null;
};