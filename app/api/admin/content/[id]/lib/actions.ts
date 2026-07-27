import type {
  Prisma,
  ProjectSubmission,
} from "@/app/generated/prisma";
import { workflowOrder } from "./constants";
import { ContentRouteError } from "./errors";
import { getPublishingProblems } from "./publishing";

type RequestBody = Record<string, unknown>;

type ContentUpdate =
  Prisma.ProjectSubmissionUpdateInput;

function clearPromotionData(): ContentUpdate {
  return {
    featured: false,
    featuredRank: null,
    heroBadge: null,
    heroPriority: null,
    heroStartDate: null,
    heroEndDate: null,
  };
}

function assertPublishingReady(
  existing: ProjectSubmission
) {
  const problems =
    getPublishingProblems(existing);

  if (problems.length > 0) {
    throw new ContentRouteError({
      error: "Title is not ready to publish",
      message:
        "Complete the missing publishing requirements before publishing.",
      details: {
        problems,
      },
    });
  }
}

function buildMoveForwardUpdate(
  existing: ProjectSubmission
): ContentUpdate {
  const currentStage =
    existing.workflowStage || "submission";

  const currentIndex = workflowOrder.indexOf(
    currentStage as (typeof workflowOrder)[number]
  );

  if (currentIndex === -1) {
    throw new ContentRouteError({
      error: "Invalid workflow transition",
      message: `The current stage "${currentStage}" cannot move forward automatically.`,
    });
  }

  if (
    currentIndex >=
    workflowOrder.length - 1
  ) {
    throw new ContentRouteError({
      error: "Already published",
      message:
        "This title is already at the final publishing stage.",
    });
  }

  const nextStage =
    workflowOrder[currentIndex + 1];

  if (nextStage === "scheduled") {
    if (!existing.scheduledAt) {
      throw new ContentRouteError({
        error: "Release date required",
        message:
          "Set a scheduled release date before moving this title into Scheduled.",
      });
    }

    if (
      existing.scheduledAt.getTime() <=
      Date.now()
    ) {
      throw new ContentRouteError({
        error: "Future release date required",
        message:
          "The scheduled release date must be in the future.",
      });
    }

    return {
      workflowStage: "scheduled",
      status: "approved",
    };
  }

  if (nextStage === "published") {
    assertPublishingReady(existing);

    if (
      existing.scheduledAt &&
      existing.scheduledAt.getTime() >
        Date.now()
    ) {
      throw new ContentRouteError({
        error: "Release date has not arrived",
        message:
          "This title is scheduled for a future release.",
      });
    }

    return {
      workflowStage: "published",
      status: "approved",
      publishedAt:
        existing.publishedAt || new Date(),
      rejectedAt: null,
      archivedAt: null,
    };
  }

  if (nextStage === "approved") {
    return {
      workflowStage: "approved",
      status: "approved",
      rejectedAt: null,
      archivedAt: null,
    };
  }

  return {
    workflowStage: nextStage,
  };
}

function buildRejectUpdate(
  existing: ProjectSubmission,
  body: RequestBody
): ContentUpdate {
  const reviewNotes = String(
    body.reviewNotes ||
      existing.reviewNotes ||
      ""
  ).trim();

  if (!reviewNotes) {
    throw new ContentRouteError({
      error: "Rejection reason required",
      message:
        "Enter a reason before rejecting this title.",
    });
  }

  return {
    workflowStage: "rejected",
    status: "rejected",
    rejectedAt: new Date(),
    reviewNotes,
    scheduledAt: null,
    ...clearPromotionData(),
  };
}

function buildArchiveUpdate(): ContentUpdate {
  return {
    workflowStage: "archived",
    status: "archived",
    archivedAt: new Date(),
    scheduledAt: null,
    ...clearPromotionData(),
  };
}

function buildPublishUpdate(
  existing: ProjectSubmission
): ContentUpdate {
  assertPublishingReady(existing);

  return {
    workflowStage: "published",
    status: "approved",
    publishedAt:
      existing.publishedAt || new Date(),
    rejectedAt: null,
    archivedAt: null,
  };
}

function buildFeatureUpdate(
  existing: ProjectSubmission,
  body: RequestBody
): ContentUpdate {
  const requestedRank =
    body.featuredRank === undefined
      ? null
      : Number(body.featuredRank);

  const featuredRank =
    requestedRank !== null &&
    Number.isInteger(requestedRank) &&
    requestedRank > 0
      ? requestedRank
      : existing.featuredRank || 1;

  return {
    featured: true,
    featuredRank,
  };
}

export function buildActionUpdate(
  existing: ProjectSubmission,
  body: RequestBody
): ContentUpdate {
  switch (body.action) {
    case "move_forward":
      return buildMoveForwardUpdate(existing);

    case "reject":
      return buildRejectUpdate(
        existing,
        body
      );

    case "archive":
      return buildArchiveUpdate();

    case "publish":
      return buildPublishUpdate(existing);

    case "feature":
      return buildFeatureUpdate(
        existing,
        body
      );

    case "unfeature":
      return {
        featured: false,
        featuredRank: null,
      };

    default:
      return {};
  }
}