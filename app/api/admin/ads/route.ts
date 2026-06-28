import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

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
      orderBy: {
        createdAt: "desc",
      },
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

    const name = String(body.name || "").trim();
    const advertiser = String(body.advertiser || "").trim();
    const placement = String(body.placement || "pre_roll").trim();
    const adSource = String(body.adSource || "direct").trim();
    const vastTagUrl = String(body.vastTagUrl || "").trim();
    const videoUrl = String(body.videoUrl || "").trim();
    const clickUrl = String(body.clickUrl || "").trim();
    const imageUrl = String(body.imageUrl || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Campaign name is required." },
        { status: 400 }
      );
    }

    if (adSource !== "direct" && adSource !== "google") {
      return NextResponse.json(
        { error: "Ad source must be direct or google." },
        { status: 400 }
      );
    }

    if (adSource === "direct" && !videoUrl && placement !== "banner") {
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
        placement,
        adSource,
        vastTagUrl: vastTagUrl || null,
        videoUrl: videoUrl || null,
        clickUrl: clickUrl || null,
        imageUrl: imageUrl || null,
        status: "draft",
        skipAfterSeconds: Number(body.skipAfterSeconds || 5),
        durationSeconds: Number(body.durationSeconds || 30),
        budgetCents: Number(body.budgetCents || 0),
        cpmCents: Number(body.cpmCents || 1200),
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
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

    const { campaignId, status } = await req.json();

    if (!campaignId || !status) {
      return NextResponse.json(
        { error: "Campaign ID and status are required." },
        { status: 400 }
      );
    }

    const campaign = await prisma.adCampaign.update({
      where: {
        id: campaignId,
      },
      data: {
        status,
      },
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