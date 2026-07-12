export type LandingContentItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  genre: string;

  videoUrl: string;
  mainVideoUrl: string;
  trailerUrl: string;

  thumbnailUrl: string;
  backdropUrl: string;

  status: string;
  maturityRating: string;
  runtime: string;
  creatorName: string;

  scheduledAt: string | null;
  views?: number;
};

export type LandingPosterItem = {
  id: string;
  title: string;
  thumbnailUrl: string;
  backdropUrl: string;
};