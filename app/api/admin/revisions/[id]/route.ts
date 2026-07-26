import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
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

  const { id } = await context.params;

  try {
    const revision =
      await prisma.projectRevision.findUnique({
        where: {
          id,
        },
        include: {
          project: true,
        },
      });

    if (!revision) {
      return NextResponse.json(
        {
          error: "Revision not found.",
        },
        {
          status: 404,
        }
      );
    }

    const changedFields = [
      {
        field: "title",
        liveValue: revision.project.title,
        proposedValue: revision.proposedTitle,
      },
      {
        field: "description",
        liveValue: revision.project.description,
        proposedValue: revision.proposedDescription,
      },
      {
        field: "type",
        liveValue: revision.project.type,
        proposedValue: revision.proposedType,
      },
      {
        field: "genre",
        liveValue: revision.project.genre,
        proposedValue: revision.proposedGenre,
      },
      {
        field: "year",
        liveValue: revision.project.year,
        proposedValue: revision.proposedYear,
      },
      {
        field: "maturityRating",
        liveValue: revision.project.maturityRating,
        proposedValue:
          revision.proposedMaturityRating,
      },
      {
        field: "runtime",
        liveValue: revision.project.runtime,
        proposedValue: revision.proposedRuntime,
      },
      {
        field: "creatorName",
        liveValue: revision.project.creatorName,
        proposedValue:
          revision.proposedCreatorName,
      },
      {
        field: "creatorCompany",
        liveValue:
          revision.project.creatorCompany,
        proposedValue:
          revision.proposedCreatorCompany,
      },
      {
        field: "mainVideoUrl",
        liveValue:
          revision.project.mainVideoUrl ??
          revision.project.videoUrl,
        proposedValue:
          revision.proposedMainVideoUrl ??
          revision.proposedVideoUrl,
      },
      {
        field: "trailerUrl",
        liveValue: revision.project.trailerUrl,
        proposedValue:
          revision.proposedTrailerUrl,
      },
      {
        field: "thumbnailUrl",
        liveValue:
          revision.project.thumbnailUrl,
        proposedValue:
          revision.proposedThumbnailUrl,
      },
      {
        field: "backdropUrl",
        liveValue:
          revision.project.backdropUrl,
        proposedValue:
          revision.proposedBackdropUrl,
      },
      {
        field: "titleLogoUrl",
        liveValue:
          revision.project.titleLogoUrl,
        proposedValue:
          revision.proposedTitleLogoUrl,
      },
      {
        field: "cardArtUrl",
        liveValue:
          revision.project.cardArtUrl,
        proposedValue:
          revision.proposedCardArtUrl,
      },
    ].filter(({ liveValue, proposedValue }) => {
      const normalizedLiveValue =
        liveValue ?? null;

      const normalizedProposedValue =
        proposedValue ?? null;

      return (
        normalizedLiveValue !==
        normalizedProposedValue
      );
    });

    return NextResponse.json({
      revision,
      changedFields,
      changedFieldCount:
        changedFields.length,
    });
  } catch (error) {
    console.error(
      `Unable to load revision ${id}:`,
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load revision.",
      },
      {
        status: 500,
      }
    );
  }
}