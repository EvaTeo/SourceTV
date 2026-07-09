import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import EmptyState from "@/app/components/admin/EmptyState";
import MetricCard from "@/app/components/admin/MetricCard";

import Panel from "./components/Panel";
import MoneyRow from "./components/MoneyRow";
import PartnerRow from "./components/PartnerRow";
import RevenueTitleRow from "./components/RevenueTitleRow";
import RoadmapCard from "./components/RoadmapCard";
import { money } from "./utils";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const ESTIMATED_CPM = 12;
const PARTNER_SHARE_RATE = 0.45;
const SOURCETV_SHARE_RATE = 0.55;

export default async function AdminRevenuePage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const titles = await prisma.projectSubmission.findMany({
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
  });

  const published = titles.filter((t) => t.workflowStage === "published");
  const totalViews = titles.reduce((sum, t) => sum + (t.views || 0), 0);

  const estimatedAdRevenue = (totalViews / 1000) * ESTIMATED_CPM;
  const partnerPool = estimatedAdRevenue * PARTNER_SHARE_RATE;
  const sourceTVProfit = estimatedAdRevenue * SOURCETV_SHARE_RATE;

  const avgRevenuePerTitle =
    titles.length > 0 ? estimatedAdRevenue / titles.length : 0;

  const topRevenueTitles = titles.slice(0, 10);

  const partnerRevenue = titles.reduce(
    (
      map: Record<
        string,
        {
          titles: number;
          views: number;
          revenue: number;
          partnerShare: number;
        }
      >,
      title
    ) => {
      const partner = title.creatorName || title.creatorEmail || "Unknown";
      const views = title.views || 0;
      const revenue = (views / 1000) * ESTIMATED_CPM;

      if (!map[partner]) {
        map[partner] = {
          titles: 0,
          views: 0,
          revenue: 0,
          partnerShare: 0,
        };
      }

      map[partner].titles += 1;
      map[partner].views += views;
      map[partner].revenue += revenue;
      map[partner].partnerShare += revenue * PARTNER_SHARE_RATE;

      return map;
    },
    {}
  );

  const topPartners = Object.entries(partnerRevenue)
    .map(([partner, data]) => ({ partner, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const revenueRows = [
    {
      label: "Advertising Revenue",
      value: estimatedAdRevenue,
      note: "Estimated from total internal views.",
    },
    {
      label: "Partner Participation Pool",
      value: partnerPool,
      note: `${Math.round(PARTNER_SHARE_RATE * 100)}% estimated partner share.`,
    },
    {
      label: "SourceTV Retained Profit",
      value: sourceTVProfit,
      note: `${Math.round(SOURCETV_SHARE_RATE * 100)}% retained by SourceTV.`,
    },
  ];

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Revenue Center
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
                Revenue & Participation
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
                Prototype financial overview for advertising revenue,
                participation earnings, partner share, and SourceTV retained
                profit. Final numbers will connect to ad reporting later.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-200">
                Estimated Total Revenue
              </p>
              <p className="mt-3 text-4xl font-black">
                {money(estimatedAdRevenue)}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Based on {totalViews.toLocaleString()} internal views at an
                estimated ${ESTIMATED_CPM} CPM.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total Views" value={totalViews.toLocaleString()} />
          <MetricCard label="Published Titles" value={published.length} />
          <MetricCard label="Estimated CPM" value={`$${ESTIMATED_CPM}`} />
          <MetricCard label="Avg Revenue / Title" value={money(avgRevenuePerTitle)} />
          <MetricCard label="Ad Revenue" value={money(estimatedAdRevenue)} />
          <MetricCard label="Partner Pool" value={money(partnerPool)} />
          <MetricCard label="SourceTV Profit" value={money(sourceTVProfit)} />
          <MetricCard label="Profit Margin"
            value={`${Math.round(SOURCETV_SHARE_RATE * 100)}%`}
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel
            eyebrow="Revenue Split"
            title="Financial Breakdown"
            description="How estimated advertising revenue is currently modeled."
          >
            <div className="space-y-4">
              {revenueRows.map((row) => (
                <MoneyRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  note={row.note}
                  percent={
                    estimatedAdRevenue > 0
                      ? Math.round((row.value / estimatedAdRevenue) * 100)
                      : 0
                  }
                />
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Assumptions"
            title="Prototype Revenue Model"
            description="These are internal estimates until ad network reporting is connected."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <InfoBox
                label="CPM"
                value={`$${ESTIMATED_CPM}`}
                note="Estimated revenue per 1,000 ad views."
              />
              <InfoBox
                label="Formula"
                value="Views ÷ 1000 × CPM"
                note="Used for prototype revenue calculations."
              />
              <InfoBox
                label="Partner Share"
                value={`${Math.round(PARTNER_SHARE_RATE * 100)}%`}
                note="Estimated participation pool."
              />
              <InfoBox
                label="SourceTV Share"
                value={`${Math.round(SOURCETV_SHARE_RATE * 100)}%`}
                note="Estimated retained platform revenue."
              />
            </div>
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Panel
            eyebrow="Titles"
            title="Top Revenue Titles"
            description="Estimated earnings by title, ranked by internal views."
          >
            {topRevenueTitles.length === 0 ? (
<EmptyState title="No revenue data yet." />
            ) : (
              <div className="space-y-3">
                {topRevenueTitles.map((title, index) => {
                  const views = title.views || 0;
                  const revenue = (views / 1000) * ESTIMATED_CPM;
                  const titlePartnerShare = revenue * PARTNER_SHARE_RATE;

                  return (
                    <RevenueTitleRow
                      key={title.id}
                      rank={index + 1}
                      title={title.title}
                      meta={`${views.toLocaleString()} views${
                        title.genre ? ` • ${title.genre}` : ""
                      }`}
                      revenue={money(revenue)}
                      partnerShare={money(titlePartnerShare)}
                    />
                  );
                })}
              </div>
            )}
          </Panel>

          <Panel
            eyebrow="Partners"
            title="Top Earning Partners"
            description="Estimated partner participation by catalog contribution."
          >
            {topPartners.length === 0 ? (
<EmptyState title="No revenue data yet." />
            ) : (
              <div className="space-y-3">
                {topPartners.map((partner) => (
                  <PartnerRow
                    key={partner.partner}
                    partner={partner.partner}
                    titles={partner.titles}
                    views={partner.views}
                    value={money(partner.partnerShare)}
                  />
                ))}
              </div>
            )}
          </Panel>
        </section>

        <section className="mt-8">
          <Panel
            eyebrow="Future Systems"
            title="Revenue Roadmap"
            description="What this center should eventually connect to."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <RoadmapCard
                title="Ad Network Reports"
                body="Connect real impressions, fill rate, CPM, completion rate, and advertiser demand."
              />
              <RoadmapCard
                title="Partner Payouts"
                body="Generate partner statements, participation balances, payout status, and monthly exports."
              />
              <RoadmapCard
                title="Title-Level Finance"
                body="Track revenue by title, territory, source, campaign, and licensing model."
              />
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function InfoBox({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-sky-300">{value}</p>
      <p className="mt-2 text-xs leading-5 text-white/38">{note}</p>
    </div>
  );
}