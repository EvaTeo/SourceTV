"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ActiveProfile = {
  id: string;
  name: string;
  avatar?: string;
};

type ContinueWatchingItem = {
  slug: string;
  title: string;
  progress: number;
  type: string;
  genre: string;
  artwork: string;
  updatedAt?: string | null;
};

type ApiContinueWatchingEntry = {
  projectId?: string | null;
  progress?: number | string | null;
  position?: number | string | null;
  updatedAt?: string | null;
  type?: string | null;
  genre?: string | null;
  project?: {
    id?: string | null;
    title?: string | null;
    type?: string | null;
    genre?: string | null;
    cardArtUrl?: string | null;
    backdropUrl?: string | null;
    thumbnailUrl?: string | null;
  } | null;
};

type SavedContinueWatchingEntry = {
  slug?: string | null;
  id?: string | null;
  projectId?: string | null;
  title?: string | null;
  progress?: number | string | null;
  position?: number | string | null;
  type?: string | null;
  genre?: string | null;
  cardArtUrl?: string | null;
  backdropUrl?: string | null;
  thumbnailUrl?: string | null;
  artwork?: string | null;
  updatedAt?: string | null;
};

const fallbackProfile: ActiveProfile = {
  id: "main",
  name: "Adan",
  avatar: "A",
};

const COMPLETED_THRESHOLD = 98;

function getActiveProfile(): ActiveProfile {
  try {
    const parsed = JSON.parse(
      localStorage.getItem("sourcetv_active_profile") ||
        JSON.stringify(fallbackProfile)
    );

    return {
      id: parsed?.id || fallbackProfile.id,
      name: parsed?.name || fallbackProfile.name,
      avatar: parsed?.avatar || fallbackProfile.avatar,
    };
  } catch {
    return fallbackProfile;
  }
}

function readSavedArray(key: string): SavedContinueWatchingEntry[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cleanProgress(value: unknown) {
  const number = Number(value || 0);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(number)));
}

function normalizeApiEntry(
  entry: ApiContinueWatchingEntry
): ContinueWatchingItem | null {
  const project = entry.project || {};
  const slug = project.id || entry.projectId || "";

  if (!slug) {
    return null;
  }

  const progress = cleanProgress(entry.progress ?? entry.position);

  if (progress <= 0 || progress >= COMPLETED_THRESHOLD) {
    return null;
  }

  return {
    slug,
    title: project.title || "Untitled",
    progress,
    type: project.type || entry.type || "",
    genre: project.genre || entry.genre || "",
    artwork:
      project.cardArtUrl ||
      project.backdropUrl ||
      project.thumbnailUrl ||
      "",
    updatedAt: entry.updatedAt || null,
  };
}

function normalizeSavedEntry(
  entry: SavedContinueWatchingEntry
): ContinueWatchingItem | null {
  const slug = entry.slug || entry.id || entry.projectId || "";

  if (!slug) {
    return null;
  }

  const progress = cleanProgress(entry.progress ?? entry.position);

  if (progress <= 0 || progress >= COMPLETED_THRESHOLD) {
    return null;
  }

  return {
    slug,
    title: entry.title || "Untitled",
    progress,
    type: entry.type || "",
    genre: entry.genre || "",
    artwork:
      entry.artwork ||
      entry.cardArtUrl ||
      entry.backdropUrl ||
      entry.thumbnailUrl ||
      "",
    updatedAt: entry.updatedAt || null,
  };
}

function prepareItems(items: Array<ContinueWatchingItem | null>) {
  const uniqueItems = new Map<string, ContinueWatchingItem>();

  for (const item of items) {
    if (!item) {
      continue;
    }

    const existing = uniqueItems.get(item.slug);

    if (!existing) {
      uniqueItems.set(item.slug, item);
      continue;
    }

    const existingTime = existing.updatedAt
      ? new Date(existing.updatedAt).getTime()
      : 0;

    const incomingTime = item.updatedAt
      ? new Date(item.updatedAt).getTime()
      : 0;

    if (
      incomingTime > existingTime ||
      item.progress > existing.progress
    ) {
      uniqueItems.set(item.slug, item);
    }
  }

  return Array.from(uniqueItems.values()).sort((a, b) => {
    const aTime = a.updatedAt
      ? new Date(a.updatedAt).getTime()
      : 0;

    const bTime = b.updatedAt
      ? new Date(b.updatedAt).getTime()
      : 0;

    return bTime - aTime;
  });
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M8 5.8v12.4c0 .9 1 1.4 1.7.9l9.5-6.2c.7-.4.7-1.4 0-1.8L9.7 4.9C9 4.4 8 4.9 8 5.8Z" />
    </svg>
  );
}

