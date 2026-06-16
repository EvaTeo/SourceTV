"use client";

import SourceTVPlayer from "@/app/components/SourceTVPlayer";
import TrailerPreviewVideo from "@/app/components/TrailerPreviewVideo";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-6 w-6 stroke-[1.9]"
    >
      <path d="M6.5 6.5 17.5 17.5" strokeLinecap="round" />
      <path d="M17.5 6.5 6.5 17.5" strokeLinecap="round" />
    </svg>
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
  const playerWrapRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mounted, setMounted] = useState(false);
  const [popupReady, setPopupReady] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerClosing, setPlayerClosing] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });
  const [popupOrigin, setPopupOrigin] = useState("center center");

  const watchHref = `/watch/${item.id}`;
  const playerUrl = item.mainVideoUrl || item.videoUrl;

  const previewSource =
    item.trailerUrl && item.trailerUrl.includes("playlist.m3u8")
      ? item.trailerUrl
      : "";

  useEffect(() => {
    setMounted(true);

    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!playerOpen) return;

    function handleMouseMove(event: MouseEvent) {
      if (playerClosing) return;

      const nearTop = event.clientY <= 120;
      const nearBottom = event.clientY >= window.innerHeight - 210;

      setChromeVisible(nearTop || nearBottom);
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [playerOpen, playerClosing]);

  function openPreview() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);

    openTimer.current = setTimeout(() => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const popupWidth = 390;
      const popupHeight = 415;
      const safeEdge = window.innerWidth >= 768 ? 40 : 16;
      const headerSafeTop = 86;
      const bottomSafe = 20;

      let left = rect.left + rect.width / 2 + window.scrollX;
      let top = rect.top + rect.height / 2 + window.scrollY;

      const minLeft = window.scrollX + safeEdge + popupWidth / 2;
      const maxLeft =
        window.scrollX + window.innerWidth - safeEdge - popupWidth / 2;
      const minTop = window.scrollY + headerSafeTop + popupHeight / 2;
      const maxTop =
        window.scrollY + window.innerHeight - bottomSafe - popupHeight / 2;

      const originalLeft = left;
      const originalTop = top;

      left = Math.max(minLeft, Math.min(left, maxLeft));
      top = Math.max(minTop, Math.min(top, maxTop));

      let originX = "center";
      let originY = "center";

      if (left > originalLeft + 4) originX = "left";
      if (left < originalLeft - 4) originX = "right";
      if (top > originalTop + 4) originY = "top";
      if (top < originalTop - 4) originY = "bottom";

      setPopupPosition({ left, top });
      setPopupOrigin(`${originX} ${originY}`);
      setPopupReady(true);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHovered(true);
        });
      });
    }, 575);
  }

  function closePreview() {
    if (openTimer.current) clearTimeout(openTimer.current);

    closeTimer.current = setTimeout(() => {
      setHovered(false);
    }, 160);
  }

  function keepPreviewOpen() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    setHovered(true);
  }

  async function openPlayer(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!playerUrl || !playerUrl.startsWith("http")) return;

    setHovered(false);
    setPlayerOpen(true);
    setPlayerClosing(false);
    setShowPlayer(false);
    setChromeVisible(true);

    setTimeout(() => {
      setShowPlayer(true);
    }, 120);

    setTimeout(async () => {
      try {
        await playerWrapRef.current?.requestFullscreen();
      } catch {
        // Browser may block fullscreen if unsupported.
      }
    }, 720);
  }

  async function closePlayer() {
    setPlayerClosing(true);
    setChromeVisible(false);

    setTimeout(async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        // Ignore fullscreen exit errors.
      }

      setPlayerOpen(false);
      setShowPlayer(false);
      setChromeVisible(false);
      setPlayerClosing(false);
    }, 450);
  }

  return (
    <>
      <div
        ref={cardRef}
        className="group relative overflow-visible"
        onMouseEnter={openPreview}
        onMouseLeave={closePreview}
      >
        <Link href={watchHref} className="block" aria-label={item.title}>
          <div
            className="relative aspect-[2/3] overflow-hidden rounded-[0.85rem] bg-zinc-950 bg-cover bg-center shadow-[0_10px_26px_rgba(0,0,0,0.28)] transition duration-300 group-hover:scale-[1.055] group-hover:shadow-[0_18px_42px_rgba(0,0,0,0.55)]"
            style={{
              backgroundImage: item.thumbnailUrl
                ? `url(${item.thumbnailUrl})`
                : undefined,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <h3 className="line-clamp-2 text-sm font-black leading-tight text-white md:text-base">
                {item.title}
              </h3>

              <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-semibold text-white/60">
                {item.type && <span>{item.type}</span>}
                {item.genre && <span>• {item.genre}</span>}
              </div>
            </div>
          </div>
        </Link>
      </div>

      {mounted &&
        popupReady &&
        createPortal(
          <div
            onMouseEnter={keepPreviewOpen}
            onMouseLeave={closePreview}
            className={`absolute z-[9999] hidden w-[390px] overflow-hidden rounded-[1rem] bg-zinc-950 shadow-[0_26px_90px_rgba(0,0,0,0.78)] ring-1 ring-white/10 transition-all duration-300 ease-out md:block ${
              hovered
                ? "pointer-events-auto scale-100 opacity-100"
                : "pointer-events-none scale-[0.965] opacity-0"
            }`}
            style={{
              left: popupPosition.left,
              top: popupPosition.top,
              transform: "translate(-50%, -50%)",
              transformOrigin: popupOrigin,
            }}
          >
            <Link href={watchHref}>
              <div className="relative aspect-video bg-black">
                {previewSource && hovered ? (
                  <TrailerPreviewVideo
                    url={previewSource}
                    muted
                    loop
                    autoPlay
                    className="h-full w-full object-cover"
                  />
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              </div>
            </Link>

            <div className="p-4">
              <h3 className="line-clamp-1 text-lg font-black leading-tight">
                {item.title}
              </h3>

              <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-semibold text-white/55">
                {item.type && <span>{item.type}</span>}
                {item.genre && <span>• {item.genre}</span>}
                {item.maturityRating && <span>• {item.maturityRating}</span>}
                {item.runtime && <span>• {item.runtime}</span>}
              </div>

              <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/55">
                {item.description}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={openPlayer}
                  disabled={!playerUrl || !playerUrl.startsWith("http")}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-black text-black shadow-[0_0_22px_rgba(255,255,255,0.14)] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Play ${item.title}`}
                >
                  ▶
                </button>

                <Link
                  href={watchHref}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/80 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                >
                  More Info
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}

      {mounted &&
        playerOpen &&
        createPortal(
          <div
            ref={playerWrapRef}
            className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden bg-black transition-opacity duration-500 ${
              playerClosing ? "opacity-0" : "opacity-100"
            }`}
          >
            <button
              onClick={closePlayer}
              className={`absolute left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/18 text-white/88 shadow-[0_12px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-100 md:left-7 md:top-6 md:h-12 md:w-12 ${
                chromeVisible && !playerClosing
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-3 opacity-0"
              }`}
              aria-label="Close player"
            >
              <CloseIcon />
            </button>

            <div
              className={`w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                playerClosing
                  ? "scale-[1.04] opacity-0 blur-md"
                  : showPlayer
                  ? "scale-100 opacity-100 blur-0"
                  : "scale-[1.045] opacity-0 blur-md"
              }`}
            >
              {showPlayer && playerUrl && (
                <SourceTVPlayer
                  url={playerUrl}
                  poster={item.thumbnailUrl}
                  title={item.title}
                  slug={item.id}
                  type={item.type}
                  autoPlay
                />
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}