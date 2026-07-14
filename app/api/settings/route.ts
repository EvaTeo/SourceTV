import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const settings =
      await prisma.platformSettings.findFirst();

    return NextResponse.json({
      platformName:
        settings?.platformName || "SourceTV",

      tagline:
        settings?.tagline ||
        "The Next Generation of Entertainment",

      supportEmail:
        settings?.supportEmail ||
        "support@sourcetv.com",

      contactEmail:
        settings?.contactEmail ||
        "contact@sourcetv.com",

      allowRegistrations:
        settings?.allowRegistrations ?? true,

      requireEmailVerification:
        settings?.requireEmailVerification ??
        false,

      maxProfiles:
        settings?.maxProfiles ?? 5,

      heroAutoplay:
        settings?.heroAutoplay ?? true,

      autoplayMuted:
        settings?.autoplayMuted ?? true,

      homepageRows:
        settings?.homepageRows ?? 12,

      premiumEnabled:
        settings?.premiumEnabled ?? false,

      monthlyPrice:
        settings?.monthlyPrice ?? 8.99,

      annualPrice:
        settings?.annualPrice ?? 89.99,

      freeTrialDays:
        settings?.freeTrialDays ?? 7,

      adsEnabled:
        settings?.adsEnabled ?? true,

      preRollAds:
        settings?.preRollAds ?? true,

      midRollAds:
        settings?.midRollAds ?? false,

      bannerAds:
        settings?.bannerAds ?? true,

      partnerApplications:
        settings?.partnerApplications ?? true,

      defaultRevenueShare:
        settings?.defaultRevenueShare ?? 50,

      notificationsEnabled:
        settings?.notificationsEnabled ?? true,

      moderationEnabled:
        settings?.moderationEnabled ?? true,

      maintenanceMode:
        settings?.maintenanceMode ?? false,

      aiRecommendations:
        settings?.aiRecommendations ?? true,

      aiEditorial:
        settings?.aiEditorial ?? false,

      aiModeration:
        settings?.aiModeration ?? false,
    });
  } catch (error) {
    console.error(
      "PUBLIC SETTINGS LOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        platformName: "SourceTV",
        tagline:
          "The Next Generation of Entertainment",
        supportEmail:
          "support@sourcetv.com",
        contactEmail:
          "contact@sourcetv.com",
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
      },
      { status: 500 }
    );
  }
}