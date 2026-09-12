"use client";

import type { Dispatch, SetStateAction } from "react";

import { filters } from "../constants";

type ContentFiltersProps = {
  search: string;
  activeFilter: string;
  activeType: string;
  showFilters: boolean;

  contentTypes: string[];
  counts: Record<string, number>;

  setSearch: Dispatch<SetStateAction<string>>;
  setActiveFilter: Dispatch<SetStateAction<string>>;
  setActiveType: Dispatch<SetStateAction<string>>;
  setShowFilters: Dispatch<SetStateAction<boolean>>;
};

export default function ContentFilters({
  search,
  activeFilter,
  activeType,
  showFilters,

  contentTypes,
  counts,

  setSearch,
  setActiveFilter,
  setActiveType,
  setShowFilters,
}: ContentFiltersProps) {
  return (
    <section className="rounded-[26px] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-md">
          <SearchIcon />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search titles, creators, genres..."
            className="min-h-11 w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/22 hover:border-white/16 focus:border-sky-300/50 focus:bg-black/30"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setShowFilters((current) => !current)
          }
          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
        >
          {showFilters
            ? "Hide Filters"
            : "More Filters"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active =
            activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                setActiveFilter(filter.value)
              }
              className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                active
                  ? "border-sky-300/35 bg-sky-300/[0.1] text-sky-200"
                  : "border-white/[0.08] bg-black/15 text-white/42 hover:border-white/15 hover:text-white/70"
              }`}
            >
              {filter.label}

              <span className="ml-2 rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px]">
                {counts[filter.value] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {showFilters && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-white/25">
            Content Type
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {contentTypes.map((type) => {
              const active =
                activeType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setActiveType(type)
                  }
                  className={`rounded-xl border px-3 py-2 text-xs font-bold capitalize transition ${
                    active
                      ? "border-sky-300/35 bg-sky-300/[0.1] text-sky-200"
                      : "border-white/[0.08] bg-black/15 text-white/42 hover:border-white/15 hover:text-white/70"
                  }`}
                >
                  {type === "all"
                    ? "All Types"
                    : type}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}