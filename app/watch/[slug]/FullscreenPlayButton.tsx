"use client";

import { useEffect, useRef, useState } from "react";
import SourceTVPlayer from "@/app/components/SourceTVPlayer";

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

export default function FullscreenPlayButton({
  url,
  poster,
  title,
  slug,
  type,
}: {
  url: string;
  poster?: string | null;
  title: string;
  slug: string;
  type: string;
}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(false);
  const playerWrapRef = useRef<HTMLDivElement>(null);

  async function openPlayer() {
    setOpen(true);
    setClosing(false);
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
    setClosing(true);
    setChromeVisible(false);

    setTimeout(async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        // Ignore fullscreen exit errors.
      }

      setOpen(false);
      setShowPlayer(false);
      setChromeVisible(false);
      setClosing(false);
    }, 450);
  }

  useEffect(() => {
    if (!open) return;

    function handleMouseMove(event: MouseEvent) {
      if (closing) return;

      const nearTop = event.clientY <= 120;
      const nearBottom = event.clientY >= window.innerHeight - 210;

      setChromeVisible(nearTop || nearBottom);
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [open, closing]);

  return (
    <>
      <button
        onClick={openPlayer}
        className="inline-flex w-full max-w-[320px] items-center justify-center gap-3 rounded-md bg-white px-8 py-3.5 text-base font-black text-black shadow-[0_12px_34px_rgba(0,0,0,0.32)] transition hover:scale-[1.025] hover:bg-sky-200 md:w-auto md:min-w-[210px] md:px-10 md:py-4 md:text-lg"
      >
        <span className="text-sm md:text-base">▶</span>
        <span>Play</span>
      </button>

      {open && (
        <div
          ref={playerWrapRef}
          className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black transition-opacity duration-500 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
        >
          <button
            onClick={closePlayer}
            className={`absolute left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/18 text-white/88 shadow-[0_12px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-100 md:left-7 md:top-6 md:h-12 md:w-12 ${
              chromeVisible && !closing
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-3 opacity-0"
            }`}
            aria-label="Close player"
          >
            <CloseIcon />
          </button>

          <div
            className={`w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              closing
                ? "scale-[1.04] opacity-0 blur-md"
                : showPlayer
                ? "scale-100 opacity-100 blur-0"
                : "scale-[1.045] opacity-0 blur-md"
            }`}
          >
            {showPlayer && (
              <SourceTVPlayer
                url={url}
                poster={poster}
                title={title}
                slug={slug}
                type={type}
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}