import Link from "next/link";

const card =
  "rounded-3xl border border-white/10 bg-white/[0.03]";

export type EditorialCollectionRow = {
  id: string;
  title: string;
  placement: string;
  status: string;
  itemCount: number;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type EditorialHeroRow = {
  id: string;
  title: string;
  badge?: string | null;
  priority: number;
  featuredRank?: number | null;
  views: number;
  genre?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
};

type EditorialAnalyticsProps = {
  activeCollections?: number;
  scheduledCollections?: number;
  totalCollectionItems?: number;
  activeHeroes?: number;
  collections?: EditorialCollectionRow[];
  heroes?: EditorialHeroRow[];
};

export default function EditorialAnalytics({
  activeCollections = 0,
  scheduledCollections = 0,
  totalCollectionItems = 0,
  activeHeroes = 0,
  collections = [],
  heroes = [],
}: EditorialAnalyticsProps) {
  const averageItemsPerCollection =
    collections.length > 0
      ? Math.round(
          (totalCollectionItems / collections.length) * 10
        ) / 10
      : 0;

  const performanceCards = [
    {
      label: "Active Collections",
      value: formatNumber(activeCollections),
      description: "Currently visible homepage rows",
    },
    {
      label: "Scheduled Collections",
      value: formatNumber(scheduledCollections),
      description: "Rows waiting for publication",
    },
    {
      label: "Collection Titles",
      value: formatNumber(totalCollectionItems),
      description: "Titles placed across collections",
    },
    {
      label: "Active Heroes",
      value: formatNumber(activeHeroes),
      description: "Titles in the hero rotation",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {performanceCards.map((item) => (
          <div
            key={item.label}
            className={`${card} p-5`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
              {item.label}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              {item.value}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              {item.description}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <div className={`${card} overflow-hidden`}>
          <div className="flex flex-col gap-4 border-b border-white/[0.08] p-5 sm:flex-row sm:items-start sm:justify-between md:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                Homepage Programming
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                Editorial Collections
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
                Review the current collection order, publication
                status, placement, scheduling, and title volume.
              </p>
            </div>

            <Link
              href="/admin/editorial"
              className="inline-flex shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              Open Editorial
            </Link>
          </div>

          {collections.length === 0 ? (
            <EmptyState
              title="No editorial collections yet"
              description="Create a homepage collection to begin programming curated rows."
              href="/admin/editorial"
              action="Create Collection"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="border-b border-white/10 bg-white/[0.02]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Collection
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Placement
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Titles
                    </th>

                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Schedule
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {collections.map((collection) => (
                    <tr
                      key={collection.id}
                      className="border-t border-white/[0.07] transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">
                          {collection.title}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-sm text-white/55">
                        {formatLabel(collection.placement)}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-white/70">
                        {formatNumber(collection.itemCount)}
                      </td>

                      <td className="px-4 py-4 text-sm text-white/55">
                        {formatSchedule(
                          collection.startsAt,
                          collection.endsAt
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={collection.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid gap-4 border-t border-white/[0.08] p-5 sm:grid-cols-3 md:p-6">
            <SummaryItem
              label="Total Collections"
              value={formatNumber(collections.length)}
            />

            <SummaryItem
              label="Average Row Size"
              value={formatDecimal(
                averageItemsPerCollection
              )}
            />

            <SummaryItem
              label="Titles Programmed"
              value={formatNumber(totalCollectionItems)}
            />
          </div>
        </div>

        <div className={`${card} overflow-hidden`}>
          <div className="border-b border-white/[0.08] p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
              Hero Rotation
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Current Heroes
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Ranked hero titles currently available to the
              homepage rotation.
            </p>
          </div>

          {heroes.length === 0 ? (
            <EmptyState
              title="No hero titles active"
              description="Add featured titles to begin building the homepage hero rotation."
              href="/admin/editorial"
              action="Manage Heroes"
              compact
            />
          ) : (
            <div className="space-y-3 p-5 md:p-6">
              {heroes.map((hero, index) => (
                <article
                  key={hero.id}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/65">
                        #
                        {hero.featuredRank ||
                          index + 1}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold text-white">
                          {hero.title}
                        </h3>

                        <p className="mt-1 text-xs text-white/35">
                          {hero.genre ||
                            "Uncategorized"}
                        </p>
                      </div>
                    </div>

                    {hero.badge ? (
                      <span className="shrink-0 rounded-full border border-sky-300/15 bg-sky-300/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-200">
                        {formatLabel(hero.badge)}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <HeroDetail
                      label="Priority"
                      value={formatNumber(hero.priority)}
                    />

                    <HeroDetail
                      label="Title Views"
                      value={formatNumber(hero.views)}
                    />
                  </div>

                  <div className="mt-3 border-t border-white/[0.07] pt-3 text-xs text-white/35">
                    {formatSchedule(
                      hero.startsAt,
                      hero.endsAt
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="border-t border-white/[0.08] p-5 md:p-6">
            <Link
              href="/admin/editorial"
              className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
            >
              Manage Hero Rotation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/30">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function HeroDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.035] px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white/75">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toLowerCase();

  const styles =
    normalized === "active" ||
    normalized === "published"
      ? "border-emerald-300/15 bg-emerald-300/10 text-emerald-200"
      : normalized === "scheduled"
        ? "border-sky-300/15 bg-sky-300/10 text-sky-200"
        : normalized === "draft"
          ? "border-amber-300/15 bg-amber-300/10 text-amber-200"
          : "border-white/10 bg-white/[0.04] text-white/45";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${styles}`}
    >
      {formatLabel(status)}
    </span>
  );
}

function EmptyState({
  title,
  description,
  href,
  action,
  compact = false,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`text-center ${
        compact ? "p-8" : "p-12"
      }`}
    >
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-sky-300">
        E
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
      >
        {action}
      </Link>
    </div>
  );
}

function formatSchedule(
  startsAt?: string | null,
  endsAt?: string | null
) {
  if (!startsAt && !endsAt) {
    return "Always available";
  }

  if (startsAt && endsAt) {
    return `${formatDate(startsAt)} – ${formatDate(
      endsAt
    )}`;
  }

  if (startsAt) {
    return `Starts ${formatDate(startsAt)}`;
  }

  return `Ends ${formatDate(endsAt as string)}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatLabel(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

function formatDecimal(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
}