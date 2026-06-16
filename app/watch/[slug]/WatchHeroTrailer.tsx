"use client";

import TrailerPreviewVideo from "@/app/components/TrailerPreviewVideo";
import { useEffect, useState } from "react";

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.4]"
    >
      <path
        d="M4.5 9.5v5h3.2L12 18V6L7.7 9.5H4.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {muted ? (
        <>
          <path d="M16 9l4 4" strokeLinecap="round" />
          <path d="M20 9l-4 4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path
            d="M16 9.2c.9.8 1.4 1.8 1.4 2.8s-.5 2-1.4 2.8"
            strokeLinecap="round"
          />
          <path
            d="M18.7 7c1.4 1.3 2.3 3 2.3 5s-.9 3.7-2.3 5"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export default function WatchHeroTrailer({ url }: { url: string }) {
const [muted, setMuted] = useState(true);
const [mounted, setMounted] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem("sourcetv_trailer_muted");

  if (saved !== null) {
    setMuted(saved === "true");
  }

  setMounted(true);
}, []);

useEffect(() => {
  if (!mounted) return;

  localStorage.setItem("sourcetv_trailer_muted", String(muted));
}, [muted, mounted]);
  return (
    <>
      <TrailerPreviewVideo
        url={url}
        muted={muted}
        loop
        autoPlay
        fadeIn
        className="absolute inset-0 h-full w-full object-cover"
      />

      <button
        type="button"
        onClick={() => setMuted((value) => !value)}
        className="absolute right-4 top-24 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/75 shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition duration-300 hover:scale-105 hover:border-sky-300/50 hover:text-sky-200 md:right-10 md:top-32 md:h-11 md:w-11"
        aria-label={muted ? "Unmute trailer" : "Mute trailer"}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.08] to-transparent" />
        <span className="relative">
          <VolumeIcon muted={muted} />
        </span>
      </button>
    </>
  );
}