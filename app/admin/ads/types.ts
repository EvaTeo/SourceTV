export type AdImpression = {
  id: string;
  completed: boolean;
  skipped: boolean;
  clicked: boolean;
  watchedSeconds: number;
};

export type AdCampaign = {
  id: string;

  name: string;
  advertiser?: string | null;

  status: string;

  adSource: string;
  vastTagUrl?: string | null;

  adType: string;
  objective: string;
  placement: string;

  videoUrl?: string | null;
  clickUrl?: string | null;
  imageUrl?: string | null;

  skipPolicy: string;
  skipAfterSeconds: number;
  premiumCanSkip: boolean;

  durationSeconds?: number | null;

  targetType: string;
  targetGenres?: string | null;
  targetRatings?: string | null;
  targetProjectId?: string | null;

  priority: number;

  budgetCents: number;
  spentCents: number;
  cpmCents: number;

  maxImpressions?: number | null;

  startDate?: string | null;
  endDate?: string | null;

  createdAt: string;

  impressions?: AdImpression[];
};

export type AdCampaignForm = {
  name: string;
  advertiser: string;

  status: string;

  adSource: string;
  vastTagUrl: string;

  adType: string;
  objective: string;
  placement: string;

  videoUrl: string;
  imageUrl: string;
  clickUrl: string;

  skipPolicy: string;
  skipAfterSeconds: string;
  premiumCanSkip: boolean;

  durationSeconds: string;

  targetType: string;
  targetGenres: string;
  targetRatings: string;
  targetProjectId: string;

  priority: string;

  budgetDollars: string;
  spentDollars: string;
  cpmDollars: string;

  maxImpressions: string;

  startDate: string;
  endDate: string;
};

export type AdCampaignStats = {
  total: number;
  active: number;
  impressions: number;
  completed: number;
  clicks: number;
};