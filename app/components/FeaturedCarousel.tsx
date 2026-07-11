"use client";

import TrailerPreviewVideo from "@/app/components/TrailerPreviewVideo";
import FullscreenPlayButton from "@/app/watch/[slug]/FullscreenPlayButton";
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

  videoUrl?: string | null;
  mainVideoUrl?: string | null;

  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  titleLogoUrl?: string | null;

  scheduledAt?: string | null;
  views?: number | null;

  featured?: boolean;
  featuredRank?: number | null;

  heroBadge?: string | null;
  heroPriority?: number | null;
  heroStartDate?: string | null;
  heroEndDate?: string | null;
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

function getHeroBadge(item: ContentItem, index: number) {
  if (item.heroBadge?.trim()) {
    return item.heroBadge.trim().toUpperCase();
  }

  if (index === 0) {
    return "SPOTLIGHT";
  }

  if (item.scheduledAt) {
    const scheduledTime = new Date(item.scheduledAt).getTime();

    if (!Number.isNaN(scheduledTime)) {
      const daysUntilRelease =
        (scheduledTime - Date.now()) / (1000 * 60 * 60 * 24);

      if (daysUntilRelease > 0 && daysUntilRelease <= 7) {
        return "PREMIERING SOON";
      }

      const daysSinceRelease =
        (Date.now() - scheduledTime) / (1000 * 60 * 60 * 24);

      if (daysSinceRelease >= 0 && daysSinceRelease <= 30) {
        return "NEW THIS WEEK";
      }
    }
  }

  if ((item.views || 0) >= 5000) {
    return "TRENDING NOW";
  }

  return "EDITOR'S CHOICE";
}

