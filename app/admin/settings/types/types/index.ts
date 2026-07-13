export type SettingsSection =
  | "general"
  | "homepage"
  | "accounts"
  | "premium"
  | "advertising"
  | "partners"
  | "notifications"
  | "moderation"
  | "maintenance"
  | "ai";

export type PlatformSettings = {
  platformName: string;
  tagline: string;
  supportEmail: string;
  contactEmail: string;

  allowRegistrations: boolean;
  requireEmailVerification: boolean;
  maxProfiles: number;

  heroAutoplay: boolean;
  autoplayMuted: boolean;
  homepageRows: number;

  premiumEnabled: boolean;
  monthlyPrice: number;
  annualPrice: number;
  freeTrialDays: number;

  adsEnabled: boolean;
  preRollAds: boolean;
  midRollAds: boolean;
  bannerAds: boolean;

  partnerApplications: boolean;
  defaultRevenueShare: number;

  notificationsEnabled: boolean;

  moderationEnabled: boolean;

  maintenanceMode: boolean;

  aiRecommendations: boolean;
  aiEditorial: boolean;
  aiModeration: boolean;
};