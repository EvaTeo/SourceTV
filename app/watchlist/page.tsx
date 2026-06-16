"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type WatchlistItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  maturityRating?: string | null;
  runtime?: string | null;
};

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const featured = useMemo(() => items[0], [items]);
  const remainingItems = useMemo(() => items.slice(1), [items]);

  async function loadWatchlist() {
    try {
      setLoading(true);

      const res = await fetch("/api/watchlist", {
        cache: "no-store",
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("WATCHLIST LOAD ERROR:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function removeFromWatchlist(projectId: string) {
    try {
      await fetch("/api/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      setItems((current) => current.filter((item) => item.id !== projectId));
    } catch (error) {
      console.error("WATCHLIST REMOVE ERROR:", error);
      alert("Could not remove this title.");
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black px-4 pb-32 pt-24 text-white md:px-12 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Library
              </p>

              <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-7xl">
                My List
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
                Your saved SourceTV titles. Keep track of what you want to watch
                next and jump back in anytime.
              </p>
            </div>

            <Link
              href="/browse"
              className="w-fit rounded-full bg-sky-400 px-6 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:scale-105 hover:bg-sky-300"
            >
              Browse Titles
            </Link>
          </div>
        </section>

        {loading ? (
          <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[2/3] animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]"
              />
            ))}
          </section>
        ) : items.length === 0 ? (
          <section className="mt-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl md:mt-12 md:p-12">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
                Empty List
              </p>

              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Your list is waiting.
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/55 md:text-base">
                Add titles from any watch page and they’ll appear here as your
                personal SourceTV library.
              </p>

              <Link
                href="/browse"
                className="mt-7 inline-flex rounded-full bg-sky-400 px-7 py-3 font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:scale-105 hover:bg-sky-300"
              >
                Start Browsing
              </Link>
            </div>
          </section>
        ) : (
          <>
            {featured && (
              <section className="mt-8 overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] shadow-2xl">
                <div
                  className="relative min-h-[420px] bg-zinc-950 bg-cover bg-center p-6 md:min-h-[520px] md:p-10"
                  style={{
                    backgroundImage:
                      featured.backdropUrl || featured.thumbnailUrl
                        ? `url(${featured.backdropUrl || featured.thumbnailUrl})`
                        : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.22), transparent 34%), linear-gradient(to right, black, #020617)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

                  <div className="relative z-10 flex min-h-[360px] max-w-2xl flex-col justify-end md:min-h-[440px]">
                    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
                      Saved Spotlight
                    </p>

                    <h2 className="text-4xl font-black leading-[0.95] md:text-6xl">
                      {featured.title}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-xs font-bold text-white/55 md:text-sm">
                      {featured.type && <span>{featured.type}</span>}
                      {featured.genre && <span>• {featured.genre}</span>}
                      {featured.maturityRating && (
                        <span>• {featured.maturityRating}</span>
                      )}
                      {featured.runtime && <span>• {featured.runtime}</span>}
                    </div>

                    {featured.description && (
                      <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-7 text-white/68 md:text-base">
                        {featured.description}
                      </p>
                    )}

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href={`/watch/${featured.id}`}
                        className="rounded-full bg-sky-400 px-7 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:scale-105 hover:bg-sky-300"
                      >
                        Watch Now
                      </Link>

                      <button
                        onClick={() => removeFromWatchlist(featured.id)}
                        className="rounded-full border border-white/15 bg-black/35 px-7 py-3 text-sm font-black text-white/75 backdrop-blur-xl transition hover:border-red-400/60 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {remainingItems.length > 0 && (
              <section className="mt-10">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
                      Saved Library
                    </p>

                    <h2 className="text-2xl font-black md:text-3xl">
                      All Saved Titles
                    </h2>
                  </div>

                  <p className="hidden text-sm font-bold text-white/38 md:block">
                    {items.length} saved
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-5">
                  {remainingItems.map((item) => (
                    <WatchlistCard
                      key={item.id}
                      item={item}
                      onRemove={() => removeFromWatchlist(item.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function WatchlistCard({
  item,
  onRemove,
}: {
  item: WatchlistItem;
  onRemove: () => void;
}) {
  return (
    <div className="group">
      <Link href={`/watch/${item.id}`}>
        <div
          className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-xl transition duration-300 group-hover:-translate-y-2 group-hover:border-sky-300/60 group-hover:shadow-[0_0_35px_rgba(14,165,233,0.3)] md:rounded-3xl"
          style={{
            backgroundImage: item.thumbnailUrl
              ? `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.18)), url(${item.thumbnailUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-400 text-xl font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.65)]">
              ▶
            </div>
          </div>

          <div className="relative z-10 flex h-full flex-col justify-end">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300 md:text-xs">
              {item.type || "Saved"}
            </p>

            <h3 className="line-clamp-2 text-base font-black leading-tight md:text-lg">
              {item.title}
            </h3>

            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-semibold text-white/50">
              {item.genre && <span>{item.genre}</span>}
              {item.maturityRating && <span>• {item.maturityRating}</span>}
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={onRemove}
        className="mt-3 w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-white/55 transition hover:border-red-400/60 hover:text-red-300"
      >
        Remove
      </button>
    </div>
  );
}