export default function FeaturedCarousel({
  items,
}: {
  items: ContentItem[];
}) {
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
    if (!mounted) {
      return;
    }

    localStorage.setItem(
      "sourcetv_trailer_muted",
      String(muted)
    );
  }, [muted, mounted]);

  useEffect(() => {
    if (featuredItems.length <= 1) {
      setProgress(0);
      return;
    }

    setProgress(0);

    const startedAt = Date.now();

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;

      const nextProgress = Math.min(
        100,
        (elapsed / HERO_DURATION) * 100
      );

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        setActiveIndex(
          (current) => (current + 1) % featuredItems.length
        );
      }
    }, 80);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeIndex, featuredItems.length]);

  useEffect(() => {
    if (
      featuredItems.length > 0 &&
      activeIndex >= featuredItems.length
    ) {
      setActiveIndex(0);
    }
  }, [activeIndex, featuredItems.length]);

  const featured = featuredItems[activeIndex];

  if (!featured) {
    return null;
  }

  const heroBadge = getHeroBadge(featured, activeIndex);

  const playerUrl =
    featured.mainVideoUrl?.trim() ||
    featured.videoUrl?.trim() ||
    "";

  const details = [
    featured.maturityRating,
    featured.type,
    featured.genre,
    featured.runtime,
  ].filter(Boolean);

  return (
    <section className="relative min-h-[72vh] overflow-hidden bg-black md:min-h-[92vh]">
      {featuredItems.map((item, index) => {
        const active = index === activeIndex;

        const previewSource = item.trailerUrl?.includes(
          "playlist.m3u8"
        )
          ? item.trailerUrl
          : "";

        return (
          <div
            key={item.id}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-[1800ms] ease-out ${
              active
                ? "opacity-100"
                : "pointer-events-none opacity-0"
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
              <div className="absolute inset-[-28px] opacity-100 transition-opacity duration-[1200ms]">
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

      <div className="relative z-10 flex min-h-[72vh] items-end px-4 pb-60 pt-28 md:min-h-[92vh] md:px-12 md:pb-[18rem]">
        <div className="w-full -translate-y-16 md:-translate-y-24">
          <div key={featured.id} className="max-w-4xl">
            <div className="hero-reveal hero-delay-0 mb-5 flex items-center gap-3">
              <div className="h-px w-10 bg-sky-300/70" />

              <p className="text-[11px] font-black uppercase tracking-[0.38em] text-sky-300">
                {heroBadge}
              </p>
            </div>

            <div className="hero-reveal hero-delay-1">
              {featured.titleLogoUrl ? (
                <img
                  src={featured.titleLogoUrl}
                  alt={featured.title}
                  className="max-h-[125px] w-auto max-w-[88vw] object-contain drop-shadow-[0_14px_42px_rgba(0,0,0,0.75)] md:max-h-[230px] md:max-w-[720px]"
                />
              ) : (
                <h1 className="max-w-[92%] text-4xl font-black leading-[0.9] tracking-tight drop-shadow-[0_12px_38px_rgba(0,0,0,0.7)] md:text-8xl">
                  {featured.title}
                </h1>
              )}
            </div>

            {details.length > 0 && (
              <div className="hero-reveal hero-delay-2 mt-5 flex flex-wrap gap-2 text-xs font-black text-white/68 md:mt-6 md:text-sm">
                {details.map((detail, index) => (
                  <span key={`${detail}-${index}`}>
                    {index > 0 && (
                      <span className="mr-2 text-white/34">
                        •
                      </span>
                    )}

                    {detail}
                  </span>
                ))}
              </div>
            )}

            <p className="hero-reveal hero-delay-3 mt-4 max-w-2xl text-sm leading-7 text-white/76 md:mt-5 md:text-lg md:leading-8">
              {featured.description ||
                "A curated SourceTV title ready to watch."}
            </p>
          </div>

          <div className="hero-reveal hero-delay-4 mt-6 flex w-full items-center justify-between gap-4 md:mt-7">
            <div className="flex flex-wrap gap-3">
              <FullscreenPlayButton
                url={playerUrl}
                poster={
                  featured.thumbnailUrl ||
                  featured.backdropUrl
                }
                title={featured.title}
                slug={featured.id}
                type={featured.type || ""}
                buttonClassName="inline-flex items-center justify-center gap-2 rounded-md bg-white px-7 py-3.5 text-sm font-black text-black shadow-[0_16px_34px_rgba(0,0,0,0.32)] transition hover:scale-[1.025] hover:bg-sky-200 md:px-9 md:py-4 md:text-base"
                buttonContent={
                  <>
                    <span>▶</span>
                    <span>Play</span>
                  </>
                }
              />

              <Link
                href={`/watch/${featured.id}`}
                className="rounded-md border border-white/16 bg-white/[0.06] px-7 py-3.5 text-sm font-black text-white/88 backdrop-blur-xl transition hover:scale-[1.025] hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:px-9 md:py-4 md:text-base"
              >
                More Info
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              className="relative z-30 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/14 bg-black/35 text-white/74 shadow-[0_12px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition duration-300 hover:scale-105 hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:h-11 md:w-11"
              aria-label={
                muted ? "Unmute trailer" : "Mute trailer"
              }
            >
              <VolumeIcon muted={muted} />
            </button>
          </div>

          {featuredItems.length > 1 && (
            <div className="hero-reveal hero-delay-5 mt-9 flex items-center gap-2">
              {featuredItems.map((item, index) => {
                const active = activeIndex === index;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveIndex(index);
                      setProgress(0);
                    }}
                    className={`relative h-[3px] overflow-hidden rounded-full transition-all duration-300 ${
                      active
                        ? "w-14 bg-white/20"
                        : "w-6 bg-white/15 hover:w-8 hover:bg-white/30"
                    }`}
                    aria-label={`Show ${item.title}`}
                  >
                    {active && (
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.8)]"
                        style={{
                          width: `${progress}%`,
                          transition: "width 80ms linear",
                        }}
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
        .hero-reveal {
          opacity: 0;
          transform: translateY(20px);
          animation: heroReveal 700ms
            cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .hero-delay-0 {
          animation-delay: 0ms;
        }

        .hero-delay-1 {
          animation-delay: 140ms;
        }

        .hero-delay-2 {
          animation-delay: 250ms;
        }

        .hero-delay-3 {
          animation-delay: 380ms;
        }

        .hero-delay-4 {
          animation-delay: 520ms;
        }

        .hero-delay-5 {
          animation-delay: 680ms;
        }

        @keyframes heroReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-reveal {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}