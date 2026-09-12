import { prisma } from "@/app/lib/prisma";

export async function getAnalyticsDashboard() {
  const [
    titles,
    partnerApplications,
    contracts,
    adCampaigns,
    adImpressions,
    users,
    profiles,
    continueWatching,
    watchlist,
    reactions,
    editorialCollections,
    heroTitles,
  ] = await Promise.all([
    prisma.projectSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.partnerApplication.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.rightsContract.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        project: true,
      },
    }),

    prisma.adCampaign.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        impressions: true,
      },
    }),

    prisma.adImpression.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        campaign: true,
        project: true,
      },
    }),

    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.profile.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    }),

    prisma.continueWatching.findMany({
      orderBy: {
        watchedAt: "desc",
      },
      include: {
        project: true,
      },
    }),

    prisma.watchlist.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        project: true,
      },
    }),

    prisma.contentReaction.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        project: true,
      },
    }),

    prisma.editorialCollection.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
      include: {
        items: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            project: true,
          },
        },
      },
    }),

    prisma.projectSubmission.findMany({
      where: {
        OR: [
          {
            featured: true,
          },
          {
            heroPriority: {
              not: null,
            },
          },
          {
            featuredRank: {
              not: null,
            },
          },
        ],
      },
      orderBy: [
        {
          featuredRank: "asc",
        },
        {
          heroPriority: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    }),
  ]);

  return {
    titles,
    partnerApplications,
    contracts,
    adCampaigns,
    adImpressions,
    users,
    profiles,
    continueWatching,
    watchlist,
    reactions,
    editorialCollections,
    heroTitles,
  };
}