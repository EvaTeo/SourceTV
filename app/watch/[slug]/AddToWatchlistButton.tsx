"use client";

import { useEffect, useState } from "react";

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-[2.3] md:h-6 md:w-6">
      <path d="M12 5v14" strokeLinecap="round" />
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 stroke-[2.45] md:h-6 md:w-6">
      <path d="M5 12.5 9.2 17 19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const [justChanged, setJustChanged] = useState(false);

  useEffect(() => {
    async function checkWatchlist() {
      try {
        const res = await fetch("/api/watchlist", { cache: "no-store" });

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

    checkWatchlist();
  }, [slug]);

  async function toggleWatchlist() {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/watchlist", {
        method: saved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: slug,
          recommendationWeight: saved ? 0 : 5,
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
      setJustChanged(true);

      setTimeout(() => {
        setJustChanged(false);
      }, 650);
    } catch (error) {
      console.error("WATCHLIST TOGGLE ERROR:", error);
      alert("Could not update watchlist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleWatchlist}
      disabled={loading}
      aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
      title={saved ? "In Watchlist" : "Add to Watchlist"}
      className={`group relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border backdrop-blur-xl transition-all duration-300 md:h-14 md:w-14 ${
        saved
          ? "border-sky-300/45 bg-sky-300/12 text-sky-100 shadow-[0_0_28px_rgba(56,189,248,0.18)]"
          : "border-white/15 bg-black/35 text-white/82 hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100"
      } ${justChanged ? "scale-110" : "hover:scale-105"} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <span
        className={`pointer-events-none absolute inset-0 rounded-full bg-sky-300/0 transition duration-300 ${
          justChanged ? "bg-sky-300/18" : "group-hover:bg-white/[0.04]"
        }`}
      />

      <span
        className={`relative transition-all duration-300 ${
          justChanged ? "scale-110" : "group-hover:scale-110"
        }`}
      >
        {saved ? <CheckIcon /> : <PlusIcon />}
      </span>
    </button>
  );
}