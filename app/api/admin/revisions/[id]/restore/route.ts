import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: NextRequest,
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
    const restoredRevision = await prisma.$transaction(
      async (transaction) => {
        const sourceRevision =
          await transaction.projectRevision.findUnique({
            where: {
              id,
            },
            include: {
              project: {
                select: {
                  id: true,
                  title: true,
                  updatedAt: true,
                },
              },
            },
          });

        if (!sourceRevision) {
          throw new RestoreRevisionError(
            "The revision you selected could not be found.",
            404
          );
        }

        const latestVersion =
          await transaction.projectRevision.aggregate({
            where: {
              projectId: sourceRevision.projectId,
            },
            _max: {
              versionNumber: true,
            },
          });

        const nextVersionNumber =
          (latestVersion._max.versionNumber ?? 0) + 1;

        return transaction.projectRevision.create({
          data: {
            projectId: sourceRevision.projectId,
            versionNumber: nextVersionNumber,

            status: "pending",

            baseProjectUpdatedAt:
              sourceRevision.project.updatedAt,

            submittedByEmail: user.email,
            reviewedByEmail: null,

            partnerNotes: null,
            adminNotes: null,

            changeSummary:
              `Restored from Version ${sourceRevision.versionNumber}. ` +
              `Created by ${user.email} for a new admin review.`,

            proposedTitle:
              sourceRevision.proposedTitle,

            proposedDescription:
              sourceRevision.proposedDescription,

            proposedType:
              sourceRevision.proposedType,

            proposedGenre:
              sourceRevision.proposedGenre,

            proposedYear:
              sourceRevision.proposedYear,

            proposedVideoUrl:
              sourceRevision.proposedVideoUrl,

            proposedMainVideoUrl:
              sourceRevision.proposedMainVideoUrl,

            proposedTrailerUrl:
              sourceRevision.proposedTrailerUrl,

            proposedThumbnailUrl:
              sourceRevision.proposedThumbnailUrl,

            proposedBackdropUrl:
              sourceRevision.proposedBackdropUrl,

            proposedTitleLogoUrl:
              sourceRevision.proposedTitleLogoUrl,

            proposedCardArtUrl:
              sourceRevision.proposedCardArtUrl,

            proposedBunnyVideoId:
              sourceRevision.proposedBunnyVideoId,

            proposedBunnyLibraryId:
              sourceRevision.proposedBunnyLibraryId,

            proposedMaturityRating:
              sourceRevision.proposedMaturityRating,

            proposedRuntime:
              sourceRevision.proposedRuntime,

            proposedCreatorName:
              sourceRevision.proposedCreatorName,

            proposedCreatorCompany:
              sourceRevision.proposedCreatorCompany,
          },
          include: {
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });
      }
    );

    return NextResponse.json(
      {
        success: true,
        revision: restoredRevision,
        revisionId: restoredRevision.id,
        message: `Version ${restoredRevision.versionNumber} was created for review.`,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    if (error instanceof RestoreRevisionError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: error.status,
        }
      );
    }

    console.error("Failed to restore revision:", error);

    return NextResponse.json(
      {
        error:
          "The revision could not be restored. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}

class RestoreRevisionError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "RestoreRevisionError";
    this.status = status;
  }
}