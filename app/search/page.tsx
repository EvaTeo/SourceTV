"use client";

import ContentCard from "@/app/components/ContentCard";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SearchEmptyState from "./components/SearchEmptyState";
import SearchHero from "./components/SearchHero";
import SearchSkeleton from "./components/SearchSkeleton";

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
  }, []);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);

      try {
        const res = await fetch("/api/content?mode=all&limit=100", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(
            `Search content request failed: ${res.status}`
          );
        }

        const data: unknown = await res.json();

        setItems(Array.isArray(data) ? (data as ContentItem[]) : []);
      } catch (error) {
        console.error("Search load error:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  const trending = useMemo(() => {
    return [...items].sort(
      (a, b) => (b.views || 0) - (a.views || 0)
    );
  }, [items]);

  const results = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) {
      return trending;
    }

    return items.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.type,
        item.genre,
        item.creatorName,
        item.maturityRating,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(cleanQuery);
    });
  }, [items, query, trending]);

  const featured = results[0] || trending[0];

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);

    const cleanQuery = nextQuery.trim();

    window.history.replaceState(
      null,
      "",
      cleanQuery
        ? `/search?q=${encodeURIComponent(cleanQuery)}`
        : "/search"
    );
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateQuery(query);
    inputRef.current?.focus();
  }

  function clearSearch() {
    updateQuery("");
    inputRef.current?.focus();
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-28 text-white md:pb-24">
      <SearchHero
        query={query}
        featured={featured}
        inputRef={inputRef}
        quickFilters={quickFilters}
        onQueryChange={updateQuery}
        onSubmit={submitSearch}
        onClear={clearSearch}
      />

      <section className="relative px-4 pt-8 md:px-12 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.025em] md:text-4xl">
                {query.trim()
                  ? `Results for “${query.trim()}”`
                  : "Explore SourceTV"}
              </h2>

              {!loading && (
                <p className="mt-2 text-sm text-white/40">
                  {results.length} title
                  {results.length === 1 ? "" : "s"}
                </p>
              )}
            </div>

            {query.trim() && !loading && results.length > 0 && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-xs font-black uppercase tracking-[0.12em] text-white/40 transition hover:text-sky-200"
              >
                Clear search
              </button>
            )}
          </div>

          {loading ? (
            <SearchSkeleton />
          ) : results.length === 0 ? (
            <SearchEmptyState
              query={query.trim()}
              onClear={clearSearch}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
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