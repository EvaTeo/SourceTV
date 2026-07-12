"use client";

import HoverPreviewCard from "@/app/components/HoverPreviewCard";
import {
  CONTENT_CARD_SIZE,
  CONTENT_CATALOG_GAP,
  CONTENT_EDGE_PADDING,
} from "@/app/components/contentLayout";
import {
  useMemo,
  useState,
} from "react";
import type { CategoryContentItem } from "./CategoryHero";

export type CategoryCatalogItem =
  CategoryContentItem & {
    status: string;
    scheduledAt: string | null;
    trailerUrl: string;
    views: number;
    createdAt: string | null;
    editorPick: boolean;
  };

type SortMode =
  | "popular"
  | "newest"
  | "alphabetical";

type TypeFilter =
  | "all"
  | "films"
  | "shows";

export default function CategoryCatalogGrid({
  title,
  items,
}: {
  title: string;
  items: CategoryCatalogItem[];
}) {
  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("all");

  const [sortMode, setSortMode] =
    useState<SortMode>("popular");

  const hasFilms = items.some((item) => {
    const type = item.type.toLowerCase();

    return (
      type === "film" ||
      type === "movie"
    );
  });

  const hasShows = items.some((item) => {
    const type = item.type.toLowerCase();

    return (
      type === "series" ||
      type === "show" ||
      type === "tv"
    );
  });

  const filteredItems = useMemo(() => {
    const filtered = items.filter(
      (item) => {
        const type =
          item.type.toLowerCase();

        if (typeFilter === "films") {
          return (
            type === "film" ||
            type === "movie"
          );
        }

        if (typeFilter === "shows") {
          return (
            type === "series" ||
            type === "show" ||
            type === "tv"
          );
        }

        return true;
      }
    );

    return [...filtered].sort(
      (first, second) => {
        if (
          sortMode === "alphabetical"
        ) {
          return first.title.localeCompare(
            second.title
          );
        }

        if (sortMode === "newest") {
          const firstTime =
            first.createdAt
              ? new Date(
                  first.createdAt
                ).getTime()
              : 0;

          const secondTime =
            second.createdAt
              ? new Date(
                  second.createdAt
                ).getTime()
              : 0;

          return secondTime - firstTime;
        }

        return second.views - first.views;
      }
    );
  }, [items, sortMode, typeFilter]);

  return (
    <section className="relative overflow-visible bg-black pb-28 pt-10 text-white md:pb-24 md:pt-14">
      <div className="w-full overflow-visible">
        <div
          className={`flex flex-col gap-5 border-b border-white/[0.07] pb-6 md:flex-row md:items-end md:justify-between ${CONTENT_EDGE_PADDING}`}
        >
          <div>
            <h2 className="text-2xl font-black tracking-[-0.03em] md:text-4xl">
              Browse {title}
            </h2>

            <p className="mt-2 text-sm text-white/36">
              {filteredItems.length} title
              {filteredItems.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {hasFilms && hasShows && (
              <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <FilterButton
                  active={
                    typeFilter === "all"
                  }
                  label="All"
                  onClick={() =>
                    setTypeFilter("all")
                  }
                />

                <FilterButton
                  active={
                    typeFilter === "films"
                  }
                  label="Films"
                  onClick={() =>
                    setTypeFilter("films")
                  }
                />

                <FilterButton
                  active={
                    typeFilter === "shows"
                  }
                  label="Shows"
                  onClick={() =>
                    setTypeFilter("shows")
                  }
                />
              </div>
            )}

            <select
              value={sortMode}
              onChange={(event) =>
                setSortMode(
                  event.target
                    .value as SortMode
                )
              }
              className="rounded-full border border-white/10 bg-black/75 px-4 py-2.5 text-xs font-black text-white/68 outline-none backdrop-blur-xl transition focus:border-sky-300/45"
              aria-label="Sort catalog"
            >
              <option value="popular">
                Most Popular
              </option>

              <option value="newest">
                Newest
              </option>

              <option value="alphabetical">
                A–Z
              </option>
            </select>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div
            className={`flex w-full flex-wrap items-start overflow-visible pb-10 pt-8 ${CONTENT_EDGE_PADDING} ${CONTENT_CATALOG_GAP}`}
          >
            {filteredItems.map(
              (item, index) => (
                <div
                  key={`${title}-${item.id}`}
                  className={`relative shrink-0 transition duration-300 hover:z-30 ${CONTENT_CARD_SIZE}`}
                >
                  <HoverPreviewCard
                    item={{
                      id: item.id,
                      title: item.title,
                      description:
                        item.description || "",
                      type: item.type || "",
                      genre: item.genre || "",
                      videoUrl:
                        item.videoUrl || "",
                      mainVideoUrl:
                        item.mainVideoUrl || "",
                      trailerUrl:
                        item.trailerUrl || "",
                      thumbnailUrl:
                        item.thumbnailUrl || "",
                      backdropUrl:
                        item.backdropUrl || "",
                      status:
                        item.status || "",
                      views:
                        item.views ?? undefined,
                      maturityRating:
                        item.maturityRating || "",
                      runtime:
                        item.runtime || "",
                      creatorName:
                        item.creatorName || "",
                      scheduledAt:
                        item.scheduledAt || null,
                    }}
                    index={index}
                  />
                </div>
              )
            )}
          </div>
        ) : (
          <div
            className={`mt-8 ${CONTENT_EDGE_PADDING}`}
          >
            <div className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] px-6 py-14 text-center">
              <h3 className="text-xl font-black">
                No matching titles
              </h3>

              <p className="mt-3 text-sm text-white/42">
                Try another catalog filter.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-black transition ${
        active
          ? "border-sky-300/45 bg-sky-300/[0.12] text-sky-100 shadow-[0_0_18px_rgba(56,189,248,0.14)]"
          : "border-white/10 bg-white/[0.035] text-white/48 hover:border-white/20 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}