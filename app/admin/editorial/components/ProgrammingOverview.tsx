"use client";

import { useEffect, useMemo, useState } from "react";

type HeroProject = {
  id: string;
  title: string;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  featured?: boolean;
  featuredRank?: number | null;
  heroPriority?: number | null;
  heroBadge?: string | null;
  heroStartDate?: string | null;
  heroEndDate?: string | null;
};

type EditorialCollection = {
  id: string;
  title: string;
  slug: string;
  placement: string;
  status: string;
  sortOrder: number;
  startsAt?: string | null;
  endsAt?: string | null;
  items: Array<{
    id: string;
  }>;
};

function formatDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function isUpcoming(value?: string | null) {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
}

function isExpiringSoon(value?: string | null) {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = Date.now();
  const difference = date.getTime() - now;
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;

  return difference > 0 && difference <= thirtyDays;
}

export default function ProgrammingOverview() {
  const [projects, setProjects] = useState<HeroProject[]>([]);
  const [collections, setCollections] = useState<EditorialCollection[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProgrammingData() {
    try {
      setLoading(true);

      const [contentResponse, collectionsResponse] = await Promise.all([
        fetch("/api/admin/content", {
          cache: "no-store",
        }),
        fetch("/api/admin/collections", {
          cache: "no-store",
        }),
      ]);

      const contentData = await contentResponse.json();
      const collectionsData = await collectionsResponse.json();

      if (!contentResponse.ok) {
        throw new Error(
          contentData?.error ||
            contentData?.message ||
            "Failed to load hero programming."
        );
      }

      if (!collectionsResponse.ok) {
        throw new Error(
          collectionsData?.error ||
            "Failed to load editorial collections."
        );
      }

      setProjects(Array.isArray(contentData) ? contentData : []);
      setCollections(
        Array.isArray(collectionsData) ? collectionsData : []
      );
    } catch (error) {
      console.error("PROGRAMMING OVERVIEW LOAD ERROR:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not load programming overview."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProgrammingData();
  }, []);

  const activeHero = useMemo(() => {
    return projects
      .filter((project) => project.featured)
      .sort((a, b) => {
        const aPriority =
          a.heroPriority ?? a.featuredRank ?? 999;

        const bPriority =
          b.heroPriority ?? b.featuredRank ?? 999;

        return aPriority - bPriority;
      });
  }, [projects]);

  const activeCollections = useMemo(() => {
    return collections
      .filter(
        (collection) =>
          collection.status === "active" &&
          collection.placement === "browse"
      )
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [collections]);

  const upcomingCollections = useMemo(() => {
    return collections
      .filter((collection) => isUpcoming(collection.startsAt))
      .sort((a, b) => {
        const aDate = new Date(a.startsAt || 0).getTime();
        const bDate = new Date(b.startsAt || 0).getTime();

        return aDate - bDate;
      });
  }, [collections]);

  const expiringCollections = useMemo(() => {
    return collections
      .filter((collection) => isExpiringSoon(collection.endsAt))
      .sort((a, b) => {
        const aDate = new Date(a.endsAt || 0).getTime();
        const bDate = new Date(b.endsAt || 0).getTime();

        return aDate - bDate;
      });
  }, [collections]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-white/45">
        Loading homepage programming...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Hero Titles"
          value={activeHero.length}
          description="Currently in rotation"
        />

        <MetricCard
          label="Active Rows"
          value={activeCollections.length}
          description="Live on Browse"
        />

        <MetricCard
          label="Upcoming"
          value={upcomingCollections.length}
          description="Scheduled to launch"
        />

        <MetricCard
          label="Expiring Soon"
          value={expiringCollections.length}
          description="Ending within 30 days"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              Homepage Hero
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Active Hero Lineup
            </h2>
          </div>

          <span className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-white/40">
            {activeHero.length} title
            {activeHero.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {activeHero.length === 0 ? (
            <EmptyMessage text="No titles are currently programmed in the hero." />
          ) : (
            activeHero.map((project, index) => {
              const imageUrl =
                project.backdropUrl ||
                project.thumbnailUrl ||
                "";

              return (
                <div
                  key={project.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm font-semibold text-sky-300">
                    {index + 1}
                  </div>

                  <div className="h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {project.title}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {project.heroBadge || "No hero badge"}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-xs text-white/30">
                      Priority
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white/70">
                      {project.heroPriority ??
                        project.featuredRank ??
                        index + 1}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ProgrammingPanel
          eyebrow="Live Programming"
          title="Active Browse Rows"
        >
          {activeCollections.length === 0 ? (
            <EmptyMessage text="No active Browse collections." />
          ) : (
            activeCollections.map((collection, index) => (
              <CollectionRow
                key={collection.id}
                collection={collection}
                position={index + 1}
              />
            ))
          )}
        </ProgrammingPanel>

        <ProgrammingPanel
          eyebrow="Scheduled"
          title="Upcoming Collections"
        >
          {upcomingCollections.length === 0 ? (
            <EmptyMessage text="No upcoming collections are scheduled." />
          ) : (
            upcomingCollections.map((collection) => (
              <CollectionRow
                key={collection.id}
                collection={collection}
                dateLabel={`Starts ${
                  formatDate(collection.startsAt) || "soon"
                }`}
              />
            ))
          )}
        </ProgrammingPanel>
      </section>

      <ProgrammingPanel
        eyebrow="Attention Needed"
        title="Expiring Within 30 Days"
      >
        {expiringCollections.length === 0 ? (
          <EmptyMessage text="No collections are expiring soon." />
        ) : (
          expiringCollections.map((collection) => (
            <CollectionRow
              key={collection.id}
              collection={collection}
              dateLabel={`Ends ${
                formatDate(collection.endsAt) || "soon"
              }`}
              warning
            />
          ))
        )}
      </ProgrammingPanel>
    </div>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-white/35">
        {description}
      </p>
    </div>
  );
}

function ProgrammingPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
      <div className="border-b border-white/[0.08] pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">
          {title}
        </h2>
      </div>

      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

function CollectionRow({
  collection,
  position,
  dateLabel,
  warning = false,
}: {
  collection: EditorialCollection;
  position?: number;
  dateLabel?: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      {position !== undefined && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-sm font-semibold text-sky-300">
          {position}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {collection.title}
        </p>

        <p className="mt-1 text-xs text-white/35">
          {collection.items.length} title
          {collection.items.length === 1 ? "" : "s"} ·{" "}
          <span className="capitalize">
            {collection.placement}
          </span>
        </p>
      </div>

      <div className="text-right">
        {dateLabel ? (
          <p
            className={`text-xs font-semibold ${
              warning ? "text-amber-300" : "text-white/45"
            }`}
          >
            {dateLabel}
          </p>
        ) : (
          <p className="text-xs text-white/30">
            Order {collection.sortOrder}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyMessage({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
      {text}
    </div>
  );
}