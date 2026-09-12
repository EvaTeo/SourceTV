import { prisma } from "@/app/lib/prisma";

import type { SubmissionForm } from "./form";
import type { SubmissionUploads } from "./upload";

type UserLike = {
  name: string | null;
  email: string;
};

export async function createProjectSubmission(
  form: SubmissionForm,
  uploads: SubmissionUploads,
  user: UserLike
) {
  const settings =
    await prisma.platformSettings.findFirst({
      select: {
        defaultRevenueShare: true,
      },
    });

  const configuredRevenueShare =
    settings?.defaultRevenueShare ?? 50;

  const safeRevenueShare =
    Number.isFinite(configuredRevenueShare) &&
    configuredRevenueShare >= 0 &&
    configuredRevenueShare <= 100
      ? Math.round(configuredRevenueShare)
      : 50;

  const parsedYear = form.yearValue
    ? Number(form.yearValue)
    : null;

  return prisma.projectSubmission.create({
    data: {
      title: form.title,
      description: form.description,

      type: form.type,
      genre: form.genre,

      year:
        parsedYear !== null
          ? Math.round(parsedYear)
          : undefined,

      videoUrl: uploads.mainVideo.hlsUrl,
      mainVideoUrl: uploads.mainVideo.hlsUrl,

      trailerUrl:
        uploads.trailerVideo?.hlsUrl ??
        null,

      thumbnailUrl:
        uploads.thumbnailUrl,

      backdropUrl:
        uploads.backdropUrl,

      titleLogoUrl:
        uploads.titleLogoUrl,

      maturityRating:
        form.maturityRating,

      runtime:
        form.runtime || null,

      creatorName:
        form.creatorName ||
        user.name ||
        "SourceTV Partner",

      creatorEmail:
        user.email,

      creatorCompany:
        form.creatorCompany || null,

      revenueShare:
        safeRevenueShare,

      workflowStage:
        "submission",

      status:
        "pending",

      scheduledAt:
        null,
    },
  });
}