import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import AdvertisingAnalytics from "./components/AdvertisingAnalytics";
import AIInsights from "./components/AIInsights";
import AnalyticsOverview from "./components/AnalyticsOverview";
import AnalyticsTabs from "./components/AnalyticsTabs";
import AudienceAnalytics from "./components/AudienceAnalytics";
import EditorialAnalytics from "./components/EditorialAnalytics";
import LiveActivity from "./components/LiveActivity";
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

  const revenueToday =
    adRevenueFromImpressions(impressionsToday);

  const revenueThisMonth =
    adRevenueFromImpressions(impressionsThisMonth);

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
      sum +
      Math.max(
        item.currentTime || 0,
        item.duration || 0
      ),
    0
  );

  const totalWatchHours = Math.round(
    totalWatchSeconds / 3600
  );

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
        (title) =>
          title.workflowStage === "submission"
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
    label: placement.replaceAll("_", " "),
    value: adImpressions.filter(
      (impression) =>
        impression.placement === placement
    ).length,
  }));

  const topGenres = topEntries(
    titles.reduce(
      (
        map: Record<string, number>,
        title
      ) => {
        const genre =
          title.genre || "Uncategorized";

        map[genre] = (map[genre] || 0) + 1;

        return map;
      },
      {}
    )
  );

  const topTypes = topEntries(
    titles.reduce(
      (
        map: Record<string, number>,
        title
      ) => {
        const type = title.type || "Unknown";

        map[type] = (map[type] || 0) + 1;

        return map;
      },
      {}
    )
  );

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

  const estimatedPartnerShare = adRevenue * 0.45;

  const estimatedPlatformProfit =
    adRevenue - estimatedPartnerShare;

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
            totalAdImpressions={
              adImpressions.length
            }
            totalUsers={users.length}
            totalProfiles={profiles.length}
            publishedCount={published.length}
            inReviewCount={inReview.length}
            revenueToday={revenueToday}
            revenueThisMonth={revenueThisMonth}
            activeCampaigns={
              activeCampaigns.length
            }
            adCtr={adCtr}
            adCompletionRate={
              adCompletionRate
            }
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
            dislikesCount={
              dislikedReactions.length
            }
            watchEventsToday={
              watchEventsToday.length
            }
            placementRows={placementRows}
            workflowRows={workflowRows}
            contractRows={contractRows}
            totalTitles={totalTitles}
            totalContracts={contracts.length}
            totalPartnerApplications={
              partnerApplications.length
            }
            pendingPartners={
              pendingPartners.length
            }
            approvedPartners={
              approvedPartners.length
            }
            rejectedPartners={
              rejectedPartners.length
            }
            topGenres={topGenres}
            topTypes={topTypes}
            topPartners={topPartners}
            topWatchlistTitles={
              topWatchlistTitles
            }
            topLikedTitles={topLikedTitles}
            recentTitles={recentTitles}
          />
        }
        editorial={<EditorialAnalytics />}
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
            watchEventsToday={
              watchEventsToday.length
            }
            completionRate={completionRate}
            totalWatchHours={totalWatchHours}
            topGenres={topGenres}
            topTypes={topTypes}
            topWatchlistTitles={
              topWatchlistTitles
            }
            topLikedTitles={topLikedTitles}
          />
        }
        advertising={
          <AdvertisingAnalytics
            totalRevenue={adRevenue}
            revenueToday={revenueToday}
            revenueThisMonth={revenueThisMonth}
            totalImpressions={
              adImpressions.length
            }
            impressionsToday={
              impressionsToday.length
            }
            impressionsThisMonth={
              impressionsThisMonth.length
            }
            activeCampaigns={
              activeCampaigns.length
            }
            completedViews={
              completedAdViews.length
            }
            skippedAds={skippedAds.length}
            clickedAds={clickedAds.length}
            ctr={adCtr}
            completionRate={
              adCompletionRate
            }
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
            activeCampaigns={
              activeCampaigns.length
            }
            totalImpressions={
              adImpressions.length
            }
            signedContracts={
              signedContracts.length
            }
            totalContracts={contracts.length}
            publishedTitles={published.length}
            totalTitles={totalTitles}
            placementRows={placementRows}
            partnerRows={topPartners}
          />
        }
        activity={<LiveActivity items={[]} />}
        ai={<AIInsights insights={[]} />}
      />
    </main>
  );
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

  return Math.round(
    (value / total) * 100
  );
}