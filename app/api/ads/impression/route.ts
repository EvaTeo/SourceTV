import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

function cleanString(value: unknown) {
  return String(value || "").trim();
}

function cleanNumber(value: unknown) {
  const number = Number(value || 0);

  if (Number.isNaN(number) || number < 0) {
    return 0;
  }

  return Math.floor(number);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const campaignId = cleanString(body.campaignId);
    const projectId = cleanString(body.projectId);
    const profileId = cleanString(body.profileId);
    const placement = cleanString(body.placement) || "pre_roll";

    const completed = Boolean(body.completed);
    const skipped = Boolean(body.skipped);
    const clicked = Boolean(body.clicked);
    const watchedSeconds = cleanNumber(body.watchedSeconds);

    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required." },
        { status: 400 }
      );
    }

    const campaign = await prisma.adCampaign.findUnique({
      where: {
        id: campaignId,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found." },
        { status: 404 }
      );
    }

    const spendIncrementCents =
      campaign.budgetCents > 0 ? Math.max(1, Math.round(campaign.cpmCents / 1000)) : 0;

    const impression = await prisma.$transaction(async (tx) => {
      const createdImpression = await tx.adImpression.create({
        data: {
          campaignId,
          projectId: projectId || null,
          profileId: profileId || null,
          placement,
          completed,
          skipped,
          clicked,
          watchedSeconds,
        },
      });

      if (spendIncrementCents > 0) {
        await tx.adCampaign.update({
          where: {
            id: campaignId,
          },
          data: {
            spentCents: {
              increment: spendIncrementCents,
            },
          },
        });
      }

      return createdImpression;
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