import Link from "next/link";

export type AIInsight = {
  id: string;
  title: string;
  description: string;
  category:
    | "editorial"
    | "audience"
    | "revenue"
    | "advertising"
    | "catalog";
  priority: "high" | "medium" | "low";
  actionLabel?: string;
  actionHref?: string;
};

type AIInsightsProps = {
  insights: AIInsight[];
};

const categoryLabels: Record<
  AIInsight["category"],
  string
> = {
  editorial: "Editorial",
  audience: "Audience",
  revenue: "Revenue",
  advertising: "Advertising",
  catalog: "Catalog",
};

const priorityClasses: Record<
  AIInsight["priority"],
  string
> = {
  high: "border-red-400/20 bg-red-500/10 text-red-200",
  medium:
    "border-amber-400/20 bg-amber-500/10 text-amber-200",
  low: "border-sky-300/20 bg-sky-300/10 text-sky-200",
};

export default function AIInsights({
  insights,
}: AIInsightsProps) {
  const highPriorityCount = insights.filter(
    (insight) => insight.priority === "high"
  ).length;

  const editorialCount = insights.filter(
    (insight) => insight.category === "editorial"
  ).length;

  const revenueCount = insights.filter(
    (insight) => insight.category === "revenue"
  ).length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightMetric
          label="Active Insights"
          value={formatNumber(insights.length)}
          description="Current recommendations"
        />

        <InsightMetric
          label="High Priority"
          value={formatNumber(highPriorityCount)}
          description="Needs attention"
        />

        <InsightMetric
          label="Editorial"
          value={formatNumber(editorialCount)}
          description="Programming opportunities"
        />

        <InsightMetric
          label="Revenue"
          value={formatNumber(revenueCount)}
          description="Financial opportunities"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              SourceTV Intelligence
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              AI Insights
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
              Automated recommendations based on editorial,
              audience, advertising, revenue, and catalog
              performance.
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/45">
            {insights.length} insight
            {insights.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-6">
          {insights.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg font-semibold text-sky-300">
                AI
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                No insights available yet
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Recommendations will appear as SourceTV collects
                more viewer and programming data.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <CategorySummary
          label="Programming"
          description="Hero placement, collection order, scheduling, and homepage recommendations."
          count={
            insights.filter(
              (insight) =>
                insight.category === "editorial"
            ).length
          }
          href="/admin/editorial"
        />

        <CategorySummary
          label="Audience"
          description="Viewer behavior, genre interest, completion, and engagement opportunities."
          count={
            insights.filter(
              (insight) =>
                insight.category === "audience"
            ).length
          }
          href="/admin/users"
        />

        <CategorySummary
          label="Business"
          description="Revenue, advertising, campaign, and catalog optimization opportunities."
          count={
            insights.filter((insight) =>
              [
                "revenue",
                "advertising",
                "catalog",
              ].includes(insight.category)
            ).length
          }
          href="/admin/revenue"
        />
      </section>
    </div>
  );
}

function InsightCard({
  insight,
}: {
  insight: AIInsight;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-sky-300/15 bg-sky-300/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-200">
          {categoryLabels[insight.category]}
        </span>

        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${priorityClasses[insight.priority]}`}
        >
          {insight.priority} priority
        </span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white">
        {insight.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-white/40">
        {insight.description}
      </p>

      {insight.actionHref && insight.actionLabel && (
        <div className="mt-5 border-t border-white/[0.07] pt-4">
          <Link
            href={insight.actionHref}
            className="inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            {insight.actionLabel}
          </Link>
        </div>
      )}
    </article>
  );
}

function InsightMetric({
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

function CategorySummary({
  label,
  description,
  count,
  href,
}: {
  label: string;
  description: string;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
          {label}
        </p>

        <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-white/45">
          {count}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-white/40">
        {description}
      </p>
    </Link>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString();
}