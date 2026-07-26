import { prisma } from "@/app/lib/prisma";
import type { ParsedProjectForm } from "./parseProjectForm";

type BunnyUploadResult = {
  guid: string;
  iframeUrl: string;
  hlsUrl: string;
  thumbnailUrl: string;
};

type UploadedImages = {
  thumbnailUrl: string | null;
  backdropUrl: string | null;
  titleLogoUrl: string | null;
};

type RevisionProject = {
  id: string;
  updatedAt: Date;

  videoUrl: string | null;
  mainVideoUrl: string | null;
  trailerUrl: string | null;

  thumbnailUrl: string | null;
  backdropUrl: string | null;
  titleLogoUrl: string | null;
  cardArtUrl: string | null;

  bunnyVideoId: string | null;
  bunnyLibraryId: string | null;
};

type RevisionUser = {
  email: string;
};

type CreateRevisionInput = {
  project: RevisionProject;
  user: RevisionUser;
  form: ParsedProjectForm;

  mainVideo: BunnyUploadResult | null;
  trailerVideo: BunnyUploadResult | null;

  images: UploadedImages;
};

export class RevisionSubmissionError extends Error {
  status: number;

  constructor(message: string, status = 409) {
    super(message);

    this.name = "RevisionSubmissionError";
    this.status = status;
  }
}

export async function createRevision({
  project,
  user,
  form,
  mainVideo,
  trailerVideo,
  images,
}: CreateRevisionInput) {
  const pendingRevision =
    await prisma.projectRevision.findFirst({
      where: {
        projectId: project.id,
        status: "pending",
      },
      select: {
        id: true,
      },
    });

  if (pendingRevision) {
    throw new RevisionSubmissionError(
      "There is already a pending revision awaiting review."
    );
  }

  const latestRevision =
    await prisma.projectRevision.findFirst({
      where: {
        projectId: project.id,
      },
      orderBy: {
        versionNumber: "desc",
      },
      select: {
        versionNumber: true,
      },
    });

  const versionNumber =
    (latestRevision?.versionNumber ?? 0) + 1;

  const mainVideoUrl =
    mainVideo?.hlsUrl ??
    project.mainVideoUrl ??
    project.videoUrl;

  if (!mainVideoUrl) {
    throw new RevisionSubmissionError(
      "This project does not have a main video. Upload one before submitting changes.",
      400
    );
  }

  const thumbnailUrl =
    images.thumbnailUrl ??
    project.thumbnailUrl ??
    mainVideo?.thumbnailUrl ??
    null;

  const backdropUrl =
    images.backdropUrl ??
    project.backdropUrl ??
    thumbnailUrl;

  return prisma.projectRevision.create({
    data: {
      projectId: project.id,
      versionNumber,
      status: "pending",

      baseProjectUpdatedAt:
        project.updatedAt,

      submittedByEmail:
        user.email,

      partnerNotes:
        form.partnerNotes,

      changeSummary:
        form.changeSummary,

      proposedTitle:
        form.title,

      proposedDescription:
        form.description,

      proposedType:
        form.type,

      proposedGenre:
        form.genre,

      proposedYear:
        form.year,

      proposedMaturityRating:
        form.maturityRating,

      proposedRuntime:
        form.runtime,

      proposedCreatorName:
        form.creatorName || null,

      proposedCreatorCompany:
        form.creatorCompany,

      proposedVideoUrl:
        mainVideoUrl,

      proposedMainVideoUrl:
        mainVideoUrl,

      proposedTrailerUrl:
        trailerVideo?.hlsUrl ??
        project.trailerUrl,

      proposedThumbnailUrl:
        thumbnailUrl,

      proposedBackdropUrl:
        backdropUrl,

      proposedTitleLogoUrl:
        images.titleLogoUrl ??
        project.titleLogoUrl,

      proposedCardArtUrl:
        project.cardArtUrl,

      proposedBunnyVideoId:
        mainVideo?.guid ??
        project.bunnyVideoId,

      proposedBunnyLibraryId:
        project.bunnyLibraryId,
    },
  });
}