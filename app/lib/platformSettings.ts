import "server-only";

import { prisma } from "@/app/lib/prisma";

export type PublicPlatformSettings = {
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

export const defaultPlatformSettings: PublicPlatformSettings = {
  platformName: "SourceTV",
  tagline: "The Next Generation of Entertainment",
  supportEmail: "support@sourcetv.com",
  contactEmail: "contact@sourcetv.com",

  allowRegistrations: true,
  requireEmailVerification: false,
  maxProfiles: 5,

  heroAutoplay: true,
  autoplayMuted: true,
  homepageRows: 12,

  premiumEnabled: false,
  monthlyPrice: 8.99,
  annualPrice: 89.99,
  freeTrialDays: 7,

  adsEnabled: true,
  preRollAds: true,
  midRollAds: false,
  bannerAds: true,

  partnerApplications: true,
  defaultRevenueShare: 50,

  notificationsEnabled: true,
  moderationEnabled: true,
  maintenanceMode: false,

  aiRecommendations: true,
  aiEditorial: false,
  aiModeration: false,
};

export async function getPlatformSettings(): Promise<PublicPlatformSettings> {
  try {
    const settings = await prisma.platformSettings.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!settings) {
      return defaultPlatformSettings;
    }

    return {
      platformName:
        settings.platformName ||
        defaultPlatformSettings.platformName,

      tagline:
        settings.tagline ||
        defaultPlatformSettings.tagline,

      supportEmail:
        settings.supportEmail ||
        defaultPlatformSettings.supportEmail,

      contactEmail:
        settings.contactEmail ||
        defaultPlatformSettings.contactEmail,

      allowRegistrations: settings.allowRegistrations,

      requireEmailVerification:
        settings.requireEmailVerification,

      maxProfiles: settings.maxProfiles,

      heroAutoplay: settings.heroAutoplay,
      autoplayMuted: settings.autoplayMuted,
      homepageRows: settings.homepageRows,

      premiumEnabled: settings.premiumEnabled,
      monthlyPrice: settings.monthlyPrice,
      annualPrice: settings.annualPrice,
      freeTrialDays: settings.freeTrialDays,

      adsEnabled: settings.adsEnabled,
      preRollAds: settings.preRollAds,
      midRollAds: settings.midRollAds,
      bannerAds: settings.bannerAds,

      partnerApplications:
        settings.partnerApplications,

      defaultRevenueShare:
        settings.defaultRevenueShare,

      notificationsEnabled:
        settings.notificationsEnabled,

      moderationEnabled:
        settings.moderationEnabled,

      maintenanceMode:
        settings.maintenanceMode,

      aiRecommendations:
        settings.aiRecommendations,

      aiEditorial: settings.aiEditorial,
      aiModeration: settings.aiModeration,
    };
  } catch (error) {
    console.error(
      "GET PLATFORM SETTINGS ERROR:",
      error
    );

    return defaultPlatformSettings;
  }
}