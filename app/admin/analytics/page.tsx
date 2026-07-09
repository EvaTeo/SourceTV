import SimpleList from "./components/SimpleList";
import ProgressList from "./components/ProgressList";
import RankList from "./components/RankList";
import DataTable, { Td } from "./components/DataTable";
import ProgressRow from "./components/ProgressRow";
import InfoRow from "./components/InfoRow";
import MiniStat from "./components/MiniStat";
import SectionCard from "./components/SectionCard";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const card = "rounded-2xl border border-white/10 bg-white/[0.035]";
const muted = "text-white/45";

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

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalTitles = titles.length;
  const totalViews = titles.reduce((sum, title) => sum + (title.views || 0), 0);

  const published = titles.filter((t) => t.workflowStage === "published");
  const scheduled = titles.filter((t) => t.workflowStage === "scheduled");
  const rejected = titles.filter((t) => t.workflowStage === "rejected");
  const archived = titles.filter((t) => t.workflowStage === "archived");

  const inReview = titles.filter((t) =>
    ["submission", "metadata_review", "content_review", "rights_review"].includes(
      t.workflowStage || ""
    )
  );

  const pendingPartners = partnerApplications.filter((app) => app.status === "pending");
  const approvedPartners = partnerApplications.filter((app) => app.status === "approved");
  const signedContracts = contracts.filter((contract) => contract.status === "signed");

  const completedAdViews = adImpressions.filter((ad) => ad.completed);
  const skippedAds = adImpressions.filter((ad) => ad.skipped);
  const clickedAds = adImpressions.filter((ad) => ad.clicked);

  const impressionsToday = adImpressions.filter(
    (impression) => impression.createdAt >= startOfToday
  );

  const impressionsThisMonth = adImpressions.filter(
    (impression) => impression.createdAt >= startOfMonth
  );

  const watchEventsToday = continueWatching.filter(
    (item) => item.watchedAt >= startOfToday
  );

  const newUsersThisMonth = users.filter((item) => item.createdAt >= startOfMonth);

  const totalAdSpend = adCampaigns.reduce(
    (sum, campaign) => sum + (campaign.spentCents || 0),
    0
  );

  const adRevenue = totalAdSpend / 100;

  const adRevenueFromImpressions = (items: typeof adImpressions) => {
    const cents = items.reduce((sum, impression) => {
      return sum + (impression.campaign?.cpmCents || 0) / 1000;
    }, 0);

    return cents / 100;
  };

  const revenueToday = adRevenueFromImpressions(impressionsToday);
  const revenueThisMonth = adRevenueFromImpressions(impressionsThisMonth);

  const adCtr = percent(clickedAds.length, adImpressions.length);
  const adCompletionRate = percent(completedAdViews.length, adImpressions.length);
  const adSkipRate = percent(skippedAds.length, adImpressions.length);

  const averageAdWatchSeconds = adImpressions.length
    ? Math.round(
        adImpressions.reduce((sum, ad) => sum + (ad.watchedSeconds || 0), 0) /
          adImpressions.length
      )
    : 0;

  const activeCampaigns = adCampaigns.filter((campaign) => campaign.status === "active");

  const totalWatchSeconds = continueWatching.reduce(
    (sum, item) => sum + Math.max(item.currentTime || 0, item.duration || 0),
    0
  );

  const totalWatchHours = Math.round(totalWatchSeconds / 3600);
  const completedTitles = continueWatching.filter((item) => item.completed);
  const completionRate = percent(completedTitles.length, continueWatching.length);

  const likedReactions = reactions.filter((reaction) => reaction.liked);
  const dislikedReactions = reactions.filter((reaction) => reaction.disliked);

  const mostViewed = [...titles].sort((a, b) => (b.views || 0) - (a.views || 0))[0];

  const topTitles = [...titles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 8);

  const recentTitles = titles.slice(0, 8);

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
    { label: "Draft", value: contracts.filter((c) => c.status === "draft").length },
    { label: "Sent", value: contracts.filter((c) => c.status === "sent").length },
    { label: "Viewed", value: contracts.filter((c) => c.status === "viewed").length },
    { label: "Changes Requested", value: contracts.filter((c) => c.status === "changes_requested").length },
    { label: "Signed", value: signedContracts.length },
    { label: "Cancelled", value: contracts.filter((c) => c.status === "cancelled").length },
    { label: "Expired", value: contracts.filter((c) => c.status === "expired").length },
  ];

  const campaignRows = adCampaigns
    .map((campaign) => {
      const impressions = campaign.impressions.length;
      const completed = campaign.impressions.filter((item) => item.completed).length;
      const clicked = campaign.impressions.filter((item) => item.clicked).length;

      return {
        id: campaign.id,
        name: campaign.name,
        advertiser: campaign.advertiser || campaign.adType || "Unknown",
        placement: campaign.placement,
        status: campaign.status,
        impressions,
        spend: campaign.spentCents || 0,
        ctr: percent(clicked, impressions),
        completionRate: percent(completed, impressions),
      };
    })
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 8);

  const placementRows = ["pre_roll", "mid_roll", "post_roll", "banner"].map(
    (placement) => ({
      label: placement.replaceAll("_", " "),
      value: adImpressions.filter((impression) => impression.placement === placement).length,
    })
  );

  const topGenres = topEntries(
    titles.reduce((map: Record<string, number>, title) => {
      const genre = title.genre || "Uncategorized";
      map[genre] = (map[genre] || 0) + 1;
      return map;
    }, {})
  );

  const topTypes = topEntries(
    titles.reduce((map: Record<string, number>, title) => {
      const type = title.type || "Unknown";
      map[type] = (map[type] || 0) + 1;
      return map;
    }, {})
  );

  const topPartners = topEntries(
    titles.reduce((map: Record<string, number>, title) => {
      const partner = title.creatorName || title.creatorEmail || "Unknown";
      map[partner] = (map[partner] || 0) + 1;
      return map;
    }, {})
  );

  const topWatchlistTitles = topEntries(
    watchlist.reduce((map: Record<string, number>, item) => {
      const title = item.project?.title || "Unknown Title";
      map[title] = (map[title] || 0) + 1;
      return map;
    }, {})
  );

  const topLikedTitles = topEntries(
    likedReactions.reduce((map: Record<string, number>, reaction) => {
      const title = reaction.project?.title || "Unknown Title";
      map[title] = (map[title] || 0) + 1;
      return map;
    }, {})
  );

  const estimatedPartnerShare = adRevenue * 0.45;
  const estimatedPlatformProfit = adRevenue - estimatedPartnerShare;

  const kpis = [
    { label: "Total Views", value: formatNumber(totalViews), href: "/admin/content" },
    { label: "Watch Hours", value: formatNumber(totalWatchHours), href: "/admin/analytics" },
    { label: "Ad Revenue", value: money(adRevenue), href: "/admin/revenue" },
    { label: "Ad Impressions", value: formatNumber(adImpressions.length), href: "/admin/ads" },
    { label: "Users", value: formatNumber(users.length), href: "/admin/users" },
    { label: "Profiles", value: formatNumber(profiles.length), href: "/admin/users" },
    { label: "Published", value: formatNumber(published.length), href: "/admin/content" },
    { label: "In Review", value: formatNumber(inReview.length), href: "/admin/review" },
  ];

  return (
    <div className="space-y-6">
     <AdminPageHeader
  eyebrow="SourceTV Analytics"
  title="Platform performance"
  description="Track audience behavior, catalog health, ad delivery, partner activity, and revenue signals across SourceTV."
/>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`${card} p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055]`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {item.value}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard
          title="Ad Performance"
          description="Campaign delivery, revenue, clicks, skips, and completion signals."
          actionHref="/admin/ads"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStat label="Today" value={money(revenueToday)} />
            <MiniStat label="This Month" value={money(revenueThisMonth)} />
            <MiniStat label="Active Campaigns" value={formatNumber(activeCampaigns.length)} />
            <MiniStat label="CTR" value={`${adCtr}%`} />
            <MiniStat label="Completion" value={`${adCompletionRate}%`} />
            <MiniStat label="Avg Watch" value={`${averageAdWatchSeconds}s`} />
          </div>

          <DataTable
            className="mt-5"
            columns={["Campaign", "Impressions", "CTR", "Spend"]}
            empty="No campaign data yet."
          >
            {campaignRows.map((campaign) => (
              <tr key={campaign.id} className="border-t border-white/10">
                <Td>
                  <p className="font-medium text-white">{campaign.name}</p>
                  <p className="mt-1 text-xs capitalize text-white/35">
                    {campaign.advertiser} · {campaign.placement.replaceAll("_", " ")} · {campaign.status}
                  </p>
                </Td>
                <Td>{formatNumber(campaign.impressions)}</Td>
                <Td>{campaign.ctr}%</Td>
                <Td>{money(campaign.spend / 100)}</Td>
              </tr>
            ))}
          </DataTable>
        </SectionCard>

        <SectionCard title="Business Snapshot" description="The fastest read on SourceTV health.">
          <div className="space-y-2">
            <InfoRow
              label="Most Viewed"
              value={mostViewed ? `${mostViewed.title} (${formatNumber(mostViewed.views || 0)})` : "No data"}
            />
            <InfoRow label="Published Share" value={`${percent(published.length, totalTitles)}%`} />
            <InfoRow label="Completion Rate" value={`${completionRate}%`} />
            <InfoRow label="Partner Share" value={money(estimatedPartnerShare)} />
            <InfoRow label="Platform Profit" value={money(estimatedPlatformProfit)} />
            <InfoRow label="New Users This Month" value={formatNumber(newUsersThisMonth.length)} />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Top Titles" description="Most watched titles across the catalog." actionHref="/admin/content">
          <RankList
            items={topTitles.map((title) => ({
              id: title.id,
              label: title.title,
              sublabel: `${title.type || "Title"}${title.genre ? ` · ${title.genre}` : ""}`,
              value: `${formatNumber(title.views || 0)} views`,
            }))}
          />
        </SectionCard>

        <SectionCard title="Viewer Signals" description="Watchlist, reactions, and completion activity.">
          <div className="space-y-2">
            <InfoRow label="Continue Watching" value={formatNumber(continueWatching.length)} />
            <InfoRow label="Completed Titles" value={formatNumber(completedTitles.length)} />
            <InfoRow label="Watchlist Adds" value={formatNumber(watchlist.length)} />
            <InfoRow label="Likes" value={formatNumber(likedReactions.length)} />
            <InfoRow label="Dislikes" value={formatNumber(dislikedReactions.length)} />
            <InfoRow label="Today Watch Events" value={formatNumber(watchEventsToday.length)} />
          </div>
        </SectionCard>

        <SectionCard title="Ad Placements" description="Impressions by ad placement.">
          <div className="space-y-3">
            {placementRows.map((row) => (
              <ProgressRow
                key={row.label}
                label={row.label}
                value={row.value}
                total={Math.max(adImpressions.length, 1)}
              />
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Workflow Health" description="Where titles currently sit in the publishing pipeline.">
          <div className="space-y-3">
            {workflowRows.map((row) => (
              <ProgressRow key={row.label} label={row.label} value={row.value} total={Math.max(totalTitles, 1)} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Contract Health" description="Current status of rights agreements.">
          <div className="space-y-3">
            {contractRows.map((row) => (
              <ProgressRow key={row.label} label={row.label} value={row.value} total={Math.max(contracts.length, 1)} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Partner Pipeline" description="Partner onboarding and application status." actionHref="/admin/partners">
          <div className="space-y-2">
            <InfoRow label="Total Applications" value={formatNumber(partnerApplications.length)} />
            <InfoRow label="Pending" value={formatNumber(pendingPartners.length)} />
            <InfoRow label="Approved" value={formatNumber(approvedPartners.length)} />
            <InfoRow
              label="Rejected"
              value={formatNumber(partnerApplications.filter((app) => app.status === "rejected").length)}
            />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Top Genres" description="Most represented catalog categories.">
          <ProgressList items={topGenres} total={Math.max(totalTitles, 1)} />
        </SectionCard>

        <SectionCard title="Content Types" description="Breakdown by films, shows, animation, and other formats.">
          <ProgressList items={topTypes} total={Math.max(totalTitles, 1)} />
        </SectionCard>

        <SectionCard title="Top Partners" description="Partners contributing the most titles.">
          <SimpleList items={topPartners.map(([label, value]) => [label, `${value} titles`])} />
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard title="Most Watchlisted" description="Titles viewers are saving for later.">
          <SimpleList items={topWatchlistTitles.map(([label, value]) => [label, `${value} saves`])} />
        </SectionCard>

        <SectionCard title="Most Liked" description="Titles receiving the strongest positive signals.">
          <SimpleList items={topLikedTitles.map(([label, value]) => [label, `${value} likes`])} />
        </SectionCard>

        <SectionCard title="Recent Titles" description="Latest titles added to SourceTV." actionHref="/admin/content">
          <div className="space-y-2">
            {recentTitles.length === 0 ? (
              <EmptyState text="No recent titles yet." />
            ) : (
              recentTitles.map((title) => (
                <Link
                  key={title.id}
                  href={`/admin/content/${title.id}/edit`}
                  className="block rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 transition hover:bg-white/[0.045]"
                >
                  <p className="truncate text-sm font-medium text-white">{title.title}</p>
                  <p className="mt-1 truncate text-xs text-white/35">
                    {title.workflowStage || title.status || "unknown"}
                    {title.creatorName ? ` · ${title.creatorName}` : ""}
                  </p>
                </Link>
              ))
            )}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-8 text-sm text-white/40">
      {text}
    </div>
  );
}

function topEntries(map: Record<string, number>) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}