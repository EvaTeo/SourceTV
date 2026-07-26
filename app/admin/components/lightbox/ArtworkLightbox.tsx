"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { ArtworkItem } from "./useArtworkLightbox";

type ArtworkLightboxProps = {
  item: ArtworkItem | null;
  open: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export default function ArtworkLightbox({
  item,
  open,
  onClose,
  onPrevious,
  onNext,
}: ArtworkLightboxProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowLeft") {
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    }

    const previousOverflow = document.body.style.overflow;

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, onPrevious, onNext]);

  if (!open || !item) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Close artwork preview"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="pointer-events-none relative flex min-h-screen items-center justify-center px-4 py-20 sm:px-8">
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto absolute right-4 top-4 z-20 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15 sm:right-6 sm:top-6"
        >
          ✕ Close
        </button>

        <button
          type="button"
          aria-label="Previous artwork"
          onClick={onPrevious}
          className="pointer-events-auto absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-3 text-2xl text-white transition hover:bg-white/15 sm:left-6"
        >
          ←
        </button>

        <button
          type="button"
          aria-label="Next artwork"
          onClick={onNext}
          className="pointer-events-auto absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/70 px-4 py-3 text-2xl text-white transition hover:bg-white/15 sm:right-6"
        >
          →
        </button>

        <div className="pointer-events-auto w-full max-w-6xl">
          <div className="mb-5 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
              Artwork Preview
            </p>

            <h2 className="mt-2 text-xl font-black text-white sm:text-3xl">
              {item.title}
            </h2>
          </div>

          <div className="relative mx-auto h-[70vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
            <Image
              src={item.image}
              alt={item.title}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-white/35">
            Use the arrow keys to navigate · Press Escape to close
          </p>
        </div>
      </div>
    </div>
  );
}