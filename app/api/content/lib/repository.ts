import {
  Prisma,
} from "@/app/generated/prisma";
import { prisma } from "@/app/lib/prisma";

export const browseContentSelect = {
  id: true,
  title: true,
  description: true,
  type: true,
  genre: true,
  videoUrl: true,
  mainVideoUrl: true,
  trailerUrl: true,
  thumbnailUrl: true,
  backdropUrl: true,
  titleLogoUrl: true,
  status: true,
  views: true,
  year: true,
  maturityRating: true,
  runtime: true,
  creatorName: true,
  scheduledAt: true,
  createdAt: true,
  publishedAt: true,
  editorPick: true,
  featured: true,
  featuredRank: true,
  heroPriority: true,
  heroStartDate: true,
  heroEndDate: true,
} satisfies Prisma.ProjectSubmissionSelect;

function createPublishedWhere(
  now: Date
): Prisma.ProjectSubmissionWhereInput {
  return {
    status: "approved",

    AND: [
      {
        OR: [
          {
            workflowStage:
              "published",
          },
          {
            workflowStage:
              "scheduled",

            scheduledAt: {
              lte: now,
            },
          },
        ],
      },

      {
        OR: [
          {
            licenseStartDate:
              null,
          },
          {
            licenseStartDate: {
              lte: now,
            },
          },
        ],
      },

      {
        OR: [
          {
            licenseEndDate:
              null,
          },
          {
            licenseEndDate: {
              gte: now,
            },
          },
        ],
      },
    ],
  };
}

const publishedOrderBy: Prisma.ProjectSubmissionOrderByWithRelationInput[] =
  [
    {
      featured: "desc",
    },
    {
      heroPriority: "asc",
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
  ];

export function getPublishedContent(
  now: Date
) {
  return prisma.projectSubmission.findMany(
    {
      where:
        createPublishedWhere(
          now
        ),

      orderBy:
        publishedOrderBy,
    }
  );
}

export function getPublishedBrowseContent(
  now: Date
) {
  return prisma.projectSubmission.findMany(
    {
      where:
        createPublishedWhere(
          now
        ),

      orderBy:
        publishedOrderBy,

      select:
        browseContentSelect,
    }
  );
}