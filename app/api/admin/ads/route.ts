import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

function cleanString(value: unknown, fallback = "") {
  return String(value || fallback).trim();
}

function cleanNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function cleanDate(value: unknown) {
  const text = cleanString(value);
  return text ? new Date(text) : null;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const campaigns = await prisma.adCampaign.findMany({
      include: {
        impressions: true,
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

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("LOAD ADS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load ad campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const name = cleanString(body.name);
    const advertiser = cleanString(body.advertiser);
    const status = cleanString(body.status, "draft");

    const adSource = cleanString(body.adSource, "direct");
    const vastTagUrl = cleanString(body.vastTagUrl);

    const adType = cleanString(body.adType, "commercial");
    const objective = cleanString(body.objective, "awareness");
    const placement = cleanString(body.placement, "pre_roll");

    const videoUrl = cleanString(body.videoUrl);
    const clickUrl = cleanString(body.clickUrl);
    const imageUrl = cleanString(body.imageUrl);

    const skipPolicy = cleanString(body.skipPolicy, "after_delay");
    const skipAfterSeconds = cleanNumber(body.skipAfterSeconds, 5);
    const premiumCanSkip = Boolean(body.premiumCanSkip ?? true);

    const durationSeconds = cleanNumber(body.durationSeconds, 30);

    const targetType = cleanString(body.targetType, "all");
    const targetGenres = cleanString(body.targetGenres);
    const targetRatings = cleanString(body.targetRatings);
    const targetProjectId = cleanString(body.targetProjectId);

    const priority = cleanNumber(body.priority, 1);

    const budgetCents = cleanNumber(body.budgetCents, 0);
    const spentCents = cleanNumber(body.spentCents, 0);
    const cpmCents = cleanNumber(body.cpmCents, 1200);
    const maxImpressionsRaw = cleanString(body.maxImpressions);
    const maxImpressions = maxImpressionsRaw
      ? cleanNumber(maxImpressionsRaw, 0)
      : null;

    if (!name) {
      return NextResponse.json(
        { error: "Campaign name is required." },
        { status: 400 }
      );
    }

    if (!["direct", "google"].includes(adSource)) {
      return NextResponse.json(
        { error: "Ad source must be direct or google." },
        { status: 400 }
      );
    }

    if (!["commercial", "house", "sponsor"].includes(adType)) {
      return NextResponse.json(
        { error: "Ad type must be commercial, house, or sponsor." },
        { status: 400 }
      );
    }

    if (!["awareness", "traffic", "promotion", "branding"].includes(objective)) {
      return NextResponse.json(
        { error: "Invalid campaign objective." },
        { status: 400 }
      );
    }

    if (!["pre_roll", "mid_roll", "post_roll", "banner"].includes(placement)) {
      return NextResponse.json(
        { error: "Invalid ad placement." },
        { status: 400 }
      );
    }

    if (!["never", "after_delay"].includes(skipPolicy)) {
      return NextResponse.json(
        { error: "Skip policy must be never or after_delay." },
        { status: 400 }
      );
    }

    if (
      !["all", "movie", "show", "animation", "genre", "rating", "featured"].includes(
        targetType
      )
    ) {
      return NextResponse.json(
        { error: "Invalid target type." },
        { status: 400 }
      );
    }

    if (adSource === "direct" && placement !== "banner" && !videoUrl) {
      return NextResponse.json(
        { error: "Direct video ads need an Ad Video URL." },
        { status: 400 }
      );
    }

    if (adSource === "direct" && placement === "banner" && !imageUrl) {
      return NextResponse.json(
        { error: "Direct banner ads need an Image / Banner URL." },
        { status: 400 }
      );
    }

    if (adSource === "google" && !vastTagUrl) {
      return NextResponse.json(
        { error: "Google ads need a VAST tag URL." },
        { status: 400 }
      );
    }

    const campaign = await prisma.adCampaign.create({
      data: {
        name,
        advertiser: advertiser || null,
        status,

        adSource,
        vastTagUrl: vastTagUrl || null,

        adType,
        objective,
        placement,

        videoUrl: videoUrl || null,
        clickUrl: clickUrl || null,
        imageUrl: imageUrl || null,

        skipPolicy,
        skipAfterSeconds,
        premiumCanSkip,

        durationSeconds,

        targetType,
        targetGenres: targetGenres || null,
        targetRatings: targetRatings || null,
        targetProjectId: targetProjectId || null,

        priority,

        startDate: cleanDate(body.startDate),
        endDate: cleanDate(body.endDate),

        budgetCents,
        spentCents,
        cpmCents,
        maxImpressions,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("CREATE AD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create ad campaign" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const campaignId = cleanString(body.campaignId);
    const status = cleanString(body.status);

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required." },
        { status: 400 }
      );
    }

    const data: any = {};

    if (status) data.status = status;
    if (body.priority !== undefined) data.priority = cleanNumber(body.priority, 1);
    if (body.spentCents !== undefined)
      data.spentCents = cleanNumber(body.spentCents, 0);

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No campaign updates were provided." },
        { status: 400 }
      );
    }

    const campaign = await prisma.adCampaign.update({
      where: {
        id: campaignId,
      },
      data,
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("UPDATE AD ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update ad campaign" },
      { status: 500 }
    );
  }
}