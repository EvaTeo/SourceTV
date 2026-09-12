import {
  percent,
  topEntries,
  type AnalyticsDashboardData,
} from "./helpers";

import type { buildAudienceMetrics } from "./audienceMetrics";
import type { buildAdvertisingMetrics } from "./advertisingMetrics";
import type { buildRevenueMetrics } from "./revenueMetrics";

type AudienceMetrics =
  ReturnType<
    typeof buildAudienceMetrics
  >;

type AdvertisingMetrics =
  ReturnType<
    typeof buildAdvertisingMetrics
  >;

type RevenueMetrics =
  ReturnType<
    typeof buildRevenueMetrics
  >;

export function buildOverviewMetrics(
  data: AnalyticsDashboardData,
  audience: AudienceMetrics,
  advertising: AdvertisingMetrics,
  revenue: RevenueMetrics
) {
  const {
    titles,
    partnerApplications,
    contracts,
  } = data;

  const totalTitles =
    titles.length;

  const totalViews =
    titles.reduce(
      (sum, title) =>
        sum +
        (title.views || 0),
      0
    );

  const published =
    titles.filter(
      (title) =>
        title.workflowStage ===
        "published"
    );

  const scheduled =
    titles.filter(
      (title) =>
        title.workflowStage ===
        "scheduled"
    );

  const rejected =
    titles.filter(
      (title) =>
        title.workflowStage ===
        "rejected"
    );

  const archived =
    titles.filter(
      (title) =>
        title.workflowStage ===
        "archived"
    );

  const inReview =
    titles.filter((title) =>
      [
        "submission",
        "metadata_review",
        "content_review",
        "rights_review",
      ].includes(
        title.workflowStage ||
          ""
      )
    );

  const pendingPartners =
    partnerApplications.filter(
      (application) =>
        application.status ===
        "pending"
    );

  const approvedPartners =
    partnerApplications.filter(
      (application) =>
        application.status ===
        "approved"
    );

  const rejectedPartners =
    partnerApplications.filter(
      (application) =>
        application.status ===
        "rejected"
    );

  const mostViewed =
    [...titles].sort(
      (a, b) =>
        (b.views || 0) -
        (a.views || 0)
    )[0] || null;

  const topTitles =
    [...titles]
      .sort(
        (a, b) =>
          (b.views || 0) -
          (a.views || 0)
      )
      .slice(0, 8);

  const recentTitles =
    titles.slice(0, 8);

  const workflowRows = [
    {
      label:
        "Submissions",

      value:
        titles.filter(
          (title) =>
            title.workflowStage ===
            "submission"
        ).length,
    },
    {
      label:
        "Metadata Review",

      value:
        titles.filter(
          (title) =>
            title.workflowStage ===
            "metadata_review"
        ).length,
    },
    {
      label:
        "Content Review",

      value:
        titles.filter(
          (title) =>
            title.workflowStage ===
            "content_review"
        ).length,
    },
    {
      label:
        "Rights Review",

      value:
        titles.filter(
          (title) =>
            title.workflowStage ===
            "rights_review"
        ).length,
    },
    {
      label: "Scheduled",
      value:
        scheduled.length,
    },
    {
      label: "Published",
      value:
        published.length,
    },
    {
      label: "Archived",
      value:
        archived.length,
    },
    {
      label: "Rejected",
      value:
        rejected.length,
    },
  ];

  const contractRows = [
    "draft",
    "sent",
    "viewed",
    "changes_requested",
    "signed",
    "cancelled",
    "expired",
  ].map((status) => ({
    label:
      status ===
      "changes_requested"
        ? "Changes Requested"
        : status
            .replaceAll(
              "_",
              " "
            )
            .replace(
              /\b\w/g,
              (character) =>
                character.toUpperCase()
            ),

    value:
      contracts.filter(
        (contract) =>
          contract.status ===
          status
      ).length,
  }));

  const topPartners =
    topEntries(
      titles.reduce(
        (
          map: Record<
            string,
            number
          >,
          title
        ) => {
          const partner =
            title.creatorName ||
            title.creatorEmail ||
            "Unknown";

          map[partner] =
            (map[partner] ||
              0) + 1;

          return map;
        },
        {}
      )
    );

  return {
    props: {
      totalViews,

      totalWatchHours:
        audience.totalWatchHours,

      adRevenue:
        advertising.adRevenue,

      totalAdImpressions:
        data.adImpressions
          .length,

      totalUsers:
        data.users.length,

      totalProfiles:
        data.profiles.length,

      publishedCount:
        published.length,

      inReviewCount:
        inReview.length,

      revenueToday:
        advertising.revenueToday,

      revenueThisMonth:
        advertising.revenueThisMonth,

      activeCampaigns:
        advertising
          .activeCampaigns
          .length,

      adCtr:
        advertising.adCtr,

      adCompletionRate:
        advertising.adCompletionRate,

      averageAdWatchSeconds:
        advertising.averageAdWatchSeconds,

      campaignRows:
        advertising.campaignRows,

      mostViewed,

      publishedShare:
        percent(
          published.length,
          totalTitles
        ),

      completionRate:
        audience.completionRate,

      estimatedPartnerShare:
        revenue.estimatedPartnerShare,

      estimatedPlatformProfit:
        revenue.estimatedPlatformProfit,

      newUsersThisMonth:
        audience
          .newUsersThisMonth
          .length,

      topTitles,

      continueWatchingCount:
        data.continueWatching
          .length,

      completedTitlesCount:
        audience
          .completedTitles
          .length,

      watchlistCount:
        data.watchlist.length,

      likesCount:
        audience
          .likedReactions
          .length,

      dislikesCount:
        audience
          .dislikedReactions
          .length,

      watchEventsToday:
        audience
          .watchEventsToday
          .length,

      placementRows:
        advertising
          .placementRows,

      workflowRows,
      contractRows,

      totalTitles,

      totalContracts:
        contracts.length,

      totalPartnerApplications:
        partnerApplications
          .length,

      pendingPartners:
        pendingPartners.length,

      approvedPartners:
        approvedPartners.length,

      rejectedPartners:
        rejectedPartners.length,

      topGenres:
        audience.topGenres,

      topTypes:
        audience.topTypes,

      topPartners,

      topWatchlistTitles:
        audience
          .topWatchlistTitles,

      topLikedTitles:
        audience
          .topLikedTitles,

      recentTitles,
    },

    totalTitles,
    totalViews,
    published,
    scheduled,
    rejected,
    archived,
    inReview,
    pendingPartners,
    approvedPartners,
    rejectedPartners,
    mostViewed,
    topPartners,
  };
}