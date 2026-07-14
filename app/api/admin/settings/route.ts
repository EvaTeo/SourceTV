import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

async function getSettings() {
  const existing =
    await prisma.platformSettings.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

  if (existing) {
    return existing;
  }

  return prisma.platformSettings.create({
    data: {},
  });
}

export async function GET() {
  try {
    const settings = await getSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET PLATFORM SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load platform settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const current = await getSettings();

    const updated =
      await prisma.platformSettings.update({
        where: {
          id: current.id,
        },
        data: {
          platformName:
            typeof body.platformName === "string"
              ? body.platformName.trim()
              : current.platformName,

          tagline:
            typeof body.tagline === "string"
              ? body.tagline.trim()
              : current.tagline,

          supportEmail:
            typeof body.supportEmail === "string"
              ? body.supportEmail.trim()
              : current.supportEmail,

          contactEmail:
            typeof body.contactEmail === "string"
              ? body.contactEmail.trim()
              : current.contactEmail,

          allowRegistrations:
            typeof body.allowRegistrations === "boolean"
              ? body.allowRegistrations
              : current.allowRegistrations,

          requireEmailVerification:
            typeof body.requireEmailVerification === "boolean"
              ? body.requireEmailVerification
              : current.requireEmailVerification,

          maxProfiles:
            typeof body.maxProfiles === "number"
              ? body.maxProfiles
              : current.maxProfiles,

          heroAutoplay:
            typeof body.heroAutoplay === "boolean"
              ? body.heroAutoplay
              : current.heroAutoplay,

          autoplayMuted:
            typeof body.autoplayMuted === "boolean"
              ? body.autoplayMuted
              : current.autoplayMuted,

          homepageRows:
            typeof body.homepageRows === "number"
              ? body.homepageRows
              : current.homepageRows,

          premiumEnabled:
            typeof body.premiumEnabled === "boolean"
              ? body.premiumEnabled
              : current.premiumEnabled,

          monthlyPrice:
            typeof body.monthlyPrice === "number"
              ? body.monthlyPrice
              : current.monthlyPrice,

          annualPrice:
            typeof body.annualPrice === "number"
              ? body.annualPrice
              : current.annualPrice,

          freeTrialDays:
            typeof body.freeTrialDays === "number"
              ? body.freeTrialDays
              : current.freeTrialDays,

          adsEnabled:
            typeof body.adsEnabled === "boolean"
              ? body.adsEnabled
              : current.adsEnabled,

          preRollAds:
            typeof body.preRollAds === "boolean"
              ? body.preRollAds
              : current.preRollAds,

          midRollAds:
            typeof body.midRollAds === "boolean"
              ? body.midRollAds
              : current.midRollAds,

          bannerAds:
            typeof body.bannerAds === "boolean"
              ? body.bannerAds
              : current.bannerAds,

          partnerApplications:
            typeof body.partnerApplications === "boolean"
              ? body.partnerApplications
              : current.partnerApplications,

          defaultRevenueShare:
            typeof body.defaultRevenueShare === "number"
              ? body.defaultRevenueShare
              : current.defaultRevenueShare,

          notificationsEnabled:
            typeof body.notificationsEnabled === "boolean"
              ? body.notificationsEnabled
              : current.notificationsEnabled,

          moderationEnabled:
            typeof body.moderationEnabled === "boolean"
              ? body.moderationEnabled
              : current.moderationEnabled,

          maintenanceMode:
            typeof body.maintenanceMode === "boolean"
              ? body.maintenanceMode
              : current.maintenanceMode,

          aiRecommendations:
            typeof body.aiRecommendations === "boolean"
              ? body.aiRecommendations
              : current.aiRecommendations,

          aiEditorial:
            typeof body.aiEditorial === "boolean"
              ? body.aiEditorial
              : current.aiEditorial,

          aiModeration:
            typeof body.aiModeration === "boolean"
              ? body.aiModeration
              : current.aiModeration,
        },
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH PLATFORM SETTINGS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to save platform settings.",
      },
      {
        status: 500,
      }
    );
  }
}