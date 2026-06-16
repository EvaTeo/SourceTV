"use client";

import TrailerPreviewVideo from "@/app/components/TrailerPreviewVideo";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  runtime?: string | null;
  maturityRating?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  titleLogoUrl?: string | null;
};

const HERO_DURATION = 9000;

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

export default function FeaturedCarousel({ items }: { items: ContentItem[] }) {
  const featuredItems = useMemo(() => items.slice(0, 6), [items]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
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

  useEffect(() => {
    if (featuredItems.length <= 1) return;

    setProgress(0);
    const startedAt = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(100, (elapsed / HERO_DURATION) * 100);

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        setActiveIndex((current) => (current + 1) % featuredItems.length);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [activeIndex, featuredItems.length]);

  const featured = featuredItems[activeIndex];

  const details = [
    featured?.maturityRating,
    featured?.type,
    featured?.genre,
    featured?.runtime,
  ].filter(Boolean);

  if (!featured) return null;

  return (
    <section className="relative min-h-[68vh] overflow-hidden bg-black md:min-h-[105vh]">
      {featuredItems.map((item, index) => {
        const active = index === activeIndex;

        const previewSource =
          item.trailerUrl && item.trailerUrl.includes("playlist.m3u8")
            ? item.trailerUrl
            : "";

        return (
          <div
            key={item.id}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ease-out ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {(item.backdropUrl || item.thumbnailUrl) && (
              <div
                className="absolute inset-[-28px] scale-[1.04]"
                style={{
                  backgroundImage: `url(${
                    item.backdropUrl || item.thumbnailUrl
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}

            {previewSource && active && mounted && (
              <div className="absolute inset-[-28px] opacity-100 transition-opacity duration-700">
                <TrailerPreviewVideo
                  url={previewSource}
                  muted={muted}
                  loop
                  autoPlay
                  className="h-[calc(100%+56px)] w-[calc(100%+56px)] object-cover"
                />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/68 via-black/28 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[78vh] bg-gradient-to-t from-black via-black/52 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[38vh] bg-gradient-to-t from-black via-black/88 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_42%,rgba(56,189,248,0.11),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(56,189,248,0.055),transparent_34%)]" />
          </div>
        );
      })}

      <div className="relative z-10 flex min-h-[62vh] items-end px-4 pb-60 pt-28 md:min-h-[96vh] md:px-12 md:pb-[18rem]">
        <div className="w-full -translate-y-16 md:-translate-y-36">
          <div
            key={featured.id}
            className="max-w-4xl animate-[heroContentFade_900ms_ease]"
          >
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-sky-300/90 md:text-xs">
              Featured on SourceTV
            </p>

            {featured.titleLogoUrl ? (
              <img
                src={featured.titleLogoUrl}
                alt={featured.title}
                className="max-h-[150px] w-auto max-w-[92vw] object-contain drop-shadow-[0_14px_42px_rgba(0,0,0,0.75)] md:max-h-[340px] md:max-w-[880px]"
              />
            ) : (
              <h1 className="max-w-[92%] text-4xl font-black leading-[0.9] tracking-tight drop-shadow-[0_12px_38px_rgba(0,0,0,0.7)] md:text-8xl">
                {featured.title}
              </h1>
            )}

            {details.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-black text-white/68 md:mt-6 md:text-sm">
                {details.map((detail, index) => (
                  <span key={`${detail}-${index}`}>
                    {index > 0 && <span className="mr-2 text-white/34">•</span>}
                    {detail}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76 md:mt-5 md:text-lg md:leading-8">
              {featured.description ||
                "A curated SourceTV title ready to watch."}
            </p>
          </div>

          <div className="mt-6 flex w-full items-center justify-between gap-4 md:mt-7">
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/watch/${featured.id}`}
                className="rounded-md bg-white px-7 py-3.5 text-sm font-black text-black shadow-[0_16px_34px_rgba(0,0,0,0.32)] transition hover:scale-[1.025] hover:bg-sky-200 md:px-9 md:py-4 md:text-base"
              >
                ▶ Watch Now
              </Link>

              <Link
                href={`/watch/${featured.id}`}
                className="rounded-md border border-white/16 bg-white/[0.06] px-7 py-3.5 text-sm font-black text-white/88 backdrop-blur-xl transition hover:scale-[1.025] hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:px-9 md:py-4 md:text-base"
              >
                More Info
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMuted((value) => !value)}
                className="relative z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/35 text-white/74 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition duration-300 hover:scale-105 hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:h-11 md:w-11"
                aria-label={muted ? "Unmute trailer" : "Mute trailer"}
              >
                <VolumeIcon muted={muted} />
              </button>
            </div>
          </div>

          {featuredItems.length > 1 && (
            <div className="mt-7 flex items-center gap-2 md:mt-8">
              {featuredItems.map((item, index) => {
                const active = activeIndex === index;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveIndex(index);
                      setProgress(0);
                    }}
                    className={`relative h-1.5 overflow-hidden rounded-full bg-white/18 transition-all duration-500 hover:bg-white/35 ${
                      active ? "w-16" : "w-6"
                    }`}
                    aria-label={`Show ${item.title}`}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-0 h-full rounded-full bg-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.85)]"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes heroContentFade {
          from {
            opacity: 0;
            transform: translateY(18px);
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