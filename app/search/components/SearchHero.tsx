"use client";

import Link from "next/link";
import { type FormEvent, type RefObject } from "react";
import { CloseIcon, SearchIcon } from "./SearchIcons";

type FeaturedItem = {
  backdropUrl?: string | null;
  thumbnailUrl?: string | null;
};

type SearchHeroProps = {
  query: string;
  featured?: FeaturedItem;
  inputRef: RefObject<HTMLInputElement | null>;
  quickFilters: string[];
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
};

export default function SearchHero({
  query,
  featured,
  inputRef,
  quickFilters,
  onQueryChange,
  onSubmit,
  onClear,
}: SearchHeroProps) {
  return (
    <section
      className="relative min-h-[58vh] overflow-hidden px-4 pb-12 pt-24 md:min-h-[62vh] md:px-12 md:pb-16 md:pt-32"
      style={{
        backgroundImage:
          featured?.backdropUrl || featured?.thumbnailUrl
            ? `url(${featured.backdropUrl || featured.thumbnailUrl})`
            : "radial-gradient(circle at 72% 18%, rgba(14,165,233,0.2), transparent 34%), linear-gradient(to right, black, #020617)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/20" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[34vh] bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_45%,rgba(56,189,248,0.1),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/55 transition hover:text-sky-200"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Browse</span>
        </Link>

        <div className="mt-9 max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.36em] text-sky-300 md:text-xs">
            SourceTV Search
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.04em] md:text-7xl">
            Find something worth watching.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base md:leading-8">
            Search films, series, animation, documentaries, creators,
            and genres across SourceTV.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-8 flex max-w-3xl items-center rounded-[1rem] border border-white/12 bg-black/48 p-2 shadow-[0_22px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition focus-within:border-sky-300/40 focus-within:bg-black/58 focus-within:shadow-[0_22px_80px_rgba(14,165,233,0.12)] md:rounded-full"
          >
            <div className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center text-white/40">
              <SearchIcon />
            </div>

            <input
              ref={inputRef}
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search titles, genres, creators..."
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/30 md:px-3 md:text-base"
              autoFocus
              aria-label="Search SourceTV"
            />

            {query && (
              <button
                type="button"
                onClick={onClear}
                className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/40 transition hover:bg-white/[0.08] hover:text-white"
                aria-label="Clear search"
              >
                <CloseIcon />
              </button>
            )}

            <button
              type="submit"
              className="hidden rounded-full bg-white px-7 py-3 text-sm font-black text-black shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition hover:scale-[1.02] hover:bg-sky-200 md:inline-flex"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex max-w-3xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickFilters.map((filter) => {
              const active =
                query.trim().toLowerCase() === filter.toLowerCase();

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => onQueryChange(filter)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${
                    active
                      ? "border-sky-300/55 bg-sky-300/14 text-sky-100 shadow-[0_0_18px_rgba(56,189,248,0.16)]"
                      : "border-white/10 bg-black/34 text-white/58 hover:border-sky-300/35 hover:bg-sky-300/[0.08] hover:text-sky-100"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}