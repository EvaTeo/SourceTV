import AdminLayout from "@/app/components/admin/AdminLayout";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

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
    prisma.projectSubmission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.partnerApplication.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.rightsContract.findMany({
      orderBy: { updatedAt: "desc" },
      include: { project: true },
    }),
    prisma.adCampaign.findMany({
      orderBy: { updatedAt: "desc" },
      include: { impressions: true },
    }),
    prisma.adImpression.findMany({
      orderBy: { createdAt: "desc" },
      include: { campaign: true, project: true },
    }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.profile.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.continueWatching.findMany({
      orderBy: { watchedAt: "desc" },
      include: { project: true },
    }),
    prisma.watchlist.findMany({
      orderBy: { createdAt: "desc" },
      include: { project: true },
    }),
    prisma.contentReaction.findMany({
      orderBy: { updatedAt: "desc" },
      include: { project: true },
    }),
  ]);

  const dashboardNow = new Date();
  const startOfToday = new Date(
    dashboardNow.getFullYear(),
    dashboardNow.getMonth(),
    dashboardNow.getDate()
  );
  const startOfMonth = new Date(
    dashboardNow.getFullYear(),
    dashboardNow.getMonth(),
    1
  );

  const adRevenueFromImpressions = (items: typeof adImpressions) => {
    const cents = items.reduce((sum, impression) => {
      return sum + (impression.campaign?.cpmCents || 0) / 1000;
    }, 0);

    return cents / 100;
  };

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

  const totalTitles = titles.length;
  const totalViews = titles.reduce((sum, title) => sum + (title.views || 0), 0);

  const published = titles.filter((t) => t.workflowStage === "published");
  const scheduled = titles.filter((t) => t.workflowStage === "scheduled");
  const rejected = titles.filter((t) => t.workflowStage === "rejected");
  const archived = titles.filter((t) => t.workflowStage === "archived");
  const featured = titles.filter((t) => t.featured);

  const inReview = titles.filter((t) =>
    ["submission", "metadata_review", "content_review", "rights_review"].includes(
      t.workflowStage || ""
    )
  );

  const avgViews =
    totalTitles > 0 ? Math.round(totalViews / Math.max(totalTitles, 1)) : 0;

  const mostViewed = [...titles].sort(
    (a, b) => (b.views || 0) - (a.views || 0)
  )[0];

  const pendingPartners = partnerApplications.filter(
    (app) => app.status === "pending"
  );

  const approvedPartners = partnerApplications.filter(
    (app) => app.status === "approved"
  );

  const signedContracts = contracts.filter(
    (contract) => contract.status === "signed"
  );

  const contractsNeedingAction = contracts.filter((contract) =>
    ["draft", "changes_requested"].includes(contract.status)
  );

  const topTitles = [...titles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const recentTitles = titles.slice(0, 8);

  const genreCounts = titles.reduce((map: Record<string, number>, title) => {
    const genre = title.genre || "Uncategorized";
    map[genre] = (map[genre] || 0) + 1;
    return map;
  }, {});

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const typeCounts = titles.reduce((map: Record<string, number>, title) => {
    const type = title.type || "Unknown";
    map[type] = (map[type] || 0) + 1;
    return map;
  }, {});

  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const partnerCounts = titles.reduce((map: Record<string, number>, title) => {
    const partner = title.creatorName || title.creatorEmail || "Unknown";
    map[partner] = (map[partner] || 0) + 1;
    return map;
  }, {});

  const topPartners = Object.entries(partnerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const workflowRows = [
    { label: "Submissions", value: titles.filter((t) => t.workflowStage === "submission").length },
    { label: "Metadata Review", value: titles.filter((t) => t.workflowStage === "metadata_review").length },
    { label: "Content Review", value: titles.filter((t) => t.workflowStage === "content_review").length },
    { label: "Rights Review", value: titles.filter((t) => t.workflowStage === "rights_review").length },
    { label: "Scheduled", value: scheduled.length },
    { label: "Published", value: published.length },
    { label: "Archived", value: archived.length },
    { label: "Rejected", value: rejected.length },
  ];

  const contractRows = [
    { label: "Draft", value: contracts.filter((contract) => contract.status === "draft").length },
    { label: "Sent", value: contracts.filter((contract) => contract.status === "sent").length },
    { label: "Viewed", value: contracts.filter((contract) => contract.status === "viewed").length },
    { label: "Changes Requested", value: contracts.filter((contract) => contract.status === "changes_requested").length },
    { label: "Signed", value: signedContracts.length },
    { label: "Cancelled", value: contracts.filter((contract) => contract.status === "cancelled").length },
    { label: "Expired", value: contracts.filter((contract) => contract.status === "expired").length },
  ];

  const completedAdViews = adImpressions.filter((ad) => ad.completed);
  const skippedAds = adImpressions.filter((ad) => ad.skipped);
  const clickedAds = adImpressions.filter((ad) => ad.clicked);
  const totalAdSpend = adCampaigns.reduce(
    (sum, campaign) => sum + (campaign.spentCents || 0),
    0
  );

  const adRevenue = totalAdSpend / 100;
  const adCtr = percent(clickedAds.length, adImpressions.length);
  const adCompletionRate = percent(completedAdViews.length, adImpressions.length);
  const adSkipRate = percent(skippedAds.length, adImpressions.length);
  const averageAdWatchSeconds = adImpressions.length
    ? Math.round(
        adImpressions.reduce((sum, ad) => sum + (ad.watchedSeconds || 0), 0) /
          adImpressions.length
      )
    : 0;

  const activeCampaigns = adCampaigns.filter(
    (campaign) => campaign.status === "active"
  );

  const campaignRows = adCampaigns
    .map((campaign) => {
      const impressions = campaign.impressions.length;
      const completed = campaign.impressions.filter((item) => item.completed).length;
      const clicked = campaign.impressions.filter((item) => item.clicked).length;

      return {
        id: campaign.id,
        name: campaign.name,
        advertiser: campaign.advertiser || campaign.adType,
        placement: campaign.placement,
        status: campaign.status,
        impressions,
        spend: campaign.spentCents || 0,
        ctr: percent(clicked, impressions),
        completionRate: percent(completed, impressions),
      };
    })
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  const placementRows = ["pre_roll", "mid_roll", "post_roll", "banner"].map(
    (placement) => ({
      label: placement.replaceAll("_", " "),
      value: adImpressions.filter((impression) => impression.placement === placement)
        .length,
    })
  );

  const totalWatchSeconds = continueWatching.reduce(
    (sum, item) => sum + Math.max(item.currentTime || 0, item.duration || 0),
    0
  );

  const totalWatchHours = Math.round(totalWatchSeconds / 3600);
  const completedTitles = continueWatching.filter((item) => item.completed);
  const completionRate = percent(completedTitles.length, continueWatching.length);

  const topWatchlistTitles = Object.entries(
    watchlist.reduce((map: Record<string, number>, item) => {
      const title = item.project?.title || "Unknown Title";
      map[title] = (map[title] || 0) + 1;
      return map;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const likedReactions = reactions.filter((reaction) => reaction.liked);
  const dislikedReactions = reactions.filter((reaction) => reaction.disliked);

  const topLikedTitles = Object.entries(
    likedReactions.reduce((map: Record<string, number>, reaction) => {
      const title = reaction.project?.title || "Unknown Title";
      map[title] = (map[title] || 0) + 1;
      return map;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const revenueToday = adRevenueFromImpressions(impressionsToday);
  const revenueThisMonth = adRevenueFromImpressions(impressionsThisMonth);

  const topAdvertisers = Object.entries(
    adImpressions.reduce((map: Record<string, { impressions: number; revenue: number }>, impression) => {
      const advertiser =
        impression.campaign?.advertiser ||
        impression.campaign?.adType ||
        "Unknown Advertiser";

      if (!map[advertiser]) {
        map[advertiser] = { impressions: 0, revenue: 0 };
      }

      map[advertiser].impressions += 1;
      map[advertiser].revenue +=
        ((impression.campaign?.cpmCents || 0) / 1000) / 100;

      return map;
    }, {})
  )
    .map(([advertiser, stats]) => ({
      advertiser,
      impressions: stats.impressions,
      revenue: stats.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const revenueByTitle = Object.entries(
    adImpressions.reduce((map: Record<string, { impressions: number; revenue: number }>, impression) => {
      const title = impression.project?.title || "No Title Attached";

      if (!map[title]) {
        map[title] = { impressions: 0, revenue: 0 };
      }

      map[title].impressions += 1;
      map[title].revenue +=
        ((impression.campaign?.cpmCents || 0) / 1000) / 100;

      return map;
    }, {})
  )
    .map(([title, stats]) => ({
      title,
      impressions: stats.impressions,
      revenue: stats.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const estimatedPartnerShare = adRevenue * 0.45;
  const estimatedPlatformProfit = adRevenue - estimatedPartnerShare;

  return (
  <AdminLayout>
    <div className="px-8 py-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Analytics
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
                Platform Command Center
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
                Track catalog performance, viewer engagement, ad revenue,
                campaign delivery, partner activity, rights health, and
                recommendation signals from one admin dashboard.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/admin/content" className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200">
                  Content Center
                </Link>
                <Link href="/admin/ads" className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200">
                  Ads Manager
                </Link>
                <Link href="/admin/contracts" className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200">
                  Rights Contracts
                </Link>
                <Link href="/admin/revenue" className="rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-sky-300">
                  Revenue
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-200">
                Tracked Ad Revenue
              </p>
              <p className="mt-3 text-3xl font-black">
                ${adRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Based on campaign spend tracked through SourceTV ad impressions.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Titles" value={totalTitles} />
          <StatCard label="Published" value={published.length} />
          <StatCard label="Total Views" value={totalViews} />
          <StatCard label="Watch Hours" value={totalWatchHours} />
          <StatCard label="Users" value={users.length} />
          <StatCard label="Profiles" value={profiles.length} />
          <StatCard label="Watchlist Adds" value={watchlist.length} />
          <StatCard label="Likes" value={likedReactions.length} />
          <StatCard label="Ad Impressions" value={adImpressions.length} />
          <StatCard label="Today Ad Impressions" value={impressionsToday.length} />
          <StatCard label="Monthly Ad Impressions" value={impressionsThisMonth.length} />
          <StatCard label="Ad Clicks" value={clickedAds.length} />
          <StatCard label="Active Campaigns" value={activeCampaigns.length} />
          <StatCard label="Today Watch Events" value={watchEventsToday.length} />
          <StatCard label="New Users This Month" value={newUsersThisMonth.length} />
          <StatCard label="Signed Contracts" value={signedContracts.length} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Ad Performance" eyebrow="Revenue" description="Real campaign delivery based on tracked ad impressions.">
            <div className="grid gap-3 sm:grid-cols-2">
              <MiniMetric label="Revenue Today" value={`$${revenueToday.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <MiniMetric label="Revenue This Month" value={`$${revenueThisMonth.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <MiniMetric label="CTR" value={`${adCtr}%`} />
              <MiniMetric label="Completion Rate" value={`${adCompletionRate}%`} />
              <MiniMetric label="Skip Rate" value={`${adSkipRate}%`} />
              <MiniMetric label="Avg Watch" value={`${averageAdWatchSeconds}s`} />
            </div>

            <div className="mt-5 space-y-3">
              {campaignRows.length === 0 ? (
                <Empty />
              ) : (
                campaignRows.map((campaign) => (
                  <div key={campaign.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-black text-white/85">{campaign.name}</p>
                        <p className="mt-1 text-xs font-bold capitalize text-white/40">
                          {campaign.advertiser} • {campaign.placement.replaceAll("_", " ")} • {campaign.status}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-black text-sky-300">
                        {campaign.impressions.toLocaleString()} impressions
                      </p>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <SmallRow label="CTR" value={`${campaign.ctr}%`} />
                      <SmallRow label="Complete" value={`${campaign.completionRate}%`} />
                      <SmallRow label="Spend" value={`$${(campaign.spend / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Business Snapshot" eyebrow="Summary" description="Quick read on catalog, advertising, and rights health.">
            <div className="space-y-3">
              <Row label="Most Viewed" value={mostViewed ? `${mostViewed.title} (${(mostViewed.views || 0).toLocaleString()})` : "No data"} />
              <Row label="Published Share" value={`${percent(published.length, totalTitles)}%`} />
              <Row label="Completion Rate" value={`${completionRate}%`} />
              <Row label="Signed Contract Share" value={`${percent(signedContracts.length, contracts.length)}%`} />
              <Row label="Partner Share Estimate" value={`$${estimatedPartnerShare.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
              <Row label="Platform Profit Estimate" value={`$${estimatedPlatformProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
            </div>
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Panel title="Top Titles" eyebrow="Audience" description="Most watched titles across SourceTV.">
            {topTitles.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topTitles.map((title, index) => (
                  <RankRow
                    key={title.id}
                    rank={index + 1}
                    label={title.title}
                    sublabel={`${title.type || "Title"}${title.genre ? ` • ${title.genre}` : ""}`}
                    value={`${(title.views || 0).toLocaleString()} views`}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Viewer Taste Signals" eyebrow="Recommendations" description="Signals feeding personalized recommendations.">
            <div className="space-y-3">
              <Row label="Continue Watching Records" value={continueWatching.length} />
              <Row label="Completed Titles" value={completedTitles.length} />
              <Row label="Watchlist Adds" value={watchlist.length} />
              <Row label="Likes" value={likedReactions.length} />
              <Row label="Dislikes" value={dislikedReactions.length} />
              <Row label="Completion Rate" value={`${completionRate}%`} />
            </div>
          </Panel>

          <Panel title="Ad Placements" eyebrow="Inventory" description="Impressions by placement type.">
            <div className="space-y-3">
              {placementRows.map((row) => (
                <ProgressRow key={row.label} label={row.label} value={row.value} total={Math.max(adImpressions.length, 1)} />
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Panel title="Workflow Health" eyebrow="Operations" description="Where content currently sits in the pipeline.">
            <div className="space-y-3">
              {workflowRows.map((row) => (
                <ProgressRow key={row.label} label={row.label} value={row.value} total={Math.max(totalTitles, 1)} />
              ))}
            </div>
          </Panel>

          <Panel title="Rights Contract Health" eyebrow="Legal" description="Current legal agreement status across the catalog.">
            <div className="space-y-3">
              {contractRows.map((row) => (
                <ProgressRow key={row.label} label={row.label} value={row.value} total={Math.max(contracts.length, 1)} />
              ))}
            </div>
          </Panel>

          <Panel title="Top Genres" eyebrow="Catalog" description="Most represented categories in the catalog.">
            {topGenres.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topGenres.map(([genre, count]) => (
                  <ProgressRow key={genre} label={genre} value={count} total={Math.max(totalTitles, 1)} />
                ))}
              </div>
            )}
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel
            title="Top Advertisers"
            eyebrow="Advertising"
            description="Advertisers ranked by estimated revenue from tracked impressions."
          >
            {topAdvertisers.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topAdvertisers.map((advertiser) => (
                  <Row
                    key={advertiser.advertiser}
                    label={`${advertiser.advertiser} • ${advertiser.impressions.toLocaleString()} impressions`}
                    value={`$${advertiser.revenue.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Revenue by Title"
            eyebrow="Content Revenue"
            description="Titles ranked by estimated ad revenue attached to their impressions."
          >
            {revenueByTitle.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {revenueByTitle.map((title) => (
                  <Row
                    key={title.title}
                    label={`${title.title} • ${title.impressions.toLocaleString()} impressions`}
                    value={`$${title.revenue.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`}
                  />
                ))}
              </div>
            )}
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Panel title="Most Watchlisted" eyebrow="Viewer Intent" description="Titles viewers are saving for later.">
            {topWatchlistTitles.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topWatchlistTitles.map(([title, count]) => (
                  <Row key={title} label={title} value={`${count} saves`} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Most Liked" eyebrow="Viewer Taste" description="Titles receiving the strongest positive signals.">
            {topLikedTitles.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topLikedTitles.map(([title, count]) => (
                  <Row key={title} label={title} value={`${count} likes`} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Top Partners" eyebrow="Partners" description="Partners contributing the most titles.">
            {topPartners.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topPartners.map(([partner, count]) => (
                  <Row key={partner} label={partner} value={`${count} titles`} />
                ))}
              </div>
            )}
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Panel title="Content Types" eyebrow="Catalog" description="Breakdown by films, shows, animation, and other types.">
            {topTypes.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topTypes.map(([type, count]) => (
                  <ProgressRow key={type} label={type} value={count} total={Math.max(totalTitles, 1)} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Contracts Needing Attention" eyebrow="Rights" description="Drafts and change requests that need admin action.">
            {contractsNeedingAction.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {contractsNeedingAction.slice(0, 8).map((contract) => (
                  <Row key={contract.id} label={contract.project?.title || "Untitled Contract"} value={contract.status.replaceAll("_", " ")} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Partner Applications" eyebrow="Pipeline" description="Current partner onboarding activity.">
            <div className="space-y-3">
              <Row label="Total Applications" value={partnerApplications.length} />
              <Row label="Pending" value={pendingPartners.length} />
              <Row label="Approved" value={approvedPartners.length} />
              <Row label="Rejected" value={partnerApplications.filter((app) => app.status === "rejected").length} />
            </div>
          </Panel>
        </section>

        <section className="mt-8">
          <Panel title="Recent Titles" eyebrow="Catalog Activity" description="Latest titles added to SourceTV.">
            {recentTitles.length === 0 ? (
              <Empty />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {recentTitles.map((title) => (
                  <div key={title.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-black text-white/85">{title.title}</p>
                        <p className="mt-1 text-xs font-bold text-white/40">
                          {title.type || "Title"}
                          {title.genre ? ` • ${title.genre}` : ""}
                          {title.creatorName ? ` • ${title.creatorName}` : ""}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                        {title.workflowStage || title.status || "unknown"}
                      </span>
                    </div>

                    <p className="mt-3 text-xs font-bold text-sky-300">
                      {(title.views || 0).toLocaleString()} views
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>
      </div>
     </div>
  </AdminLayout>
);
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_25px_rgba(14,165,233,0.08)] md:p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {label}
      </p>
      <h2 className="mt-3 text-4xl font-black text-sky-300">
        {value.toLocaleString()}
      </h2>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-sky-300">{value}</p>
    </div>
  );
}

function SmallRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>
      <p className="mt-1 text-xs font-black text-sky-300">{value}</p>
    </div>
  );
}

function Panel({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="min-w-0 truncate font-bold text-white/70">{label}</p>
      <p className="shrink-0 text-right font-black text-sky-300">{value}</p>
    </div>
  );
}

function RankRow({
  rank,
  label,
  sublabel,
  value,
}: {
  rank: number;
  label: string;
  sublabel: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-400 text-sm font-black text-black">
        {rank}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-black text-white/80">{label}</p>
        <p className="mt-1 truncate text-xs font-bold text-white/38">
          {sublabel}
        </p>
      </div>

      <p className="shrink-0 text-sm font-black text-sky-300">{value}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const width = Math.max(4, Math.round((value / total) * 100));

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold capitalize text-white/70">{label}</p>
        <p className="font-black text-sky-300">{value.toLocaleString()}</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-white/45">
      No data yet.
    </div>
  );
}
