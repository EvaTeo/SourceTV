import { prisma } from "@/app/lib/prisma";

import type { RevisionQuery } from "./types";

export async function getRevisionPage(
  query: RevisionQuery
) {
  const where = {
    ...(query.status
      ? {
          status: query.status,
        }
      : {}),
    ...(query.projectId
      ? {
          projectId: query.projectId,
        }
      : {}),
  };

  const [items, total] =
    await prisma.$transaction([
      prisma.projectRevision.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip:
          (query.page - 1) * query.limit,
        take: query.limit,
        include: {
          project: {
            select: {
              id: true,
              title: true,
              creatorName: true,
              creatorCompany: true,
              status: true,
            },
          },
        },
      }),
      prisma.projectRevision.count({
        where,
      }),
    ]);

  return {
    items,
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(
        total / query.limit
      ),
    },
  };
}