export default function ContinueWatching() {
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    async function loadContinueWatching() {
      const activeProfile = getActiveProfile();

      setProfileName(activeProfile.name || "Your");

      try {
        const res = await fetch("/api/continue-watching", {
          cache: "no-store",
        });

        if (res.ok) {
          const data: unknown = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            const normalizedItems = prepareItems(
              data.map((entry) =>
                normalizeApiEntry(
                  entry as ApiContinueWatchingEntry
                )
              )
            );

            if (normalizedItems.length > 0) {
              setItems(normalizedItems);
              return;
            }
          }
        }
      } catch (error) {
        console.error(
          "CONTINUE WATCHING API ERROR:",
          error
        );
      }

      const profileKey =
        `sourcetv_continue_${activeProfile.id}`;

      const oldGlobal = readSavedArray(
        "sourcetv_continue"
      );

      const profileSaved = readSavedArray(profileKey);

      if (
        profileSaved.length === 0 &&
        oldGlobal.length > 0
      ) {
        localStorage.setItem(
          profileKey,
          JSON.stringify(oldGlobal)
        );

        setItems(
          prepareItems(
            oldGlobal.map(normalizeSavedEntry)
          )
        );

        return;
      }

      setItems(
        prepareItems(
          profileSaved.map(normalizeSavedEntry)
        )
      );
    }

    loadContinueWatching();
  }, []);

  const visibleItems = useMemo(
    () => items.slice(0, 12),
    [items]
  );

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-visible py-1">
      <div className="mb-0 flex items-end justify-between gap-4 px-5 md:px-12">
        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-white md:text-[1.32rem]">
            Continue Watching
          </h2>

          <p className="mt-0.5 text-[10px] font-semibold text-white/35 md:text-[11px]">
            For {profileName}
          </p>
        </div>
      </div>

      <div className="flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible px-5 pb-7 pt-3 scroll-smooth [scrollbar-width:none] md:gap-4 md:px-12 md:pb-8 md:pt-4 [&::-webkit-scrollbar]:hidden">
        {visibleItems.map((item) => (
          <Link
            key={item.slug}
            href={`/watch/${item.slug}`}
            className="group w-[72vw] max-w-[300px] shrink-0 snap-start rounded-[0.95rem] outline-none md:w-[360px] md:max-w-none"
            aria-label={`Resume ${item.title}`}
          >
            <article className="relative overflow-hidden rounded-[0.95rem] border border-white/[0.06] bg-zinc-950 shadow-[0_10px_28px_rgba(0,0,0,0.38)] transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.015] group-hover:border-white/12 group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.78)] group-focus-visible:ring-2 group-focus-visible:ring-sky-300/70 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black">
              <div className="pointer-events-none absolute -inset-8 bg-sky-300/0 blur-3xl transition duration-500 group-hover:bg-sky-300/[0.08]" />

              <div className="relative aspect-video overflow-hidden bg-zinc-950">
                {item.artwork ? (
                  <div
                    className="absolute inset-0 scale-[1.02] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                    style={{
                      backgroundImage: `url(${item.artwork})`,
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(to_right,black,#020617)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-11 w-11 scale-90 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white opacity-0 shadow-[0_14px_36px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 md:h-12 md:w-12">
                    <PlayIcon />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="line-clamp-1 text-sm font-black leading-tight text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] md:text-base">
                    {item.title}
                  </h3>

                  {(item.type || item.genre) && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-white/50 md:text-[11px]">
                      {item.type && (
                        <span>{item.type}</span>
                      )}

                      {item.type && item.genre && (
                        <span className="text-white/25">
                          •
                        </span>
                      )}

                      {item.genre && (
                        <span>{item.genre}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative bg-black/92 px-3 pb-3 pt-3 backdrop-blur-xl md:px-4 md:pb-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.14em] text-sky-200/85 md:text-[11px]">
                    Resume
                  </span>

                  <span className="text-[10px] font-semibold text-white/30">
                    {item.progress}%
                  </span>
                </div>

                <div className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-white/12">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-600 via-sky-300 to-white shadow-[0_0_14px_rgba(56,189,248,0.55)] transition-[width] duration-500"
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}