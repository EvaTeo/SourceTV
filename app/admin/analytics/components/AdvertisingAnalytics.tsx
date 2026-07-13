import Link from "next/link";
import DataTable, { Td } from "./DataTable";
import InfoRow from "./InfoRow";
import MiniStat from "./MiniStat";
import ProgressRow from "./ProgressRow";
import SectionCard from "./SectionCard";

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

type PlacementRow = {
  label: string;
  value: number;
};

type AdvertisingAnalyticsProps = {
  totalRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
  totalImpressions: number;
  impressionsToday: number;
  impressionsThisMonth: number;
  activeCampaigns: number;
  completedViews: number;
  skippedAds: number;
  clickedAds: number;
  ctr: number;
  completionRate: number;
  skipRate: number;
  averageWatchSeconds: number;
  campaignRows: CampaignRow[];
  placementRows: PlacementRow[];
};

export default function AdvertisingAnalytics({
  totalRevenue,
  revenueToday,
  revenueThisMonth,
  totalImpressions,
  impressionsToday,
  impressionsThisMonth,
  activeCampaigns,
  completedViews,
  skippedAds,
  clickedAds,
  ctr,
  completionRate,
  skipRate,
  averageWatchSeconds,
  campaignRows,
  placementRows,
}: AdvertisingAnalyticsProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdvertisingMetric
          label="Ad Revenue"
          value={money(totalRevenue)}
          description={`${money(revenueThisMonth)} this month`}
        />

        <AdvertisingMetric
          label="Impressions"
          value={formatNumber(totalImpressions)}
          description={`${formatNumber(
            impressionsToday
          )} delivered today`}
        />

        <AdvertisingMetric
          label="Ad CTR"
          value={`${ctr}%`}
          description={`${formatNumber(clickedAds)} clicks`}
        />

        <AdvertisingMetric
          label="Completion Rate"
          value={`${completionRate}%`}
          description={`${formatNumber(
            completedViews
          )} completed views`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard
          title="Campaign Performance"
          description="Delivery, engagement, completion, and advertiser spend."
          actionHref="/admin/ads"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat
              label="Revenue Today"
              value={money(revenueToday)}
            />

            <MiniStat
              label="Monthly Revenue"
              value={money(revenueThisMonth)}
            />

            <MiniStat
              label="Active Campaigns"
              value={formatNumber(activeCampaigns)}
            />

            <MiniStat
              label="Average Watch"
              value={`${averageWatchSeconds}s`}
            />
          </div>

          <DataTable
            className="mt-5"
            columns={[
              "Campaign",
              "Impressions",
              "CTR",
              "Completion",
              "Spend",
            ]}
            empty="No advertising campaign data yet."
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

                <Td>{campaign.completionRate}%</Td>

                <Td>
                  {money(campaign.spend / 100)}
                </Td>
              </tr>
            ))}
          </DataTable>
        </SectionCard>

        <SectionCard
          title="Delivery Snapshot"
          description="Fast advertising health indicators."
        >
          <div className="space-y-2">
            <InfoRow
              label="Total Impressions"
              value={formatNumber(totalImpressions)}
            />

            <InfoRow
              label="Impressions Today"
              value={formatNumber(impressionsToday)}
            />

            <InfoRow
              label="Impressions This Month"
              value={formatNumber(impressionsThisMonth)}
            />

            <InfoRow
              label="Completed Views"
              value={formatNumber(completedViews)}
            />

            <InfoRow
              label="Skipped Ads"
              value={formatNumber(skippedAds)}
            />

            <InfoRow
              label="Clicked Ads"
              value={formatNumber(clickedAds)}
            />

            <InfoRow
              label="Skip Rate"
              value={`${skipRate}%`}
            />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Placement Performance"
          description="Ad impressions delivered across each SourceTV placement."
        >
          {placementRows.length === 0 ? (
            <EmptyState text="No placement data available yet." />
          ) : (
            <div className="space-y-4">
              {placementRows.map((row) => (
                <ProgressRow
                  key={row.label}
                  label={formatPlacement(row.label)}
                  value={row.value}
                  total={Math.max(totalImpressions, 1)}
                />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Engagement Quality"
          description="How viewers respond to SourceTV advertising."
        >
          <div className="space-y-4">
            <EngagementRow
              label="Click-through rate"
              value={`${ctr}%`}
              description="Viewers who clicked an advertisement."
            />

            <EngagementRow
              label="Completion rate"
              value={`${completionRate}%`}
              description="Ads watched through completion."
            />

            <EngagementRow
              label="Skip rate"
              value={`${skipRate}%`}
              description="Ads skipped before completion."
            />

            <EngagementRow
              label="Average watch time"
              value={`${averageWatchSeconds}s`}
              description="Average seconds watched per impression."
            />
          </div>
        </SectionCard>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Advertising Operations
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Manage SourceTV advertising
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Create campaigns, review delivery, manage placements,
            and inspect individual impressions.
          </p>
        </div>

        <Link
          href="/admin/ads"
          className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          Open Advertising
        </Link>
      </section>
    </div>
  );
}

function AdvertisingMetric({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-white/40">
        {description}
      </p>
    </div>
  );
}

function EngagementRow({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-white">
          {label}
        </p>

        <p className="text-lg font-semibold text-sky-300">
          {value}
        </p>
      </div>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {description}
      </p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
      {text}
    </div>
  );
}

function formatPlacement(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
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