import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type AdCampaignWithCount = Awaited<
  ReturnType<typeof prisma.adCampaign.findMany>
>[number] & {
  _count?: {
    impressions: number;
  };
};

function normalize(value: string | null) {
  return value?.trim().toLowerCase() || null;
}

function splitList(value?: string | null) {
  return (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function isWithinSchedule(campaign: AdCampaignWithCount, now: Date) {
  if (campaign.startDate && campaign.startDate > now) return false;
  if (campaign.endDate && campaign.endDate < now) return false;
  return true;
}

function hasBudgetRemaining(campaign: AdCampaignWithCount) {
  if (!campaign.budgetCents || campaign.budgetCents <= 0) return true;
  return campaign.spentCents < campaign.budgetCents;
}

function hasImpressionsRemaining(campaign: AdCampaignWithCount) {
  if (!campaign.maxImpressions) return true;
  return (campaign._count?.impressions || 0) < campaign.maxImpressions;
}

function hasValidCreative(campaign: AdCampaignWithCount) {
  if (campaign.adSource === "google") {
    return Boolean(campaign.vastTagUrl);
  }

  if (campaign.placement === "banner") {
    return Boolean(campaign.imageUrl || campaign.videoUrl);
  }

  return Boolean(campaign.videoUrl);
}

function matchesTargeting(
  campaign: AdCampaignWithCount,
  context: {
    contentType: string | null;
    genre: string | null;
    rating: string | null;
    featured: boolean;
    projectId: string | null;
  }
) {
  const targetType = normalize(campaign.targetType) || "all";

  if (targetType === "all") return true;

  if (targetType === "movie") {
    return context.contentType === "movie" || context.contentType === "film";
  }

  if (targetType === "show") {
    return context.contentType === "show" || context.contentType === "series";
  }

  if (targetType === "animation") {
    return (
      context.contentType === "animation" ||
      context.genre === "animation" ||
      context.genre === "animated"
    );
  }

  if (targetType === "genre") {
    const genres = splitList(campaign.targetGenres);
    if (!genres.length) return true;
    return Boolean(context.genre && genres.includes(context.genre));
  }

  if (targetType === "rating") {
    const ratings = splitList(campaign.targetRatings);
    if (!ratings.length) return true;
    return Boolean(context.rating && ratings.includes(context.rating));
  }

  if (targetType === "featured") {
    return context.featured === true;
  }

  if (targetType === "project") {
    if (!campaign.targetProjectId) return true;
    return campaign.targetProjectId === context.projectId;
  }

  return true;
}

function weightedPick(campaigns: AdCampaignWithCount[]) {
  if (!campaigns.length) return null;

  const totalWeight = campaigns.reduce((sum, campaign) => {
    return sum + Math.max(campaign.priority || 1, 1);
  }, 0);

  let random = Math.random() * totalWeight;

  for (const campaign of campaigns) {
    random -= Math.max(campaign.priority || 1, 1);

    if (random <= 0) {
      return campaign;
    }
  }

  return campaigns[0];
}

function decorateCampaignForViewer(
  campaign: AdCampaignWithCount,
  premium: boolean
) {
  const isHouseAd = campaign.adType === "house";
  const isGoogleAd = campaign.adSource === "google";

  let canSkip = false;
  let skipAfterSeconds: number | null = null;

  if (isHouseAd) {
    canSkip = false;
    skipAfterSeconds = null;
  } else if (isGoogleAd) {
    canSkip = false;
    skipAfterSeconds = null;
  } else if (campaign.skipPolicy === "after_delay") {
    canSkip = premium ? campaign.premiumCanSkip : true;
    skipAfterSeconds = canSkip ? campaign.skipAfterSeconds : null;
  } else {
    canSkip = false;
    skipAfterSeconds = null;
  }

  return {
    ...campaign,
    canSkip,
    skipAfterSeconds,
    isHouseAd,
    isGoogleAd,
  };
}

export async function GET(request: Request) {
  try {
    const now = new Date();
    const { searchParams } = new URL(request.url);

    const placement = normalize(searchParams.get("placement")) || "pre_roll";
    const contentType = normalize(searchParams.get("contentType"));
    const genre = normalize(searchParams.get("genre"));
    const rating = normalize(searchParams.get("rating"));
    const featured = searchParams.get("featured") === "true";
    const premium = searchParams.get("premium") === "true";
    const projectId = searchParams.get("projectId");

    const campaigns = await prisma.adCampaign.findMany({
      where: {
        status: "active",
        placement,
      },
      include: {
        _count: {
          select: {
            impressions: true,
          },
        },
      },
      orderBy: [
        {
          priority: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    const eligibleCampaigns = campaigns.filter((campaign) => {
      return (
        isWithinSchedule(campaign, now) &&
        hasBudgetRemaining(campaign) &&
        hasImpressionsRemaining(campaign) &&
        hasValidCreative(campaign) &&
        matchesTargeting(campaign, {
          contentType,
          genre,
          rating,
          featured,
          projectId,
        })
      );
    });

    const directWinner = weightedPick(eligibleCampaigns);

    if (directWinner) {
      return NextResponse.json(decorateCampaignForViewer(directWinner, premium));
    }

    const fallbackHouseAds = campaigns.filter((campaign) => {
      return (
        campaign.adType === "house" &&
        isWithinSchedule(campaign, now) &&
        hasValidCreative(campaign)
      );
    });

    const fallbackWinner = weightedPick(fallbackHouseAds);

    if (fallbackWinner) {
      return NextResponse.json(
        decorateCampaignForViewer(fallbackWinner, premium)
      );
    }

    return NextResponse.json(null);
  } catch (error) {
    console.error("LOAD ACTIVE AD ERROR:", error);
    return NextResponse.json(null);
  }
}