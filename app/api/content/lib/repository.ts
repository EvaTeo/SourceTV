import { prisma } from "@/app/lib/prisma";

export function getPublishedContent(now: Date) {
  return prisma.projectSubmission.findMany({
    where: {
      status: "approved",
      AND: [
        {
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
        {
          OR: [
            {
              licenseStartDate: null,
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
              licenseEndDate: null,
            },
            {
              licenseEndDate: {
                gte: now,
              },
            },
          ],
        },
      ],
    },
    orderBy: [
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
    ],
  });
}