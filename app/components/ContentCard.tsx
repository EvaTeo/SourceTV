"use client";

import Hls from "hls.js";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  scheduledAt?: string | null;
  status?: string | null;
  href?: string;
  adminPreview?: boolean;
  compact?: boolean;
};

const HOVER_OPEN_DELAY = 180;
const HOVER_CLOSE_DELAY = 220;

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M8.3 5.7v12.6L18.8 12 8.3 5.7Z" />
    </svg>
  );
}

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
  scheduledAt,
  status,
  href,
  adminPreview = false,
  compact = false,
}: ContentCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const [hovering, setHovering] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const targetHref = useMemo(() => {
    if (href) {
      return href;
    }

    return `/watch/${id}${adminPreview ? "?preview=admin" : ""}`;
  }, [adminPreview, href, id]);

  const isScheduled =
    Boolean(scheduledAt) &&
    new Date(scheduledAt as string).getTime() > Date.now();

  const hasTrailer = Boolean(
    trailerUrl && trailerUrl.includes(".m3u8")
  );

  const previewImage =
    backdropUrl?.trim() ||
    thumbnailUrl?.trim() ||
    "";

  function clearHoverTimers() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function startHover() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (hovering || openTimerRef.current) {
      return;
    }

    openTimerRef.current = setTimeout(() => {
      setHovering(true);
      openTimerRef.current = null;
    }, HOVER_OPEN_DELAY);
  }

  function endHover() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (!hovering) {
      return;
    }

    closeTimerRef.current = setTimeout(() => {
      setHovering(false);
      setVideoReady(false);
      setVideoFailed(false);
      closeTimerRef.current = null;
    }, HOVER_CLOSE_DELAY);
  }

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !trailerUrl || !hasTrailer || !hovering) {
      return;
    }

    setVideoReady(false);
    setVideoFailed(false);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    function markReady() {
      setVideoReady(true);
      setVideoFailed(false);

      video
        ?.play()
        .catch(() => {
          setVideoReady(false);
        });
    }

    function markFailed() {
      setVideoReady(false);
      setVideoFailed(true);
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        startLevel: -1,
        capLevelToPlayerSize: true,
        maxBufferLength: 12,
        backBufferLength: 8,
      });

      hlsRef.current = hls;

      hls.loadSource(trailerUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, markReady);

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          markFailed();
          hls.destroy();
          hlsRef.current = null;
        }
      });
    } else if (
      video.canPlayType("application/vnd.apple.mpegurl")
    ) {
      video.src = trailerUrl;
      video.addEventListener("loadedmetadata", markReady, {
        once: true,
      });
      video.addEventListener("error", markFailed, {
        once: true,
      });
    } else {
      markFailed();
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
  }, [hasTrailer, hovering, trailerUrl]);

  useEffect(() => {
    return () => {
      clearHoverTimers();

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  const showTrailer =
    hovering &&
    hasTrailer &&
    videoReady &&
    !videoFailed;

  return (
    <Link
      href={targetHref}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      onFocus={startHover}
      onBlur={endHover}
      className={`group relative block shrink-0 overflow-visible rounded-[1rem] outline-none ${
        compact
          ? "w-[150px] md:w-[185px]"
          : "w-[176px] md:w-[230px]"
      }`}
      aria-label={`Open ${title}`}
    >
      <div
        className={`pointer-events-none absolute -inset-4 rounded-[1.75rem] bg-sky-300 blur-3xl transition-all duration-500 ${
          hovering
            ? "scale-100 opacity-[0.14]"
            : "scale-90 opacity-0"
        }`}
      />

      <article
        className={`relative overflow-hidden rounded-[1rem] border bg-zinc-950 transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hovering
            ? "z-20 -translate-y-2 scale-[1.045] border-white/14 shadow-[0_30px_90px_rgba(0,0,0,0.82)]"
            : "z-10 translate-y-0 scale-100 border-white/[0.06] shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
        }`}
      >
        <div
          className="relative aspect-[2/3] overflow-hidden bg-zinc-900"
          style={{
            backgroundImage: thumbnailUrl
              ? `url(${thumbnailUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out ${
              hovering
                ? "scale-100 opacity-100"
                : "scale-[1.06] opacity-0"
            }`}
            style={{
              backgroundImage: previewImage
                ? `url(${previewImage})`
                : undefined,
            }}
          />

          {hasTrailer && (
            <video
              ref={videoRef}
              muted
              playsInline
              loop
              preload="metadata"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                showTrailer ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {hovering &&
            hasTrailer &&
            !videoReady &&
            !videoFailed && (
              <div className="absolute inset-0 overflow-hidden bg-black/12">
                <div className="absolute inset-y-0 -left-1/2 w-1/2 animate-[cardShimmer_1.25s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              </div>
            )}

          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/24 to-transparent transition-opacity duration-500 ${
              hovering ? "opacity-95" : "opacity-78"
            }`}
          />

          <div
            className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/12 to-transparent transition-opacity duration-500 ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
            {isScheduled && (
              <span className="rounded-full bg-sky-300 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-black shadow-[0_0_20px_rgba(56,189,248,0.55)]">
                Premiere
              </span>
            )}

            {status && adminPreview && (
              <span className="rounded-full border border-white/10 bg-black/45 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-white/80 backdrop-blur-xl">
                {status}
              </span>
            )}
          </div>

          <div
            className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/14 bg-black/45 text-white shadow-[0_12px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-400 ${
              hovering
                ? "translate-y-0 scale-100 opacity-100"
                : "-translate-y-2 scale-90 opacity-0"
            }`}
          >
            <PlayIcon />
          </div>

          <div
            className={`absolute bottom-0 left-0 right-0 z-10 p-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hovering ? "-translate-y-1" : "translate-y-0"
            }`}
          >
            <h3 className="line-clamp-2 text-base font-black leading-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] md:text-lg">
              {title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-white/62 md:text-[11px]">
              {type && <span>{type}</span>}

              {genre && (
                <>
                  <span className="text-white/30">•</span>
                  <span>{genre}</span>
                </>
              )}

              {maturityRating && (
                <>
                  <span className="text-white/30">•</span>
                  <span>{maturityRating}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div
          className={`hidden overflow-hidden border-t border-white/[0.07] bg-black/90 backdrop-blur-2xl transition-all duration-[420ms] md:block ${
            hovering
              ? "max-h-[210px] opacity-100"
              : "max-h-[104px] opacity-100"
          }`}
        >
          <div className="p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-white/45">
  {runtime && <span>{runtime}</span>}
</div>

            {description && (
              <p
                className={`mt-3 text-xs leading-5 text-white/52 transition-all duration-500 ${
                  hovering
                    ? "line-clamp-3 opacity-100"
                    : "line-clamp-2 opacity-70"
                }`}
              >
                {description}
              </p>
            )}

            {scheduledAt && (
              <p className="mt-3 text-[11px] font-bold text-sky-200/82">
                Releases{" "}
                {new Date(scheduledAt).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}

            <div
              className={`mt-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.12em] text-sky-200 transition-all duration-500 ${
                hovering
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }`}
            >
              <span>View details</span>
              <span aria-hidden="true">→</span>
            </div>
          </div>
        </div>
      </article>

      <style jsx>{`
        @keyframes cardShimmer {
          from {
            transform: translateX(-120%);
          }

          to {
            transform: translateX(320%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          article,
          video,
          div {
            transition-duration: 0ms !important;
            animation-duration: 0ms !important;
          }
        }
      `}</style>
    </Link>
  );
}