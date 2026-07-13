import Link from "next/link";
import InfoRow from "./InfoRow";
import MiniStat from "./MiniStat";
import ProgressRow from "./ProgressRow";
import SectionCard from "./SectionCard";

type RevenueAnalyticsProps = {
  adRevenue: number;
  revenueToday: number;
  revenueThisMonth: number;
  estimatedPartnerShare: number;
  estimatedPlatformProfit: number;
  totalAdSpend: number;
  activeCampaigns: number;
  totalImpressions: number;
  signedContracts: number;
  totalContracts: number;
  publishedTitles: number;
  totalTitles: number;
  placementRows: Array<{
    label: string;
    value: number;
  }>;
  partnerRows: Array<[string, number]>;
};

export default function RevenueAnalytics({
  adRevenue,
  revenueToday,
  revenueThisMonth,
  estimatedPartnerShare,
  estimatedPlatformProfit,
  totalAdSpend,
  activeCampaigns,
  totalImpressions,
  signedContracts,
  totalContracts,
  publishedTitles,
  totalTitles,
  placementRows,
  partnerRows,
}: RevenueAnalyticsProps) {
  const platformMargin =
    adRevenue > 0
      ? Math.round(
          (estimatedPlatformProfit / adRevenue) * 100
        )
      : 0;

  const partnerShareRate =
    adRevenue > 0
      ? Math.round(
          (estimatedPartnerShare / adRevenue) * 100
        )
      : 0;

  const signedContractRate = percent(
    signedContracts,
    totalContracts
  );

  const publishedRate = percent(
    publishedTitles,
    totalTitles
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <RevenueMetric
          label="Total Revenue"
          value={money(adRevenue)}
          description={`${money(
            revenueThisMonth
          )} this month`}
        />

        <RevenueMetric
          label="Platform Profit"
          value={money(estimatedPlatformProfit)}
          description={`${platformMargin}% estimated margin`}
        />

        <RevenueMetric
          label="Partner Share"
          value={money(estimatedPartnerShare)}
          description={`${partnerShareRate}% of revenue`}
        />

        <RevenueMetric
          label="Ad Spend"
          value={money(totalAdSpend)}
          description={`${formatNumber(
            activeCampaigns
          )} active campaigns`}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard
          title="Revenue Performance"
          description="SourceTV revenue, partner obligations, and estimated platform earnings."
          actionHref="/admin/revenue"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MiniStat
              label="Revenue Today"
              value={money(revenueToday)}
            />

            <MiniStat
              label="This Month"
              value={money(revenueThisMonth)}
            />

            <MiniStat
              label="Total Impressions"
              value={formatNumber(totalImpressions)}
            />

            <MiniStat
              label="Active Campaigns"
              value={formatNumber(activeCampaigns)}
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <FinancialCard
              label="Gross Advertising Revenue"
              value={money(adRevenue)}
              description="Total recorded campaign spend across SourceTV."
            />

            <FinancialCard
              label="Estimated Partner Payouts"
              value={money(estimatedPartnerShare)}
              description="Estimated revenue share owed to participating partners."
            />

            <FinancialCard
              label="Estimated Platform Profit"
              value={money(estimatedPlatformProfit)}
              description="Revenue remaining after estimated partner obligations."
            />

            <FinancialCard
              label="Platform Margin"
              value={`${platformMargin}%`}
              description="Estimated share of revenue retained by SourceTV."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Business Health"
          description="Fast indicators affecting SourceTV revenue."
        >
          <div className="space-y-2">
            <InfoRow
              label="Signed Contracts"
              value={formatNumber(signedContracts)}
            />

            <InfoRow
              label="Contract Completion"
              value={`${signedContractRate}%`}
            />

            <InfoRow
              label="Published Titles"
              value={formatNumber(publishedTitles)}
            />

            <InfoRow
              label="Published Catalog"
              value={`${publishedRate}%`}
            />

            <InfoRow
              label="Revenue Per Impression"
              value={money(
                totalImpressions > 0
                  ? adRevenue / totalImpressions
                  : 0
              )}
            />

            <InfoRow
              label="Revenue Per Campaign"
              value={money(
                activeCampaigns > 0
                  ? adRevenue / activeCampaigns
                  : 0
              )}
            />
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Revenue by Placement"
          description="Advertising delivery across SourceTV placements."
        >
          {placementRows.length === 0 ? (
            <EmptyState text="No placement revenue data yet." />
          ) : (
            <div className="space-y-4">
              {placementRows.map((row) => (
                <ProgressRow
                  key={row.label}
                  label={formatLabel(row.label)}
                  value={row.value}
                  total={Math.max(totalImpressions, 1)}
                />
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Top Revenue Partners"
          description="Partners contributing the largest number of monetizable titles."
        >
          {partnerRows.length === 0 ? (
            <EmptyState text="No partner revenue data yet." />
          ) : (
            <div className="space-y-3">
              {partnerRows.map(
                ([partner, titleCount], index) => (
                  <div
                    key={`${partner}-${index}`}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm font-semibold text-sky-300">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {partner}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        {formatNumber(titleCount)} title
                        {titleCount === 1 ? "" : "s"}
                      </p>
                    </div>

                    <p className="text-xs font-medium text-white/45">
                      {money(
                        totalTitles > 0
                          ? (adRevenue * titleCount) /
                              totalTitles
                          : 0
                      )}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <RevenueStatusCard
          label="Partner Revenue Share"
          value={`${partnerShareRate}%`}
          description="Estimated portion distributed to content partners."
        />

        <RevenueStatusCard
          label="Platform Retention"
          value={`${platformMargin}%`}
          description="Estimated revenue retained by SourceTV."
        />

        <RevenueStatusCard
          label="Contract Coverage"
          value={`${signedContractRate}%`}
          description="Rights contracts currently signed."
        />
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Revenue Operations
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Review SourceTV financial performance
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Inspect campaign revenue, partner payouts,
            subscription performance, and platform earnings.
          </p>
        </div>

        <Link
          href="/admin/revenue"
          className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          Open Revenue
        </Link>
      </section>
    </div>
  );
}

function RevenueMetric({
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

function FinancialCard({
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
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {description}
      </p>
    </div>
  );
}

function RevenueStatusCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-2 text-sm leading-6 text-white/40">
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

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function formatLabel(value: string) {
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}