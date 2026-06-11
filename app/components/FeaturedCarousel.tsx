"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  views?: number | null;
  runtime?: string | null;
  maturityRating?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  mainVideoUrl?: string | null;
  videoUrl?: string | null;
};

function getHlsUrl(url?: string | null) {
  if (!url) return "";

  const match = url.match(/embed\/(\d+)\/([a-zA-Z0-9-]+)/);
  if (!match) return "";

  const libraryId = match[1];
  const videoGuid = match[2];

  return `https://vz-${libraryId}.b-cdn.net/${videoGuid}/playlist.m3u8`;
}

function HeroTrailer({
  url,
  active,
  muted,
}: {
  url?: string | null;
  active: boolean;
  muted: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsUrl = getHlsUrl(url);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !hlsUrl || !active) return;

    video.muted = muted;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.play().catch(() => {});
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 10,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      return () => hls.destroy();
    }
  }, [hlsUrl, active, muted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  if (!hlsUrl) return null;

  return (
    <video
      ref={videoRef}
      muted={muted}
      autoPlay
      playsInline
      loop
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

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
          <path d="M16 9.2c.9.8 1.4 1.8 1.4 2.8s-.5 2-1.4 2.8" strokeLinecap="round" />
          <path d="M18.7 7c1.4 1.3 2.3 3 2.3 5s-.9 3.7-2.3 5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export default function FeaturedCarousel({
  items,
}: {
  items: ContentItem[];
}) {
  const featuredItems = useMemo(() => items.slice(0, 6), [items]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (featuredItems.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredItems.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [featuredItems.length]);

  const featured = featuredItems[activeIndex];

  if (!featured) return null;

  return (
    <section className="relative min-h-[56vh] overflow-hidden md:min-h-[92vh]">
      {featuredItems.map((item, index) => {
        const active = index === activeIndex;
        const previewSource =
          item.trailerUrl || item.mainVideoUrl || item.videoUrl;

        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-all duration-[1800ms] ease-out ${
              active
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-[1.05] opacity-0"
            }`}
          >
            {(item.backdropUrl || item.thumbnailUrl) && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${
                    item.backdropUrl || item.thumbnailUrl
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}

            <HeroTrailer url={previewSource} active={active} muted={muted} />

            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
          </div>
        );
      })}

      <button
        onClick={() => setMuted((value) => !value)}
        className="absolute right-4 top-24 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white/75 shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition duration-300 hover:scale-105 hover:border-sky-300/50 hover:text-sky-200 md:right-10 md:top-32 md:h-11 md:w-11"
        aria-label={muted ? "Unmute trailer" : "Mute trailer"}
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.08] to-transparent" />
        <span className="relative">
          <VolumeIcon muted={muted} />
        </span>
      </button>

      <div className="relative z-10 flex min-h-[56vh] items-end px-4 pb-8 pt-24 md:min-h-[92vh] md:px-12 md:pb-20">
        <div className="w-full max-w-3xl">
          <div
            key={featured.id}
            className="animate-[heroContentFade_900ms_ease]"
          >
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.32em] text-sky-300 md:mb-4 md:text-sm">
              Featured on SourceTV
            </p>

            <h1 className="max-w-[90%] text-3xl font-black leading-[0.95] md:text-8xl">
              {featured.title}
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70 md:mt-6 md:text-lg md:leading-8">
              {featured.description ||
                "A curated SourceTV title ready to watch."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-white/55 md:mt-5 md:gap-3 md:text-sm">
              {featured.type && <span>{featured.type}</span>}
              {featured.genre && <span>• {featured.genre}</span>}
              {featured.maturityRating && (
                <span>• {featured.maturityRating}</span>
              )}
              {featured.runtime && <span>• {featured.runtime}</span>}
              <span>• {featured.views || 0} views</span>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href={`/watch/${featured.id}`}
                className="rounded-full bg-sky-400 px-6 py-3 text-sm font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.45)] transition hover:scale-105 hover:bg-sky-300 md:px-8 md:py-4 md:text-base"
              >
                Watch Now
              </Link>

              <Link
                href="/watchlist"
                className="rounded-full border border-white/15 bg-black/35 px-6 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:border-sky-300 hover:text-sky-200 md:px-8 md:py-4 md:text-base"
              >
                My List
              </Link>
            </div>
          </div>

          {featuredItems.length > 1 && (
            <div className="mt-7 flex gap-2">
              {featuredItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeIndex === index
                      ? "w-10 bg-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.95)]"
                      : "w-4 bg-white/25 hover:bg-white/60"
                  }`}
                  aria-label={`Show ${item.title}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes heroContentFade {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}