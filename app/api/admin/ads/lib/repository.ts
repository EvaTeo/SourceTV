import { prisma } from "@/app/lib/prisma";

import type { AdsQuery } from "./types";

export async function getAdsPage(
  query: AdsQuery
) {
  const where = {
    ...(query.status
      ? {
          status: query.status,
        }
      : {}),
    ...(query.type
      ? {
          type: query.type,
        }
      : {}),
    ...(query.search
      ? {
          OR: [
            {
              name: {
                contains: query.search,
                mode: "insensitive",
              },
            },
            {
              advertiser: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [items, total] =
    await prisma.$transaction([
      prisma.adCampaign.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip:
          (query.page - 1) *
          query.limit,
        take: query.limit,
      }),
      prisma.adCampaign.count({
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

export async function updateAdStatus(
  input: {
    id: string;
    status: string;
  }
) {
  return prisma.adCampaign.update({
    where: {
      id: input.id,
    },
    data: {
      status: input.status,
    },
  });
}