import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    const content = await prisma.projectSubmission.findMany({
      where: {
        OR: [
          {
            workflowStage: "published",
          },
          {
            workflowStage: "scheduled",
            scheduledAt: {
              lte: now,
            },
          },
        ],
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          featuredRank: "asc",
        },
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load public content",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}