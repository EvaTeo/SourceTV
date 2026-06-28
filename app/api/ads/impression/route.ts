import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const campaignId = String(body.campaignId || "").trim();
    const projectId = String(body.projectId || "").trim();
    const placement = String(body.placement || "pre_roll").trim();

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required." },
        { status: 400 }
      );
    }

    const impression = await prisma.adImpression.create({
      data: {
        campaignId,
        projectId: projectId || null,
        placement,
        completed: Boolean(body.completed),
        skipped: Boolean(body.skipped),
        clicked: Boolean(body.clicked),
        watchedSeconds: Number(body.watchedSeconds || 0),
      },
    });

    return NextResponse.json(impression);
  } catch (error) {
    console.error("CREATE AD IMPRESSION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to track ad impression." },
      { status: 500 }
    );
  }
}