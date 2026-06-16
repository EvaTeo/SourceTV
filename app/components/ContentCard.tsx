"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ContentCardProps = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  maturityRating?: string | null;
  runtime?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  views?: number | null;
  scheduledAt?: string | null;
  status?: string | null;
  href?: string;
  adminPreview?: boolean;
  compact?: boolean;
};

export default function ContentCard({
  id,
  title,
  description,
  type,
  genre,
  maturityRating,
  runtime,
  thumbnailUrl,
  backdropUrl,
  trailerUrl,
  views,
  scheduledAt,
  status,
  href,
  adminPreview = false,
  compact = false,
}: ContentCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [hovering, setHovering] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const targetHref = useMemo(() => {
    if (href) return href;
    return `/watch/${id}${adminPreview ? "?preview=admin" : ""}`;
  }, [href, id, adminPreview]);

  const isScheduled =
    scheduledAt && new Date(scheduledAt).getTime() > Date.now();

  useEffect(() => {
    const video = videoRef.current;

    if (
      !video ||
      !trailerUrl ||
      !trailerUrl.includes("playlist.m3u8") ||
      !hovering
    ) {
      return;
    }

    setVideoReady(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (trailerUrl.includes(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });

      hls.loadSource(trailerUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setVideoReady(true);
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = trailerUrl;
      video.onloadedmetadata = () => {
        setVideoReady(true);
        video.play().catch(() => {});
      };
    } else {
      video.src = trailerUrl;
      video.onloadedmetadata = () => {
        setVideoReady(true);
        video.play().catch(() => {});
      };
    }

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [hovering, trailerUrl]);

  return (
    <Link
      href={targetHref}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setVideoReady(false);
      }}
      className={`group relative block shrink-0 overflow-visible rounded-[1rem] outline-none transition-all duration-500 focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        compact ? "w-[150px] md:w-[185px]" : "w-[176px] md:w-[230px]"
      }`}
    >
      <div className="pointer-events-none absolute -inset-3 rounded-[1.5rem] bg-sky-300/0 blur-2xl transition duration-500 group-hover:bg-sky-300/13" />

      <div className="relative overflow-hidden rounded-[1rem] bg-zinc-950 shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.035] group-hover:shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
        <div
          className="relative aspect-[2/3] overflow-hidden bg-zinc-900"
          style={{
            backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute inset-0 scale-105 opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100"
            style={{
              backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {trailerUrl?.includes("playlist.m3u8") && (
            <video
              ref={videoRef}
              muted
              playsInline
              loop
              preload="metadata"
              className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                hovering && videoReady ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/22 to-transparent opacity-80 transition duration-500 group-hover:opacity-92" />

          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 via-black/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {isScheduled && (
              <span className="rounded-full bg-sky-400 px-2.5 py-1 text-[10px] font-black uppercase text-black shadow-[0_0_18px_rgba(56,189,248,0.65)]">
                Premiere
              </span>
            )}

            {status && adminPreview && (
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase text-white/80 backdrop-blur">
                {status}
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 group-hover:-translate-y-1">
            <h3 className="line-clamp-2 text-base font-black leading-tight text-white md:text-lg">
              {title}
            </h3>

            <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-semibold text-white/55 md:text-[11px]">
              {type && <span>{type}</span>}
              {genre && <span>• {genre}</span>}
              {maturityRating && <span>• {maturityRating}</span>}
            </div>
          </div>
        </div>

        <div className="hidden border-t border-white/8 bg-black/82 p-4 backdrop-blur-xl md:block">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-white/45">
            {runtime && <span>{runtime}</span>}
            {views !== undefined && views !== null && (
              <span>{views.toLocaleString()} views</span>
            )}
          </div>

          {description && (
            <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/48">
              {description}
            </p>
          )}

          {scheduledAt && (
            <p className="mt-3 text-[11px] font-bold text-sky-200/80">
              Releases{" "}
              {new Date(scheduledAt).toLocaleString([], {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}