import { prisma } from "@/app/lib/prisma";

type MergeRevisionInput = {
  revisionId: string;
  reviewedByEmail: string;
};

export class MergeRevisionError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);

    this.name = "MergeRevisionError";
    this.status = status;
  }
}

export async function mergeRevision({
  revisionId,
  reviewedByEmail,
}: MergeRevisionInput) {
  return prisma.$transaction(async (tx) => {
    const revision =
      await tx.projectRevision.findUnique({
        where: {
          id: revisionId,
        },
      });

    if (!revision) {
      throw new MergeRevisionError(
        "Revision could not be found.",
        404
      );
    }

    if (revision.status !== "pending") {
      throw new MergeRevisionError(
        `This revision cannot be approved because its current status is "${revision.status}".`,
        409
      );
    }

    const project =
      await tx.projectSubmission.findUnique({
        where: {
          id: revision.projectId,
        },
        select: {
          id: true,
          title: true,
          creatorName: true,
          creatorCompany: true,
          updatedAt: true,
        },
      });

    if (!project) {
      throw new MergeRevisionError(
        "The project connected to this revision could not be found.",
        404
      );
    }

    if (
      project.updatedAt.getTime() !==
      revision.baseProjectUpdatedAt.getTime()
    ) {
      throw new MergeRevisionError(
        "The live project changed after this revision was submitted. Review the current project before approving this revision.",
        409
      );
    }

    const reviewedAt = new Date();

    const updatedProject =
      await tx.projectSubmission.update({
        where: {
          id: revision.projectId,
        },
        data: {
          title: revision.proposedTitle,
          description:
            revision.proposedDescription,
          type: revision.proposedType,
          genre: revision.proposedGenre,
          year: revision.proposedYear,

          videoUrl:
            revision.proposedVideoUrl,
          mainVideoUrl:
            revision.proposedMainVideoUrl,
          trailerUrl:
            revision.proposedTrailerUrl,

          thumbnailUrl:
            revision.proposedThumbnailUrl,
          backdropUrl:
            revision.proposedBackdropUrl,
          titleLogoUrl:
            revision.proposedTitleLogoUrl,
          cardArtUrl:
            revision.proposedCardArtUrl,

          bunnyVideoId:
            revision.proposedBunnyVideoId,
          bunnyLibraryId:
            revision.proposedBunnyLibraryId,

          maturityRating:
            revision.proposedMaturityRating,

          runtime:
            revision.proposedRuntime,

          creatorName:
            revision.proposedCreatorName,
          creatorCompany:
            revision.proposedCreatorCompany,
        },
      });

    const approvedRevision =
      await tx.projectRevision.update({
        where: {
          id: revision.id,
        },
        data: {
          status: "approved",
          reviewedByEmail,
          reviewedAt,
          approvedAt: reviewedAt,
        },
      });

    const partnerName =
      updatedProject.creatorName ||
      updatedProject.creatorCompany ||
      null;

    const notification =
      await tx.partnerMessage.create({
        data: {
          projectId: updatedProject.id,
          partnerEmail:
            revision.submittedByEmail,
          partnerName,
          senderTeam:
            "SourceTV Content Review",
          subject: `Revision approved: ${updatedProject.title}`,
          body: createApprovalMessage({
            projectTitle:
              updatedProject.title,
            versionNumber:
              approvedRevision.versionNumber,
          }),
          isRead: false,
        },
      });

    return {
      project: updatedProject,
      revision: approvedRevision,
      notification,
    };
  });
}

function createApprovalMessage({
  projectTitle,
  versionNumber,
}: {
  projectTitle: string;
  versionNumber: number;
}) {
  return [
    `Your revision for "${projectTitle}" has been approved.`,
    "",
    `Version ${versionNumber} has been merged into the live project record.`,
    "",
    "You can review the updated project and its revision history from your SourceTV Partner dashboard.",
  ].join("\n");
}