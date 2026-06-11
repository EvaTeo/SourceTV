"use client";

import { useEffect, useState } from "react";

export default function AddToWatchlistButton({
  slug,
}: {
  title: string;
  slug: string;
  thumbnailUrl: string;
  type: string;
  genre: string;
}) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  async function checkWatchlist() {
    try {
      const res = await fetch("/api/watchlist", {
        cache: "no-store",
      });

      if (res.status === 401) {
        setSaved(false);
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setSaved(data.some((item) => item.id === slug));
      }
    } catch (error) {
      console.error("WATCHLIST CHECK ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkWatchlist();
  }, [slug]);

  async function toggleWatchlist() {
    try {
      const res = await fetch("/api/watchlist", {
        method: saved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: slug,
        }),
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        throw new Error("Watchlist update failed");
      }

      setSaved((current) => !current);
    } catch (error) {
      console.error("WATCHLIST TOGGLE ERROR:", error);
      alert("Could not update watchlist.");
    }
  }

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      title={saved ? "In Watchlist" : "Add to Watchlist"}
      className={`group inline-flex h-12 w-12 items-center justify-center rounded-full border backdrop-blur-xl transition md:h-14 md:w-14 ${
        saved
          ? "border-sky-300/50 bg-sky-300/12 text-sky-200"
          : "border-white/15 bg-black/35 text-white/80 hover:border-sky-300/50 hover:bg-white/[0.08] hover:text-sky-200"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {saved ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="h-5 w-5 stroke-[2.4] transition group-hover:scale-110 md:h-6 md:w-6"
        >
          <path
            d="M5 12.5 9.2 17 19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="h-5 w-5 stroke-[2.4] transition group-hover:scale-110 md:h-6 md:w-6"
        >
          <path d="M12 5v14" strokeLinecap="round" />
          <path d="M5 12h14" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}