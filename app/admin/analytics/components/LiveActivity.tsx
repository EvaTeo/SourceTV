import Link from "next/link";

export type LiveActivityItem = {
  id: string;
  type:
    | "watch"
    | "completion"
    | "user"
    | "partner"
    | "contract"
    | "collection"
    | "hero"
    | "ad";
  title: string;
  description: string;
  timestamp: string;
  href?: string;
};

type LiveActivityProps = {
  items: LiveActivityItem[];
};

const iconMap: Record<LiveActivityItem["type"], string> = {
  watch: "▶",
  completion: "✓",
  user: "U",
  partner: "P",
  contract: "C",
  collection: "R",
  hero: "H",
  ad: "A",
};

const labelMap: Record<LiveActivityItem["type"], string> = {
  watch: "Playback",
  completion: "Completion",
  user: "User",
  partner: "Partner",
  contract: "Contract",
  collection: "Collection",
  hero: "Hero",
  ad: "Advertising",
};

export default function LiveActivity({
  items,
}: LiveActivityProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ActivityMetric
          label="Recent Events"
          value={formatNumber(items.length)}
          description="Latest recorded platform activity"
        />

        <ActivityMetric
          label="Playback Events"
          value={formatNumber(
            items.filter(
              (item) =>
                item.type === "watch" ||
                item.type === "completion"
            ).length
          )}
          description="Watch starts and completions"
        />

        <ActivityMetric
          label="Business Events"
          value={formatNumber(
            items.filter((item) =>
              [
                "partner",
                "contract",
                "collection",
                "hero",
              ].includes(item.type)
            ).length
          )}
          description="Editorial and partner changes"
        />

        <ActivityMetric
          label="Ad Events"
          value={formatNumber(
            items.filter((item) => item.type === "ad")
              .length
          )}
          description="Recent advertising signals"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              Platform Feed
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Live Activity
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Recent viewer, editorial, partner, contract, and
              advertising activity across SourceTV.
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/45">
            Latest {items.length}
          </span>
        </div>

        <div className="mt-6">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <h3 className="text-lg font-semibold text-white">
                No recent activity
              </h3>

              <p className="mt-2 text-sm text-white/40">
                New SourceTV events will appear here as they are
                recorded.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ActivityRow({
  item,
}: {
  item: LiveActivityItem;
}) {
  const content = (
    <article className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-white/15 hover:bg-white/[0.04]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-sky-300">
        {iconMap[item.type]}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {labelMap[item.type]}
              </span>

              <h3 className="truncate text-sm font-semibold text-white">
                {item.title}
              </h3>
            </div>

            <p className="mt-2 text-sm leading-6 text-white/40">
              {item.description}
            </p>
          </div>

          <time className="shrink-0 text-xs text-white/30">
            {formatTimestamp(item.timestamp)}
          </time>
        </div>
      </div>
    </article>
  );

  if (!item.href) {
    return content;
  }

  return (
    <Link href={item.href} className="block">
      {content}
    </Link>
  );
}

function ActivityMetric({
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

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const difference = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    return `${Math.floor(difference / minute)}m ago`;
  }

  if (difference < day) {
    return `${Math.floor(difference / hour)}h ago`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value: number) {
  return value.toLocaleString();
}