"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
        <Link href="/browse" className="text-sm font-bold text-sky-300">
          ← Back to Browse
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            SourceTV
          </p>

          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-7xl">
            My Watchlist
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 md:text-base">
            Titles saved to your account.
          </p>
        </section>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-white/50 md:mt-12 md:p-10">
            Loading your watchlist...
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-white/65 md:mt-12 md:p-10">
            <h2 className="text-2xl font-black">Your watchlist is empty.</h2>

            <p className="mt-3 text-white/55">
              Add titles from any watch page and they’ll appear here.
            </p>

            <Link
              href="/browse"
              className="mt-6 inline-block rounded-full bg-sky-400 px-7 py-3 font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.35)]"
            >
              Browse Titles
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:mt-12 md:grid-cols-5 md:gap-5">
            {items.map((item) => (
              <div key={item.id} className="group">
                <Link href={`/watch/${item.id}`}>
                  <div
                    className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-4 transition duration-300 group-hover:-translate-y-2 group-hover:border-sky-300/60 group-hover:shadow-[0_0_35px_rgba(14,165,233,0.3)]"
                    style={{
                      backgroundImage: item.thumbnailUrl
                        ? `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.18)), url(${item.thumbnailUrl})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="relative z-10 flex h-full flex-col justify-end">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300 md:text-xs">
                        {item.type || "Saved"}
                      </p>

                      <h3 className="line-clamp-2 text-base font-black leading-tight md:text-lg">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="mt-3 w-full rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-bold text-white/55 transition hover:border-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}