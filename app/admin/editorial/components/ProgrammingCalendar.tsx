"use client";

import { useEffect, useMemo, useState } from "react";
import type { EditorialCollection } from "../types";

type HeroProject = {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  featured?: boolean;
  featuredRank?: number | null;
  heroPriority?: number | null;
  heroStartDate?: string | null;
  heroEndDate?: string | null;
};

type CalendarEntry = {
  id: string;
  title: string;
  kind: "collection" | "hero";
  startsAt: string | null;
  endsAt: string | null;
  imageUrl?: string | null;
  status?: string;
  itemCount?: number;
};

function parseDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value?: string | null) {
  const date = parseDate(value);

  if (!date) return "No date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getEntryStatus(entry: CalendarEntry) {
  const now = Date.now();
  const start = parseDate(entry.startsAt)?.getTime() ?? null;
  const end = parseDate(entry.endsAt)?.getTime() ?? null;

  if (start && start > now) {
    return "Upcoming";
  }

  if (end && end < now) {
    return "Expired";
  }

  return "Active";
}

export default function ProgrammingCalendar() {
  const [collections, setCollections] = useState<
    EditorialCollection[]
  >([]);
  const [heroes, setHeroes] = useState<HeroProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalendar() {
      try {
        setLoading(true);

        const [collectionsResponse, contentResponse] =
          await Promise.all([
            fetch("/api/admin/collections", {
              cache: "no-store",
            }),
            fetch("/api/admin/content", {
              cache: "no-store",
            }),
          ]);

        const collectionsData =
          await collectionsResponse.json();

        const contentData = await contentResponse.json();

        if (!collectionsResponse.ok) {
          throw new Error(
            collectionsData?.error ||
              "Failed to load collections."
          );
        }

        if (!contentResponse.ok) {
          throw new Error(
            contentData?.error ||
              contentData?.message ||
              "Failed to load hero programming."
          );
        }

        setCollections(
          Array.isArray(collectionsData)
            ? collectionsData
            : []
        );

        setHeroes(
          Array.isArray(contentData)
            ? contentData.filter(
                (project: HeroProject) =>
                  project.featured
              )
            : []
        );
      } catch (error) {
        console.error(
          "PROGRAMMING CALENDAR LOAD ERROR:",
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "Could not load the programming calendar."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCalendar();
  }, []);

  const entries = useMemo<CalendarEntry[]>(() => {
    const collectionEntries = collections
      .filter(
        (collection) =>
          collection.startsAt || collection.endsAt
      )
      .map((collection) => ({
        id: `collection-${collection.id}`,
        title: collection.title,
        kind: "collection" as const,
        startsAt: collection.startsAt || null,
        endsAt: collection.endsAt || null,
        status: collection.status,
        itemCount: collection.items.length,
      }));

    const heroEntries = heroes
      .filter(
        (hero) =>
          hero.heroStartDate || hero.heroEndDate
      )
      .map((hero) => ({
        id: `hero-${hero.id}`,
        title: hero.title,
        kind: "hero" as const,
        startsAt: hero.heroStartDate || null,
        endsAt: hero.heroEndDate || null,
        imageUrl:
          hero.backdropUrl ||
          hero.thumbnailUrl ||
          null,
      }));

    return [...collectionEntries, ...heroEntries].sort(
      (a, b) => {
        const aDate =
          parseDate(a.startsAt)?.getTime() ??
          parseDate(a.endsAt)?.getTime() ??
          0;

        const bDate =
          parseDate(b.startsAt)?.getTime() ??
          parseDate(b.endsAt)?.getTime() ??
          0;

        return aDate - bDate;
      }
    );
  }, [collections, heroes]);

  const groupedEntries = useMemo(() => {
    const groups = new Map<
      string,
      {
        label: string;
        entries: CalendarEntry[];
      }
    >();

    entries.forEach((entry) => {
      const date =
        parseDate(entry.startsAt) ||
        parseDate(entry.endsAt);

      if (!date) return;

      const key = getMonthKey(date);

      if (!groups.has(key)) {
        groups.set(key, {
          label: getMonthLabel(date),
          entries: [],
        });
      }

      groups.get(key)?.entries.push(entry);
    });

    return Array.from(groups.entries());
  }, [entries]);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-white/45">
        Loading programming calendar...
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Scheduled Items"
          value={entries.length}
        />

        <MetricCard
          label="Upcoming"
          value={
            entries.filter(
              (entry) =>
                getEntryStatus(entry) === "Upcoming"
            ).length
          }
        />

        <MetricCard
          label="Currently Active"
          value={
            entries.filter(
              (entry) =>
                getEntryStatus(entry) === "Active"
            ).length
          }
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <div className="border-b border-white/[0.08] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Programming Timeline
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Calendar
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Review scheduled hero rotations and editorial
            collections by month.
          </p>
        </div>

        {groupedEntries.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <h3 className="text-lg font-semibold text-white">
              Nothing scheduled
            </h3>

            <p className="mt-2 text-sm text-white/40">
              Add start or end dates to hero titles and
              collections to display them here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {groupedEntries.map(
              ([monthKey, group]) => (
                <div key={monthKey}>
                  <div className="mb-4 flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-white">
                      {group.label}
                    </h3>

                    <div className="h-px flex-1 bg-white/[0.08]" />

                    <span className="text-xs text-white/30">
                      {group.entries.length} item
                      {group.entries.length === 1
                        ? ""
                        : "s"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {group.entries.map((entry) => (
                      <CalendarRow
                        key={entry.id}
                        entry={entry}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function CalendarRow({
  entry,
}: {
  entry: CalendarEntry;
}) {
  const status = getEntryStatus(entry);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:flex-row sm:items-center">
      {entry.imageUrl ? (
        <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
          <img
            src={entry.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-lg text-white/35">
          {entry.kind === "hero" ? "H" : "C"}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              entry.kind === "hero"
                ? "bg-sky-300/10 text-sky-200"
                : "bg-violet-400/10 text-violet-200"
            }`}
          >
            {entry.kind}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              status === "Active"
                ? "bg-emerald-400/10 text-emerald-200"
                : status === "Upcoming"
                  ? "bg-amber-400/10 text-amber-200"
                  : "bg-white/[0.05] text-white/35"
            }`}
          >
            {status}
          </span>
        </div>

        <h3 className="mt-3 truncate text-sm font-semibold text-white">
          {entry.title}
        </h3>

        {entry.kind === "collection" &&
          entry.itemCount !== undefined && (
            <p className="mt-1 text-xs text-white/35">
              {entry.itemCount} title
              {entry.itemCount === 1 ? "" : "s"}
            </p>
          )}
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-4 text-left sm:text-right">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
            Starts
          </p>

          <p className="mt-1 text-xs font-medium text-white/65">
            {entry.startsAt
              ? formatDate(entry.startsAt)
              : "Immediately"}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
            Ends
          </p>

          <p className="mt-1 text-xs font-medium text-white/65">
            {entry.endsAt
              ? formatDate(entry.endsAt)
              : "No end date"}
          </p>
        </div>
      </div>
    </article>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}