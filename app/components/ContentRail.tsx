"use client";

import HoverPreviewCard from "@/app/components/HoverPreviewCard";
import { useRef } from "react";

type ContentItem = {
  id: string;
  title: string;
  type: string;
  genre: string;
  videoUrl: string;
  mainVideoUrl?: string | null;
  trailerUrl?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  description: string;
  status: string;
  views?: number;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  scheduledAt?: string | null;
};

export default function ContentRail({
  title,
  items,
}: {
  title: string;
  items: ContentItem[];
}) {
  const railRef = useRef<HTMLDivElement | null>(null);

  if (!items.length) return null;

  function scrollByAmount(amount: number) {
    railRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    const rail = railRef.current;
    if (!rail) return;

    const isVertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);

    if (isVertical && !e.shiftKey) {
      e.preventDefault();
      window.scrollBy({
        top: e.deltaY,
        behavior: "auto",
      });
      return;
    }

    if (e.shiftKey || Math.abs(e.deltaX) > 0) {
      e.preventDefault();
      rail.scrollLeft += e.shiftKey ? e.deltaY : e.deltaX;
    }
  }

  return (
    <section className="group/rail relative overflow-visible">
      <div className="mb-4 flex items-center justify-between gap-4 md:mb-5">
        <h2 className="text-xl font-black tracking-tight md:text-3xl">
          {title}
        </h2>

        <div className="hidden gap-2 opacity-0 transition group-hover/rail:opacity-100 md:flex">
          <button
            onClick={() => scrollByAmount(-760)}
            className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-white/70 backdrop-blur hover:border-sky-300/50 hover:text-sky-200"
          >
            ←
          </button>

          <button
            onClick={() => scrollByAmount(760)}
            className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-white/70 backdrop-blur hover:border-sky-300/50 hover:text-sky-200"
          >
            →
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-10 z-10 hidden w-12 bg-gradient-to-r from-black to-transparent md:block" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-10 z-10 hidden w-12 bg-gradient-to-l from-black to-transparent md:block" />

      <div
        ref={railRef}
        onWheel={handleWheel}
        className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-visible pb-8 pt-1 scroll-smooth overscroll-x-contain [scrollbar-width:none] md:gap-6 md:pb-10 md:pt-2 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <div
            key={`${title}-${item.id}`}
            className="w-[38vw] min-w-[138px] max-w-[165px] shrink-0 snap-start md:w-[220px] md:min-w-0 md:max-w-none"
          >
            <HoverPreviewCard item={item} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}