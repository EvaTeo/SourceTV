"use client";

import { useRef, useState } from "react";
import SourceTVPlayer from "@/app/components/SourceTVPlayer";

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
  const playerWrapRef = useRef<HTMLDivElement>(null);

  async function openPlayer() {
    setOpen(true);

    setTimeout(async () => {
      try {
        await playerWrapRef.current?.requestFullscreen();
      } catch {
        // Browser may block fullscreen if unsupported.
      }
    }, 100);
  }

  async function closePlayer() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen exit errors.
    }

    setOpen(false);
  }

  return (
    <>
      <button
        onClick={openPlayer}
        className="inline-flex w-full max-w-[360px] items-center justify-center gap-3 rounded-full bg-white px-10 py-4 text-base font-black text-black shadow-[0_0_38px_rgba(255,255,255,0.18)] transition hover:scale-[1.025] hover:bg-sky-200 md:w-auto md:min-w-[300px] md:px-12 md:py-5 md:text-lg"
      >
        <span>▶</span>
        <span>Play</span>
      </button>

      {open && (
        <div
          ref={playerWrapRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <button
            onClick={closePlayer}
            className="absolute right-5 top-5 z-20 rounded-full border border-white/15 bg-black/70 px-5 py-3 text-sm font-black text-white backdrop-blur-xl transition hover:border-sky-300/50 hover:text-sky-200"
          >
            Close
          </button>

          <div className="w-full">
            <SourceTVPlayer
              url={url}
              poster={poster}
              title={title}
              slug={slug}
              type={type}
            />
          </div>
        </div>
      )}
    </>
  );
}