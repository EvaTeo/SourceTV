import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    const campaign = await prisma.adCampaign.findFirst({
      where: {
        status: "active",
        adSource: "direct",
        placement: "pre_roll",
        videoUrl: {
          not: null,
        },
        OR: [
          {
            startDate: null,
            endDate: null,
          },
          {
            startDate: {
              lte: now,
            },
            endDate: null,
          },
          {
            startDate: null,
            endDate: {
              gte: now,
            },
          },
          {
            startDate: {
              lte: now,
            },
            endDate: {
              gte: now,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(campaign || null);
  } catch (error) {
    console.error("LOAD ACTIVE AD ERROR:", error);

    return NextResponse.json(null);
  }
}