import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const [titles, partnerApplications] = await Promise.all([
    prisma.projectSubmission.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.partnerApplication.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

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

  const partnerCounts = titles.reduce((map: Record<string, number>, title) => {
    const partner = title.creatorName || title.creatorEmail || "Unknown";
    map[partner] = (map[partner] || 0) + 1;
    return map;
  }, {});

  const topPartners = Object.entries(partnerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const workflowRows = [
    {
      label: "Submissions",
      value: titles.filter((t) => t.workflowStage === "submission").length,
    },
    {
      label: "Metadata Review",
      value: titles.filter((t) => t.workflowStage === "metadata_review").length,
    },
    {
      label: "Content Review",
      value: titles.filter((t) => t.workflowStage === "content_review").length,
    },
    {
      label: "Rights Review",
      value: titles.filter((t) => t.workflowStage === "rights_review").length,
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

  const estimatedMonthlyAdRevenue = totalViews * 0.025;
  const estimatedPartnerShare = estimatedMonthlyAdRevenue * 0.45;
  const estimatedPlatformProfit =
    estimatedMonthlyAdRevenue - estimatedPartnerShare;

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Analytics
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
                Platform Insights
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
                Track catalog performance, audience activity, workflow health,
                partner activity, and early revenue signals.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-200">
                Prototype Revenue Model
              </p>
              <p className="mt-3 text-3xl font-black">
                ${estimatedMonthlyAdRevenue.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Estimated from internal views only. This becomes real when ad
                reporting is connected.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Titles" value={totalTitles} />
          <StatCard label="Published" value={published.length} />
          <StatCard label="In Review" value={inReview.length} />
          <StatCard label="Total Views" value={totalViews} />
          <StatCard label="Avg Views / Title" value={avgViews} />
          <StatCard label="Scheduled" value={scheduled.length} />
          <StatCard label="Pending Partners" value={pendingPartners.length} />
          <StatCard label="Approved Partners" value={approvedPartners.length} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel
            title="Top Titles"
            eyebrow="Audience"
            description="Most watched titles across SourceTV."
          >
            {topTitles.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topTitles.map((title, index) => (
                  <RankRow
                    key={title.id}
                    rank={index + 1}
                    label={title.title}
                    sublabel={`${title.type || "Title"}${
                      title.genre ? ` • ${title.genre}` : ""
                    }`}
                    value={`${(title.views || 0).toLocaleString()} views`}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Performance Snapshot"
            eyebrow="Summary"
            description="Quick read on current catalog health."
          >
            <div className="space-y-3">
              <Row
                label="Most Viewed"
                value={
                  mostViewed
                    ? `${mostViewed.title} (${(mostViewed.views || 0).toLocaleString()})`
                    : "No data"
                }
              />
              <Row label="Published Share" value={`${percent(published.length, totalTitles)}%`} />
              <Row label="Review Queue Share" value={`${percent(inReview.length, totalTitles)}%`} />
              <Row
                label="Estimated Partner Share"
                value={`$${estimatedPartnerShare.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`}
              />
              <Row
                label="Estimated Platform Profit"
                value={`$${estimatedPlatformProfit.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`}
              />
            </div>
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Panel
            title="Workflow Health"
            eyebrow="Operations"
            description="Where content currently sits in the pipeline."
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
          </Panel>

          <Panel
            title="Top Genres"
            eyebrow="Catalog"
            description="Most represented categories in the catalog."
          >
            {topGenres.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topGenres.map(([genre, count]) => (
                  <ProgressRow
                    key={genre}
                    label={genre}
                    value={count}
                    total={Math.max(totalTitles, 1)}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Top Partners"
            eyebrow="Partners"
            description="Partners contributing the most titles."
          >
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

        <section className="mt-8">
          <Panel
            title="Recent Titles"
            eyebrow="Catalog Activity"
            description="Latest titles added to SourceTV."
          >
            {recentTitles.length === 0 ? (
              <Empty />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {recentTitles.map((title) => (
                  <div
                    key={title.id}
                    className="rounded-2xl border border-white/10 bg-black/25 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-black text-white/85">
                          {title.title}
                        </p>
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
    </main>
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

function Panel({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: React.ReactNode;
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
        <p className="font-bold text-white/70">{label}</p>
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