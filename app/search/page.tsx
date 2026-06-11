"use client";

import ContentCard from "@/app/components/ContentCard";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  views?: number | null;
  status?: string | null;
  scheduledAt?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
};

const quickFilters = [
  "Drama",
  "Comedy",
  "Action",
  "Animation",
  "Documentary",
  "Film",
  "Series",
];

export default function SearchPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
  }, []);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/content", { cache: "no-store" });
        const data = await res.json();

        if (Array.isArray(data)) {
          setItems(data);
        }
      } catch (error) {
        console.error("Search load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  const trending = useMemo(() => {
    return [...items].sort((a, b) => (b.views || 0) - (a.views || 0));
  }, [items]);

  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();

    if (!clean) return trending;

    return items.filter((item) => {
      return (
        item.title?.toLowerCase().includes(clean) ||
        item.description?.toLowerCase().includes(clean) ||
        item.type?.toLowerCase().includes(clean) ||
        item.genre?.toLowerCase().includes(clean) ||
        item.creatorName?.toLowerCase().includes(clean)
      );
    });
  }, [items, query, trending]);

  const featured = results[0] || trending[0];

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);

    const clean = nextQuery.trim();

    if (clean) {
      window.history.replaceState(
        null,
        "",
        `/search?q=${encodeURIComponent(clean)}`
      );
    } else {
      window.history.replaceState(null, "", "/search");
    }
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    updateQuery(query);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-28 text-white md:pb-24">
      <section
        className="relative overflow-hidden px-4 pb-10 pt-24 md:px-10 md:pb-16 md:pt-32"
        style={{
          backgroundImage:
            featured?.backdropUrl || featured?.thumbnailUrl
              ? `linear-gradient(to right, rgba(0,0,0,0.96), rgba(0,0,0,0.72), rgba(0,0,0,0.32)), url(${
                  featured.backdropUrl || featured.thumbnailUrl
                })`
              : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.32), transparent 34%), linear-gradient(to right, black, #020617)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <Link href="/browse" className="text-sm font-bold text-sky-300">
            ← Back to Browse
          </Link>

          <section className="mt-8 max-w-4xl rounded-[2rem] border border-white/10 bg-black/42 p-5 shadow-2xl backdrop-blur-xl md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              SourceTV Search
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-7xl">
              Find your next watch.
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/62 md:text-base md:leading-7">
              Search titles, creators, genres, films, series, documentaries,
              and hidden gems across SourceTV.
            </p>

            <form
              onSubmit={submitSearch}
              className="mt-7 flex flex-col gap-3 rounded-[1.7rem] border border-white/10 bg-white/[0.07] p-2 backdrop-blur-xl md:flex-row md:rounded-full"
            >
              <input
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder="Search titles, genres, creators..."
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-white outline-none placeholder:text-white/35"
                autoFocus
              />

              <button
                type="submit"
                className="rounded-full bg-sky-400 px-8 py-3 font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.4)] transition hover:bg-sky-300"
              >
                Search
              </button>
            </form>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {quickFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => updateQuery(filter)}
                  className="shrink-0 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-black text-white/70 backdrop-blur-xl transition hover:border-sky-300 hover:text-sky-200"
                >
                  {filter}
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pt-8 md:px-10 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black md:text-4xl">
                {query.trim()
                  ? `Results for “${query.trim()}”`
                  : "Trending Searches"}
              </h2>

              <p className="mt-2 text-sm text-white/45">
                {results.length} title{results.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

         {loading ? (
  <div className="animate-pulse">
    <div className="mb-5">
      <div className="h-3 w-28 rounded-full bg-white/10" />
      <div className="mt-3 h-8 w-56 rounded-full bg-white/10" />
    </div>

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.04]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-[skeletonSlide_1.8s_linear_infinite]" />

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="h-3 w-16 rounded-full bg-white/10" />

            <div className="mt-3 h-5 w-4/5 rounded-full bg-white/10" />

            <div className="mt-2 h-5 w-2/3 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>

    <style jsx>{`
      @keyframes skeletonSlide {
        from {
          transform: translateX(-120%);
        }

        to {
          transform: translateX(120%);
        }
      }
    `}</style>
  </div>
          ) : results.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
              No results found. Try a genre, creator, or title.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pb-10 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5">
              {results.map((item) => (
                <ContentCard
                  key={item.id}
                  id={item.id}
                  title={item.title || "Untitled"}
                  description={item.description}
                  type={item.type}
                  genre={item.genre}
                  maturityRating={item.maturityRating}
                  runtime={item.runtime}
                  thumbnailUrl={item.thumbnailUrl}
                  backdropUrl={item.backdropUrl}
                  trailerUrl={item.trailerUrl}
                  views={item.views}
                  scheduledAt={item.scheduledAt}
                  status={item.status}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}