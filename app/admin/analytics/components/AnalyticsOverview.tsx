import Link from "next/link";
import DataTable, { Td } from "./DataTable";
import InfoRow from "./InfoRow";
import MiniStat from "./MiniStat";
import ProgressList from "./ProgressList";
import ProgressRow from "./ProgressRow";
import RankList from "./RankList";
import SectionCard from "./SectionCard";
import SimpleList from "./SimpleList";

type CampaignRow = {
  id: string;
  name: string;
  advertiser: string;
  placement: string;
  status: string;
  impressions: number;
  spend: number;
  ctr: number;
  completionRate: number;
};

type RankedTitle = {
  id: string;
  title: string;
  type?: string | null;
  genre?: string | null;
  views?: number | null;
};

type RecentTitle = RankedTitle & {
  workflowStage?: string | null;
  status?: string | null;
  creatorName?: string | null;
};

type AnalyticsOverviewProps = {
  totalViews: number;
  totalWatchHours: number;
  adRevenue: number;
  totalAdImpressions: number;
  totalUsers: number;
  totalProfiles: number;
  publishedCount: number;
  inReviewCount: number;

  revenueToday: number;
  revenueThisMonth: number;
  activeCampaigns: number;
  adCtr: number;
  adCompletionRate: number;
  averageAdWatchSeconds: number;

  campaignRows: CampaignRow[];

  mostViewed: RankedTitle | null;
  publishedShare: number;
  completionRate: number;
  estimatedPartnerShare: number;
  estimatedPlatformProfit: number;
  newUsersThisMonth: number;

  topTitles: RankedTitle[];

  continueWatchingCount: number;
  completedTitlesCount: number;
  watchlistCount: number;
  likesCount: number;
  dislikesCount: number;
  watchEventsToday: number;

  placementRows: Array<{
    label: string;
    value: number;
  }>;

  workflowRows: Array<{
    label: string;
    value: number;
  }>;

  contractRows: Array<{
    label: string;
    value: number;
  }>;

  totalTitles: number;
  totalContracts: number;

  totalPartnerApplications: number;
  pendingPartners: number;
  approvedPartners: number;
  rejectedPartners: number;

  topGenres: Array<[string, number]>;
  topTypes: Array<[string, number]>;
  topPartners: Array<[string, number]>;
  topWatchlistTitles: Array<[string, number]>;
  topLikedTitles: Array<[string, number]>;
  recentTitles: RecentTitle[];
};

const card =
  "rounded-2xl border border-white/10 bg-white/[0.035]";

