import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import AdvertisingAnalytics from "./components/AdvertisingAnalytics";
import AIInsights, {
  type AIInsight,
} from "./components/AIInsights";
import AnalyticsOverview from "./components/AnalyticsOverview";
import AnalyticsTabs from "./components/AnalyticsTabs";
import AudienceAnalytics from "./components/AudienceAnalytics";
import EditorialAnalytics from "./components/EditorialAnalytics";
import LiveActivity, {
  type LiveActivityItem,
} from "./components/LiveActivity";
import RevenueAnalytics from "./components/RevenueAnalytics";

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

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

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const totalTitles = titles.length;

  const totalViews = titles.reduce(
    (sum, title) => sum + (title.views || 0),
    0
  );

  const published = titles.filter(
    (title) => title.workflowStage === "published"
  );

  const scheduled = titles.filter(
    (title) => title.workflowStage === "scheduled"
  );

  const rejected = titles.filter(
    (title) => title.workflowStage === "rejected"
  );

  const archived = titles.filter(
    (title) => title.workflowStage === "archived"
  );

  const inReview = titles.filter((title) =>
    [
      "submission",
      "metadata_review",
      "content_review",
      "rights_review",
    ].includes(title.workflowStage || "")
  );

  const pendingPartners = partnerApplications.filter(
    (application) => application.status === "pending"
  );

  const approvedPartners = partnerApplications.filter(
    (application) => application.status === "approved"
  );

  const rejectedPartners = partnerApplications.filter(
    (application) => application.status === "rejected"
  );

  const signedContracts = contracts.filter(
    (contract) => contract.status === "signed"
  );

  const completedAdViews = adImpressions.filter(
    (impression) => impression.completed
  );

  const skippedAds = adImpressions.filter(
    (impression) => impression.skipped
  );

  const clickedAds = adImpressions.filter(
    (impression) => impression.clicked
  );

  const impressionsToday = adImpressions.filter(
    (impression) => impression.createdAt >= startOfToday
  );

  const impressionsThisMonth = adImpressions.filter(
    (impression) => impression.createdAt >= startOfMonth
  );

  const watchEventsToday = continueWatching.filter(
    (item) => item.watchedAt >= startOfToday
  );

  const newUsersThisMonth = users.filter(
    (item) => item.createdAt >= startOfMonth
  );

  const totalAdSpendCents = adCampaigns.reduce(
    (sum, campaign) => sum + (campaign.spentCents || 0),
    0
  );

  const totalAdSpend = totalAdSpendCents / 100;
  const adRevenue = totalAdSpend;

  function adRevenueFromImpressions(
    items: typeof adImpressions
  ) {
    const cents = items.reduce((sum, impression) => {
      return (
        sum +
        (impression.campaign?.cpmCents || 0) / 1000
      );
    }, 0);

    return cents / 100;
  }

  const revenueToday = adRevenueFromImpressions(
    impressionsToday
  );

  const revenueThisMonth = adRevenueFromImpressions(
    impressionsThisMonth
  );

  const adCtr = percent(
    clickedAds.length,
    adImpressions.length
  );

  const adCompletionRate = percent(
    completedAdViews.length,
    adImpressions.length
  );

  const adSkipRate = percent(
    skippedAds.length,
    adImpressions.length
  );

  const averageAdWatchSeconds =
    adImpressions.length > 0
      ? Math.round(
          adImpressions.reduce(
            (sum, impression) =>
              sum + (impression.watchedSeconds || 0),
            0
          ) / adImpressions.length
        )
      : 0;

  const activeCampaigns = adCampaigns.filter(
    (campaign) => campaign.status === "active"
  );

  const totalWatchSeconds = continueWatching.reduce(
    (sum, item) =>
      sum + Math.max(item.currentTime || 0, 0),
    0
  );

  const totalWatchHours =
    totalWatchSeconds > 0
      ? Math.round((totalWatchSeconds / 3600) * 10) / 10
      : 0;

  const completedTitles = continueWatching.filter(
    (item) => item.completed
  );

  const completionRate = percent(
    completedTitles.length,
    continueWatching.length
  );

  const likedReactions = reactions.filter(
    (reaction) => reaction.liked
  );

  const dislikedReactions = reactions.filter(
    (reaction) => reaction.disliked
  );

  const mostViewed =
    [...titles].sort(
      (a, b) => (b.views || 0) - (a.views || 0)
    )[0] || null;

  const topTitles = [...titles]
    .sort(
      (a, b) => (b.views || 0) - (a.views || 0)
    )
    .slice(0, 8);

  const recentTitles = titles.slice(0, 8);

  const workflowRows = [
    {
      label: "Submissions",
      value: titles.filter(
        (title) => title.workflowStage === "submission"
      ).length,
    },
    {
      label: "Metadata Review",
      value: titles.filter(
        (title) =>
          title.workflowStage === "metadata_review"
      ).length,
    },
    {
      label: "Content Review",
      value: titles.filter(
        (title) =>
          title.workflowStage === "content_review"
      ).length,
    },
    {
      label: "Rights Review",
      value: titles.filter(
        (title) =>
          title.workflowStage === "rights_review"
      ).length,
    },
    {
      label: "Scheduled",
      value: scheduled.length,
    },
    {
      label: "Published",
      value: published.length,
    },
    {
      label: "Archived",
      value: archived.length,
    },
    {
      label: "Rejected",
      value: rejected.length,
    },
  ];

  const contractRows = [
    {
      label: "Draft",
      value: contracts.filter(
        (contract) => contract.status === "draft"
      ).length,
    },
    {
      label: "Sent",
      value: contracts.filter(
        (contract) => contract.status === "sent"
      ).length,
    },
    {
      label: "Viewed",
      value: contracts.filter(
        (contract) => contract.status === "viewed"
      ).length,
    },
    {
      label: "Changes Requested",
      value: contracts.filter(
        (contract) =>
          contract.status === "changes_requested"
      ).length,
    },
    {
      label: "Signed",
      value: signedContracts.length,
    },
    {
      label: "Cancelled",
      value: contracts.filter(
        (contract) => contract.status === "cancelled"
      ).length,
    },
    {
      label: "Expired",
      value: contracts.filter(
        (contract) => contract.status === "expired"
      ).length,
    },
  ];

  const campaignRows = adCampaigns
    .map((campaign) => {
      const impressions = campaign.impressions.length;

      const completed = campaign.impressions.filter(
        (impression) => impression.completed
      ).length;

      const clicked = campaign.impressions.filter(
        (impression) => impression.clicked
      ).length;

      return {
        id: campaign.id,
        name: campaign.name,
        advertiser:
          campaign.advertiser ||
          campaign.adType ||
          "Unknown",
        placement: campaign.placement,
        status: campaign.status,
        impressions,
        spend: campaign.spentCents || 0,
        ctr: percent(clicked, impressions),
        completionRate: percent(
          completed,
          impressions
        ),
      };
    })
    .sort(
      (a, b) => b.impressions - a.impressions
    )
    .slice(0, 8);

  const placementRows = [
    "pre_roll",
    "mid_roll",
    "post_roll",
    "banner",
  ].map((placement) => ({
    label: placement,
    value: adImpressions.filter(
      (impression) =>
        impression.placement === placement
    ).length,
  }));

  const genreSignals: Record<string, number> = {};
  const typeSignals: Record<string, number> = {};

  for (const item of continueWatching) {
    addSignal(
      genreSignals,
      item.project?.genre || "Uncategorized",
      item.completed ? 4 : 3
    );

    addSignal(
      typeSignals,
      item.project?.type || "Unknown",
      item.completed ? 4 : 3
    );
  }

  for (const item of watchlist) {
    addSignal(
      genreSignals,
      item.project?.genre || "Uncategorized",
      1
    );

    addSignal(
      typeSignals,
      item.project?.type || "Unknown",
      1
    );
  }

  for (const reaction of likedReactions) {
    addSignal(
      genreSignals,
      reaction.project?.genre || "Uncategorized",
      2
    );

    addSignal(
      typeSignals,
      reaction.project?.type || "Unknown",
      2
    );
  }

  const topGenres = topEntries(genreSignals);
  const topTypes = topEntries(typeSignals);

  const topPartners = topEntries(
    titles.reduce(
      (
        map: Record<string, number>,
        title
      ) => {
        const partner =
          title.creatorName ||
          title.creatorEmail ||
          "Unknown";

        map[partner] = (map[partner] || 0) + 1;

        return map;
      },
      {}
    )
  );

  const topWatchlistTitles = topEntries(
    watchlist.reduce(
      (
        map: Record<string, number>,
        item
      ) => {
        const title =
          item.project?.title || "Unknown Title";

        map[title] = (map[title] || 0) + 1;

        return map;
      },
      {}
    )
  );

  const topLikedTitles = topEntries(
    likedReactions.reduce(
      (
        map: Record<string, number>,
        reaction
      ) => {
        const title =
          reaction.project?.title ||
          "Unknown Title";

        map[title] = (map[title] || 0) + 1;

        return map;
      },
      {}
    )
  );

  const activeEditorialCollections =
    editorialCollections.filter((collection) => {
      return (
        collection.status === "active" &&
        isDateRangeActive(
          collection.startsAt,
          collection.endsAt,
          now
        )
      );
    });

  const scheduledEditorialCollections =
    editorialCollections.filter((collection) => {
      const beginsInFuture =
        collection.startsAt !== null &&
        collection.startsAt > now;

      return (
        collection.status === "scheduled" ||
        beginsInFuture
      );
    });

  const totalCollectionItems =
    editorialCollections.reduce(
      (sum, collection) =>
        sum + collection.items.length,
      0
    );

  const editorialCollectionRows =
    editorialCollections.map((collection) => ({
      id: collection.id,
      title: collection.title,
      placement: collection.placement,
      status: getCollectionDisplayStatus(
        collection.status,
        collection.startsAt,
        collection.endsAt,
        now
      ),
      itemCount: collection.items.length,
      startsAt:
        collection.startsAt?.toISOString() || null,
      endsAt: collection.endsAt?.toISOString() || null,
    }));

  const activeHeroTitles = heroTitles.filter((title) => {
    return (
      title.featured &&
      title.workflowStage === "published" &&
      isDateRangeActive(
        title.heroStartDate,
        title.heroEndDate,
        now
      )
    );
  });

  const editorialHeroRows = heroTitles
    .filter((title) => {
      const hasHeroConfiguration =
        title.featured ||
        title.heroPriority !== null ||
        title.featuredRank !== null;

      const hasNotEnded =
        title.heroEndDate === null ||
        title.heroEndDate >= now;

      return hasHeroConfiguration && hasNotEnded;
    })
    .sort((a, b) => {
      const aRank =
        a.featuredRank ?? Number.MAX_SAFE_INTEGER;

      const bRank =
        b.featuredRank ?? Number.MAX_SAFE_INTEGER;

      if (aRank !== bRank) {
        return aRank - bRank;
      }

      return (
        (b.heroPriority || 0) -
        (a.heroPriority || 0)
      );
    })
    .slice(0, 8)
    .map((title) => ({
      id: title.id,
      title: title.title,
      badge: title.heroBadge,
      priority: title.heroPriority || 0,
      featuredRank: title.featuredRank,
      views: title.views || 0,
      genre: title.genre,
      startsAt:
        title.heroStartDate?.toISOString() || null,
      endsAt:
        title.heroEndDate?.toISOString() || null,
    }));

  const estimatedPartnerShare = adRevenue * 0.45;

  const estimatedPlatformProfit =
    adRevenue - estimatedPartnerShare;

  const liveActivityItems: LiveActivityItem[] = [
    ...continueWatching.slice(0, 12).map((item) => {
      const title =
        item.project?.title || "Unknown title";

      const completed = Boolean(item.completed);

      return {
        id: `playback-${item.id}`,
        type: completed
          ? ("completion" as const)
          : ("watch" as const),
        title: completed
          ? "Title completed"
          : "Playback activity",
        description: completed
          ? `A viewer completed ${title}.`
          : `A viewer continued watching ${title}.`,
        timestamp: item.watchedAt.toISOString(),
        href: item.project
          ? `/watch/${item.project.id}`
          : undefined,
      };
    }),

    ...users.slice(0, 8).map((account) => ({
      id: `user-${account.id}`,
      type: "user" as const,
      title: "New SourceTV account",
      description: account.email
        ? `${account.email} joined SourceTV.`
        : "A new viewer joined SourceTV.",
      timestamp: account.createdAt.toISOString(),
      href: "/admin/users",
    })),

    ...partnerApplications.slice(0, 8).map(
      (application) => ({
        id: `partner-${application.id}`,
        type: "partner" as const,
        title: "Partner application",
        description: `A partner application is currently ${formatLabel(
          application.status
        ).toLowerCase()}.`,
        timestamp: application.createdAt.toISOString(),
        href: "/admin/partners",
      })
    ),

    ...contracts.slice(0, 8).map((contract) => ({
      id: `contract-${contract.id}`,
      type: "contract" as const,
      title: "Rights contract updated",
      description: contract.project?.title
        ? `${contract.project.title} contract is ${formatLabel(
            contract.status
          ).toLowerCase()}.`
        : `A rights contract is ${formatLabel(
            contract.status
          ).toLowerCase()}.`,
      timestamp: contract.updatedAt.toISOString(),
      href: "/admin/contracts",
    })),

    ...adCampaigns.slice(0, 8).map((campaign) => ({
      id: `campaign-${campaign.id}`,
      type: "ad" as const,
      title: "Advertising campaign updated",
      description: `${campaign.name} is ${formatLabel(
        campaign.status
      ).toLowerCase()} with ${formatNumber(
        campaign.impressions.length
      )} recorded impression${
        campaign.impressions.length === 1 ? "" : "s"
      }.`,
      timestamp: campaign.updatedAt.toISOString(),
      href: "/admin/ads",
    })),

    ...adImpressions.slice(0, 8).map((impression) => ({
      id: `impression-${impression.id}`,
      type: "ad" as const,
      title: impression.clicked
        ? "Advertisement clicked"
        : impression.completed
          ? "Advertisement completed"
          : impression.skipped
            ? "Advertisement skipped"
            : "Advertisement viewed",
      description: impression.campaign?.name
        ? `${impression.campaign.name} recorded a ${formatLabel(
            impression.placement
          ).toLowerCase()} event.`
        : `A ${formatLabel(
            impression.placement
          ).toLowerCase()} advertising event was recorded.`,
      timestamp: impression.createdAt.toISOString(),
      href: "/admin/ads",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    )
    .slice(0, 30);

  const aiInsights: AIInsight[] = [];

  if (
    continueWatching.length >= 3 &&
    completionRate < 50
  ) {
    aiInsights.push({
      id: "audience-completion-rate",
      category: "audience",
      priority:
        completionRate < 25 ? "high" : "medium",
      title: "Viewer completion is below target",
      description: `${completionRate}% of recorded viewing activity reaches completion. Review the strongest exit points, title runtimes, and homepage positioning to improve session completion.`,
      actionLabel: "Review Audience",
      actionHref: "/admin/analytics",
    });
  }

  if (
    continueWatching.length >= 3 &&
    completionRate >= 70
  ) {
    aiInsights.push({
      id: "audience-completion-strength",
      category: "audience",
      priority: "low",
      title: "Viewer completion is performing well",
      description: `${completionRate}% of recorded viewing activity reaches completion. The strongest completed titles may be useful models for future acquisitions and editorial placement.`,
      actionLabel: "Review Audience",
      actionHref: "/admin/analytics",
    });
  }

  if (pendingPartners.length > 0) {
    aiInsights.push({
      id: "editorial-partner-review",
      category: "editorial",
      priority:
        pendingPartners.length >= 5
          ? "high"
          : "medium",
      title: "Partner applications are waiting",
      description: `${pendingPartners.length} partner application${
        pendingPartners.length === 1
          ? " is"
          : "s are"
      } still pending review. Clearing the queue can prevent delays in content acquisition and partner onboarding.`,
      actionLabel: "Review Partners",
      actionHref: "/admin/partners",
    });
  }

  if (inReview.length > 0) {
    aiInsights.push({
      id: "editorial-content-review",
      category: "editorial",
      priority:
        inReview.length >= 8 ? "high" : "medium",
      title: "Titles are waiting in review",
      description: `${inReview.length} title${
        inReview.length === 1 ? " is" : "s are"
      } currently moving through metadata, content, or rights review. Prioritize the oldest submissions to keep the publishing pipeline moving.`,
      actionLabel: "Open Content Review",
      actionHref: "/admin/review",
    });
  }

  if (scheduled.length > 0) {
    aiInsights.push({
      id: "editorial-scheduled-titles",
      category: "editorial",
      priority: "low",
      title: "Scheduled titles need programming support",
      description: `${scheduled.length} title${
        scheduled.length === 1 ? " is" : "s are"
      } scheduled for release. Confirm hero placement, curated collections, and supporting homepage rows before publication.`,
      actionLabel: "Open Editorial",
      actionHref: "/admin/editorial",
    });
  }

  if (
    published.length > 0 &&
    activeEditorialCollections.length === 0
  ) {
    aiInsights.push({
      id: "editorial-no-active-collections",
      category: "editorial",
      priority: "high",
      title: "No editorial collections are active",
      description: `${published.length} published title${
        published.length === 1 ? " is" : "s are"
      } available, but no editorial collection is currently active. Build homepage rows so viewers can discover the catalog.`,
      actionLabel: "Open Editorial",
      actionHref: "/admin/editorial",
    });
  }

  if (
    published.length > 0 &&
    activeHeroTitles.length === 0
  ) {
    aiInsights.push({
      id: "editorial-no-active-heroes",
      category: "editorial",
      priority: "medium",
      title: "No published hero title is active",
      description:
        "The homepage hero rotation does not currently contain an active published title. Feature at least one title and confirm its hero schedule.",
      actionLabel: "Manage Heroes",
      actionHref: "/admin/editorial",
    });
  }

  if (
    activeEditorialCollections.length > 0 &&
    activeEditorialCollections.some(
      (collection) => collection.items.length === 0
    )
  ) {
    const emptyActiveCollections =
      activeEditorialCollections.filter(
        (collection) => collection.items.length === 0
      ).length;

    aiInsights.push({
      id: "editorial-empty-collections",
      category: "editorial",
      priority: "medium",
      title: "Active collections are empty",
      description: `${emptyActiveCollections} active collection${
        emptyActiveCollections === 1 ? " has" : "s have"
      } no assigned titles. Add content or move the collection back to draft before it appears on the homepage.`,
      actionLabel: "Review Collections",
      actionHref: "/admin/editorial",
    });
  }

  if (
    totalTitles > 0 &&
    published.length / totalTitles < 0.6
  ) {
    const unpublishedCount =
      totalTitles - published.length;

    aiInsights.push({
      id: "catalog-published-share",
      category: "catalog",
      priority:
        published.length / totalTitles < 0.35
          ? "high"
          : "medium",
      title: "A large share of the catalog is not live",
      description: `${published.length} of ${totalTitles} titles are currently published, leaving ${unpublishedCount} outside the live catalog. Review stalled, scheduled, archived, and rejected titles for possible next actions.`,
      actionLabel: "Review Catalog",
      actionHref: "/admin/content",
    });
  }

  if (totalTitles === 0) {
    aiInsights.push({
      id: "catalog-empty",
      category: "catalog",
      priority: "high",
      title: "The catalog is empty",
      description:
        "SourceTV does not currently have any submitted titles. Add or approve content before preparing the public catalog for launch.",
      actionLabel: "Add Content",
      actionHref: "/admin/upload",
    });
  }

  if (
    totalTitles > 0 &&
    totalViews === 0
  ) {
    aiInsights.push({
      id: "catalog-no-views",
      category: "catalog",
      priority: "medium",
      title: "The catalog has no recorded views",
      description:
        "Titles exist in SourceTV, but no title views have been recorded. Verify that view tracking is connected to playback and title-page activity.",
      actionLabel: "Review Content",
      actionHref: "/admin/content",
    });
  }

  if (
    mostViewed &&
    totalViews > 0 &&
    (mostViewed.views || 0) / totalViews >= 0.5
  ) {
    aiInsights.push({
      id: "catalog-view-concentration",
      category: "catalog",
      priority: "medium",
      title: "Views are concentrated in one title",
      description: `${mostViewed.title} accounts for ${percent(
        mostViewed.views || 0,
        totalViews
      )}% of recorded title views. Consider promoting additional titles to create a healthier distribution of audience attention.`,
      actionLabel: "Open Editorial",
      actionHref: "/admin/editorial",
    });
  }

  if (adCampaigns.length === 0) {
    aiInsights.push({
      id: "advertising-no-campaigns",
      category: "advertising",
      priority: "high",
      title: "No advertising campaigns exist",
      description:
        "SourceTV has no advertising campaigns configured. Create at least one campaign before testing ad-supported playback and revenue reporting.",
      actionLabel: "Create Campaign",
      actionHref: "/admin/ads",
    });
  } else if (activeCampaigns.length === 0) {
    aiInsights.push({
      id: "advertising-no-active-campaigns",
      category: "advertising",
      priority: "high",
      title: "No advertising campaigns are active",
      description: `${adCampaigns.length} campaign${
        adCampaigns.length === 1
          ? " exists"
          : "s exist"
      }, but none are currently active. Review campaign status, scheduling, budget, and creative delivery.`,
      actionLabel: "Open Advertising",
      actionHref: "/admin/ads",
    });
  }

  if (
    adImpressions.length >= 10 &&
    adCompletionRate < 50
  ) {
    aiInsights.push({
      id: "advertising-completion-rate",
      category: "advertising",
      priority:
        adCompletionRate < 25 ? "high" : "medium",
      title: "Ad completion is below target",
      description: `${adCompletionRate}% of recorded ad impressions are completed, while ${adSkipRate}% are skipped. Review creative length, skip timing, playback reliability, and placement strategy.`,
      actionLabel: "Review Advertising",
      actionHref: "/admin/ads",
    });
  }

  if (
    adImpressions.length >= 10 &&
    adCtr < 1
  ) {
    aiInsights.push({
      id: "advertising-low-ctr",
      category: "advertising",
      priority: "medium",
      title: "Advertising click-through is low",
      description: `The current click-through rate is ${adCtr}%. Review calls to action, creative relevance, click destinations, and campaign targeting.`,
      actionLabel: "Review Campaigns",
      actionHref: "/admin/ads",
    });
  }

  if (
    activeCampaigns.length > 0 &&
    adImpressions.length === 0
  ) {
    aiInsights.push({
      id: "advertising-no-delivery",
      category: "advertising",
      priority: "high",
      title: "Active campaigns are not delivering",
      description: `${activeCampaigns.length} active campaign${
        activeCampaigns.length === 1
          ? " has"
          : "s have"
      } no recorded impressions. Verify ad eligibility, placement toggles, campaign dates, and impression tracking.`,
      actionLabel: "Check Ad Delivery",
      actionHref: "/admin/ads",
    });
  }

  if (
    published.length > 0 &&
    adRevenue === 0
  ) {
    aiInsights.push({
      id: "revenue-no-ad-revenue",
      category: "revenue",
      priority:
        activeCampaigns.length > 0
          ? "high"
          : "medium",
      title:
        "The live catalog is not generating ad revenue",
      description: `${published.length} published title${
        published.length === 1 ? " is" : "s are"
      } available, but no advertising revenue has been recorded. Confirm campaign delivery and revenue tracking before launch.`,
      actionLabel: "Open Revenue",
      actionHref: "/admin/revenue",
    });
  }

  if (
    adRevenue > 0 &&
    estimatedPlatformProfit <= 0
  ) {
    aiInsights.push({
      id: "revenue-platform-margin",
      category: "revenue",
      priority: "high",
      title:
        "Estimated platform margin is not positive",
      description:
        "Estimated partner obligations consume all recorded advertising revenue. Review revenue-share assumptions, campaign pricing, and platform costs.",
      actionLabel: "Review Revenue",
      actionHref: "/admin/revenue",
    });
  }

  if (
    contracts.length > 0 &&
    signedContracts.length === 0
  ) {
    aiInsights.push({
      id: "revenue-no-signed-contracts",
      category: "revenue",
      priority: "medium",
      title: "No rights contracts are signed",
      description: `${contracts.length} contract${
        contracts.length === 1
          ? " exists"
          : "s exist"
      }, but none are signed. Rights and payout reporting may remain incomplete until contracts are finalized.`,
      actionLabel: "Review Contracts",
      actionHref: "/admin/contracts",
    });
  }

  if (aiInsights.length === 0) {
    aiInsights.push({
      id: "platform-no-critical-issues",
      category: "editorial",
      priority: "low",
      title: "No major analytics risks detected",
      description:
        "Current catalog, audience, advertising, and revenue signals do not trigger a priority recommendation. Continue monitoring activity as more platform data is collected.",
      actionLabel: "Open Overview",
      actionHref: "/admin/analytics",
    });
  }

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Analytics"
        title="Platform performance"
        description="Track audience behavior, catalog health, ad delivery, partner activity, and revenue signals across SourceTV."
      />

      <AnalyticsTabs
        overview={
          <AnalyticsOverview
            totalViews={totalViews}
            totalWatchHours={totalWatchHours}
            adRevenue={adRevenue}
            totalAdImpressions={adImpressions.length}
            totalUsers={users.length}
            totalProfiles={profiles.length}
            publishedCount={published.length}
            inReviewCount={inReview.length}
            revenueToday={revenueToday}
            revenueThisMonth={revenueThisMonth}
            activeCampaigns={activeCampaigns.length}
            adCtr={adCtr}
            adCompletionRate={adCompletionRate}
            averageAdWatchSeconds={
              averageAdWatchSeconds
            }
            campaignRows={campaignRows}
            mostViewed={mostViewed}
            publishedShare={percent(
              published.length,
              totalTitles
            )}
            completionRate={completionRate}
            estimatedPartnerShare={
              estimatedPartnerShare
            }
            estimatedPlatformProfit={
              estimatedPlatformProfit
            }
            newUsersThisMonth={
              newUsersThisMonth.length
            }
            topTitles={topTitles}
            continueWatchingCount={
              continueWatching.length
            }
            completedTitlesCount={
              completedTitles.length
            }
            watchlistCount={watchlist.length}
            likesCount={likedReactions.length}
            dislikesCount={dislikedReactions.length}
            watchEventsToday={watchEventsToday.length}
            placementRows={placementRows}
            workflowRows={workflowRows}
            contractRows={contractRows}
            totalTitles={totalTitles}
            totalContracts={contracts.length}
            totalPartnerApplications={
              partnerApplications.length
            }
            pendingPartners={pendingPartners.length}
            approvedPartners={approvedPartners.length}
            rejectedPartners={rejectedPartners.length}
            topGenres={topGenres}
            topTypes={topTypes}
            topPartners={topPartners}
            topWatchlistTitles={topWatchlistTitles}
            topLikedTitles={topLikedTitles}
            recentTitles={recentTitles}
          />
        }
        editorial={
          <EditorialAnalytics
            activeCollections={
              activeEditorialCollections.length
            }
            scheduledCollections={
              scheduledEditorialCollections.length
            }
            totalCollectionItems={
              totalCollectionItems
            }
            activeHeroes={activeHeroTitles.length}
            collections={editorialCollectionRows}
            heroes={editorialHeroRows}
          />
        }
        audience={
          <AudienceAnalytics
            totalUsers={users.length}
            totalProfiles={profiles.length}
            newUsersThisMonth={
              newUsersThisMonth.length
            }
            continueWatchingCount={
              continueWatching.length
            }
            completedTitlesCount={
              completedTitles.length
            }
            watchlistCount={watchlist.length}
            likesCount={likedReactions.length}
            watchEventsToday={watchEventsToday.length}
            completionRate={completionRate}
            totalWatchHours={totalWatchHours}
            topGenres={topGenres}
            topTypes={topTypes}
            topWatchlistTitles={topWatchlistTitles}
            topLikedTitles={topLikedTitles}
          />
        }
        advertising={
          <AdvertisingAnalytics
            totalRevenue={adRevenue}
            revenueToday={revenueToday}
            revenueThisMonth={revenueThisMonth}
            totalImpressions={adImpressions.length}
            impressionsToday={impressionsToday.length}
            impressionsThisMonth={
              impressionsThisMonth.length
            }
            activeCampaigns={activeCampaigns.length}
            completedViews={completedAdViews.length}
            skippedAds={skippedAds.length}
            clickedAds={clickedAds.length}
            ctr={adCtr}
            completionRate={adCompletionRate}
            skipRate={adSkipRate}
            averageWatchSeconds={
              averageAdWatchSeconds
            }
            campaignRows={campaignRows}
            placementRows={placementRows}
          />
        }
        revenue={
          <RevenueAnalytics
            adRevenue={adRevenue}
            revenueToday={revenueToday}
            revenueThisMonth={revenueThisMonth}
            estimatedPartnerShare={
              estimatedPartnerShare
            }
            estimatedPlatformProfit={
              estimatedPlatformProfit
            }
            totalAdSpend={totalAdSpend}
            activeCampaigns={activeCampaigns.length}
            totalImpressions={adImpressions.length}
            signedContracts={signedContracts.length}
            totalContracts={contracts.length}
            publishedTitles={published.length}
            totalTitles={totalTitles}
            placementRows={placementRows}
            partnerRows={topPartners}
          />
        }
        activity={
          <LiveActivity items={liveActivityItems} />
        }
        ai={<AIInsights insights={aiInsights} />}
      />
    </main>
  );
}

function isDateRangeActive(
  startsAt: Date | null,
  endsAt: Date | null,
  now: Date
) {
  const hasStarted =
    startsAt === null || startsAt <= now;

  const hasNotEnded =
    endsAt === null || endsAt >= now;

  return hasStarted && hasNotEnded;
}

function getCollectionDisplayStatus(
  status: string,
  startsAt: Date | null,
  endsAt: Date | null,
  now: Date
) {
  if (endsAt && endsAt < now) {
    return "expired";
  }

  if (startsAt && startsAt > now) {
    return "scheduled";
  }

  return status;
}

function addSignal(
  map: Record<string, number>,
  label: string,
  amount: number
) {
  const normalizedLabel = label.trim() || "Unknown";

  map[normalizedLabel] =
    (map[normalizedLabel] || 0) + amount;
}

function topEntries(
  map: Record<string, number>
) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

function percent(
  value: number,
  total: number
) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatLabel(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}