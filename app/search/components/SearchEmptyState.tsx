"use client";

import { EmptySearchIcon } from "./SearchIcons";

export default function SearchEmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] px-6 py-14 text-center">
      <div className="max-w-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/45">
          <EmptySearchIcon />
        </div>

        <h3 className="mt-6 text-xl font-black text-white md:text-2xl">
          No titles found
        </h3>

        <p className="mt-3 text-sm leading-7 text-white/45">
          We couldn’t find anything matching “{query}.” Try a title,
          creator, genre, film, or series.
        </p>

        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-md bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-sky-200"
        >
          Explore all titles
        </button>
      </div>
    </div>
  );
}