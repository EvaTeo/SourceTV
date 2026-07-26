import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const revisions = await prisma.projectRevision.findMany({
      orderBy: {
        submittedAt: "desc",
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            genre: true,
            year: true,
            maturityRating: true,
            runtime: true,
            creatorName: true,
            creatorCompany: true,
            thumbnailUrl: true,
            backdropUrl: true,
            titleLogoUrl: true,
            cardArtUrl: true,
            status: true,
            updatedAt: true,
          },
        },
      },
    });

    const counts = {
      total: revisions.length,
      pending: revisions.filter(
        (revision) => revision.status === "pending"
      ).length,
      changesRequested: revisions.filter(
        (revision) =>
          revision.status === "changes_requested"
      ).length,
      approved: revisions.filter(
        (revision) => revision.status === "approved"
      ).length,
      rejected: revisions.filter(
        (revision) => revision.status === "rejected"
      ).length,
      withdrawn: revisions.filter(
        (revision) => revision.status === "withdrawn"
      ).length,
    };

    return NextResponse.json({
      revisions,
      counts,
    });
  } catch (error) {
    console.error(
      "Unable to load admin project revisions:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load project revisions.",
      },
      {
        status: 500,
      }
    );
  }
}