export default function AnalyticsOverview({
  totalViews,
  totalWatchHours,
  adRevenue,
  totalAdImpressions,
  totalUsers,
  totalProfiles,
  publishedCount,
  inReviewCount,
  revenueToday,
  revenueThisMonth,
  activeCampaigns,
  adCtr,
  adCompletionRate,
  averageAdWatchSeconds,
  campaignRows,
  mostViewed,
  publishedShare,
  completionRate,
  estimatedPartnerShare,
  estimatedPlatformProfit,
  newUsersThisMonth,
  topTitles,
  continueWatchingCount,
  completedTitlesCount,
  watchlistCount,
  likesCount,
  dislikesCount,
  watchEventsToday,
  placementRows,
  workflowRows,
  contractRows,
  totalTitles,
  totalContracts,
  totalPartnerApplications,
  pendingPartners,
  approvedPartners,
  rejectedPartners,
  topGenres,
  topTypes,
  topPartners,
  topWatchlistTitles,
  topLikedTitles,
  recentTitles,
}: AnalyticsOverviewProps) {
  const kpis = [
    {
      label: "Total Views",
      value: formatNumber(totalViews),
      href: "/admin/content",
    },
    {
      label: "Watch Hours",
      value: formatNumber(totalWatchHours),
      href: "/admin/analytics",
    },
    {
      label: "Ad Revenue",
      value: money(adRevenue),
      href: "/admin/revenue",
    },
    {
      label: "Ad Impressions",
      value: formatNumber(totalAdImpressions),
      href: "/admin/ads",
    },
    {
      label: "Users",
      value: formatNumber(totalUsers),
      href: "/admin/users",
    },
    {
      label: "Profiles",
      value: formatNumber(totalProfiles),
      href: "/admin/users",
    },
    {
      label: "Published",
      value: formatNumber(publishedCount),
      href: "/admin/content",
    },
    {
      label: "In Review",
      value: formatNumber(inReviewCount),
      href: "/admin/review",
    },
  ];

  return (
    <div className="space-y-6">
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
            <MiniStat
              label="Today"
              value={money(revenueToday)}
            />

            <MiniStat
              label="This Month"
              value={money(revenueThisMonth)}
            />

            <MiniStat
              label="Active Campaigns"
              value={formatNumber(activeCampaigns)}
            />

            <MiniStat
              label="CTR"
              value={`${adCtr}%`}
            />

            <MiniStat
              label="Completion"
              value={`${adCompletionRate}%`}
            />

            <MiniStat
              label="Avg Watch"
              value={`${averageAdWatchSeconds}s`}
            />
          </div>

          <DataTable
            className="mt-5"
            columns={[
              "Campaign",
              "Impressions",
              "CTR",
              "Spend",
            ]}
            empty="No campaign data yet."
          >
            {campaignRows.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-t border-white/10"
              >
                <Td>
                  <p className="font-medium text-white">
                    {campaign.name}
                  </p>

                  <p className="mt-1 text-xs capitalize text-white/35">
                    {campaign.advertiser} ·{" "}
                    {campaign.placement.replaceAll("_", " ")} ·{" "}
                    {campaign.status}
                  </p>
                </Td>

                <Td>
                  {formatNumber(campaign.impressions)}
                </Td>

                <Td>{campaign.ctr}%</Td>

                <Td>
                  {money(campaign.spend / 100)}
                </Td>
              </tr>
            ))}
          </DataTable>
        </SectionCard>

        <SectionCard
          title="Business Snapshot"
          description="The fastest read on SourceTV health."
        >
          <div className="space-y-2">
            <InfoRow
              label="Most Viewed"
              value={
                mostViewed
                  ? `${mostViewed.title} (${formatNumber(
                      mostViewed.views || 0
                    )})`
                  : "No data"
              }
            />

            <InfoRow
              label="Published Share"
              value={`${publishedShare}%`}
            />

            <InfoRow
              label="Completion Rate"
              value={`${completionRate}%`}
            />

            <InfoRow
              label="Partner Share"
              value={money(estimatedPartnerShare)}
            />

            <InfoRow
              label="Platform Profit"
              value={money(estimatedPlatformProfit)}
            />

            <InfoRow
              label="New Users This Month"
              value={formatNumber(newUsersThisMonth)}
            />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Top Titles"
          description="Most watched titles across the catalog."
          actionHref="/admin/content"
        >
          <RankList
            items={topTitles.map((title) => ({
              id: title.id,
              label: title.title,
              sublabel: `${title.type || "Title"}${
                title.genre ? ` · ${title.genre}` : ""
              }`,
              value: `${formatNumber(
                title.views || 0
              )} views`,
            }))}
          />
        </SectionCard>

        <SectionCard
          title="Viewer Signals"
          description="Watchlist, reactions, and completion activity."
        >
          <div className="space-y-2">
            <InfoRow
              label="Continue Watching"
              value={formatNumber(continueWatchingCount)}
            />

            <InfoRow
              label="Completed Titles"
              value={formatNumber(completedTitlesCount)}
            />

            <InfoRow
              label="Watchlist Adds"
              value={formatNumber(watchlistCount)}
            />

            <InfoRow
              label="Likes"
              value={formatNumber(likesCount)}
            />

            <InfoRow
              label="Dislikes"
              value={formatNumber(dislikesCount)}
            />

            <InfoRow
              label="Today Watch Events"
              value={formatNumber(watchEventsToday)}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Ad Placements"
          description="Impressions by ad placement."
        >
          <div className="space-y-3">
            {placementRows.map((row) => (
              <ProgressRow
                key={row.label}
                label={row.label}
                value={row.value}
                total={Math.max(totalAdImpressions, 1)}
              />
            ))}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Workflow Health"
          description="Where titles currently sit in the publishing pipeline."
        >
          <div className="space-y-3">
            {workflowRows.map((row) => (
              <ProgressRow
                key={row.label}
                label={row.label}
                value={row.value}
                total={Math.max(totalTitles, 1)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Contract Health"
          description="Current status of rights agreements."
        >
          <div className="space-y-3">
            {contractRows.map((row) => (
              <ProgressRow
                key={row.label}
                label={row.label}
                value={row.value}
                total={Math.max(totalContracts, 1)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Partner Pipeline"
          description="Partner onboarding and application status."
          actionHref="/admin/partners"
        >
          <div className="space-y-2">
            <InfoRow
              label="Total Applications"
              value={formatNumber(totalPartnerApplications)}
            />

            <InfoRow
              label="Pending"
              value={formatNumber(pendingPartners)}
            />

            <InfoRow
              label="Approved"
              value={formatNumber(approvedPartners)}
            />

            <InfoRow
              label="Rejected"
              value={formatNumber(rejectedPartners)}
            />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Top Genres"
          description="Most represented catalog categories."
        >
          <ProgressList
            items={topGenres}
            total={Math.max(totalTitles, 1)}
          />
        </SectionCard>

        <SectionCard
          title="Content Types"
          description="Breakdown by films, shows, animation, and other formats."
        >
          <ProgressList
            items={topTypes}
            total={Math.max(totalTitles, 1)}
          />
        </SectionCard>

        <SectionCard
          title="Top Partners"
          description="Partners contributing the most titles."
        >
          <SimpleList
            items={topPartners.map(([label, value]) => [
              label,
              `${value} titles`,
            ])}
          />
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Most Watchlisted"
          description="Titles viewers are saving for later."
        >
          <SimpleList
            items={topWatchlistTitles.map(
              ([label, value]) => [
                label,
                `${value} saves`,
              ]
            )}
          />
        </SectionCard>

        <SectionCard
          title="Most Liked"
          description="Titles receiving the strongest positive signals."
        >
          <SimpleList
            items={topLikedTitles.map(([label, value]) => [
              label,
              `${value} likes`,
            ])}
          />
        </SectionCard>

        <SectionCard
          title="Recent Titles"
          description="Latest titles added to SourceTV."
          actionHref="/admin/content"
        >
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
                  <p className="truncate text-sm font-medium text-white">
                    {title.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-white/35">
                    {title.workflowStage ||
                      title.status ||
                      "unknown"}
                    {title.creatorName
                      ? ` · ${title.creatorName}`
                      : ""}
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

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-8 text-sm text-white/40">
      {text}
    </div>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;
}