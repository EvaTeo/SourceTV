"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function getHlsUrl(url?: string | null) {
  if (!url) return "";

  const match = url.match(/embed\/(\d+)\/([a-zA-Z0-9-]+)/);
  if (!match) return "";

  const libraryId = match[1];
  const videoGuid = match[2];

  return `https://vz-${libraryId}.b-cdn.net/${videoGuid}/playlist.m3u8`;
}

function HoverTrailer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsUrl = getHlsUrl(url);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.play().catch(() => {});
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ maxBufferLength: 10 });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });

      return () => hls.destroy();
    }
  }, [hlsUrl]);

  if (!hlsUrl) return null;

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      className="h-full w-full object-cover"
    />
  );
}

export default function HoverPreviewCard({
  item,
  index,
}: {
  item: any;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [popupReady, setPopupReady] = useState(false);
  const [popupPosition, setPopupPosition] = useState({
    left: 0,
    top: 0,
  });

  const previewSource = item.trailerUrl || item.mainVideoUrl || item.videoUrl;

  useEffect(() => {
    setMounted(true);

    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function openPreview() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);

    openTimer.current = setTimeout(() => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const popupWidth = 350;
      const popupHeight = 390;
      const padding = 16;
      const headerSafeTop = 88;

      let centerX = rect.left + rect.width / 2;
      let centerY = rect.top + rect.height / 2;

      centerX = Math.max(
        popupWidth / 2 + padding,
        Math.min(centerX, window.innerWidth - popupWidth / 2 - padding)
      );

      centerY = Math.max(
        popupHeight / 2 + headerSafeTop,
        Math.min(centerY, window.innerHeight - popupHeight / 2 - padding)
      );

      setPopupPosition({ left: centerX, top: centerY });
      setPopupReady(true);

      requestAnimationFrame(() => {
        setHovered(true);
      });
    }, 450);
  }

  function closePreview() {
    if (openTimer.current) clearTimeout(openTimer.current);

    closeTimer.current = setTimeout(() => {
      setHovered(false);
    }, 120);
  }

  return (
    <>
      <div
        ref={cardRef}
        className="group relative"
        onMouseEnter={openPreview}
        onMouseLeave={closePreview}
      >
        <Link href={`/watch/${item.id}`} className="block">
          <div
            className="relative aspect-[2/3] overflow-hidden rounded-[1.35rem] border border-white/10 bg-zinc-950 transition-all duration-300 group-hover:scale-[1.035] group-hover:border-sky-300/55 group-hover:shadow-[0_0_36px_rgba(14,165,233,0.28)]"
            style={{
              backgroundImage: item.thumbnailUrl
                ? `linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0.12)), url(${item.thumbnailUrl})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80" />

            <div className="relative z-10 flex h-full flex-col justify-between p-4">
              <span className="w-fit rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs font-bold text-sky-200 backdrop-blur">
                #{index + 1}
              </span>

              <div>
                <h3 className="line-clamp-2 text-lg font-black leading-tight md:text-xl">
                  {item.title}
                </h3>

                <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-semibold text-white/55">
                  {item.type && <span>{item.type}</span>}
                  {item.genre && <span>• {item.genre}</span>}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {mounted &&
        popupReady &&
        createPortal(
          <div
            onMouseEnter={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
              if (openTimer.current) clearTimeout(openTimer.current);
              setHovered(true);
            }}
            onMouseLeave={closePreview}
            className={`fixed z-[9999] hidden w-[350px] overflow-hidden rounded-[1.6rem] border border-sky-300/25 bg-zinc-950 shadow-[0_0_65px_rgba(14,165,233,0.42)] backdrop-blur-xl transition-[opacity,transform] duration-300 ease-out md:block ${
              hovered
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            style={{
              left: popupPosition.left,
              top: popupPosition.top,
              transform: hovered
                ? "translate(-50%, -50%) scale(1)"
                : "translate(-50%, -50%) scale(0.92)",
              transformOrigin: "center center",
            }}
          >
            <Link href={`/watch/${item.id}`}>
              <div className="relative aspect-video bg-black">
                {previewSource ? (
                  <HoverTrailer url={previewSource} />
                ) : item.backdropUrl || item.thumbnailUrl ? (
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        item.backdropUrl || item.thumbnailUrl
                      })`,
                    }}
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              </div>
            </Link>

            <div className="p-5">
              <h3 className="text-2xl font-black leading-tight">
                {item.title}
              </h3>

              <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs font-semibold text-white/50">
                {item.type && <span>{item.type}</span>}
                {item.genre && <span>• {item.genre}</span>}
                {item.maturityRating && <span>• {item.maturityRating}</span>}
                {item.runtime && <span>• {item.runtime}</span>}
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/58">
                {item.description}
              </p>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/watch/${item.id}`}
                  className="rounded-full bg-sky-400 px-5 py-2 text-sm font-black text-black shadow-[0_0_24px_rgba(56,189,248,0.35)] transition hover:bg-sky-300"
                >
                  Play
                </Link>

                <button className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-bold text-white/80 transition hover:border-sky-300/50 hover:text-sky-200">
                  Add List
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}