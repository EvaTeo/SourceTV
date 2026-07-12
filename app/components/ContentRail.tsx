"use client";

import HoverPreviewCard from "@/app/components/HoverPreviewCard";
import {
  CONTENT_CARD_SIZE,
  CONTENT_EDGE_PADDING,
  CONTENT_RAIL_GAP,
} from "@/app/components/contentLayout";
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
  const railRef =
    useRef<HTMLDivElement | null>(null);

  if (!items.length) {
    return null;
  }

  function scrollByAmount(amount: number) {
    railRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }

  function handleWheel(
    event: React.WheelEvent<HTMLDivElement>
  ) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const wantsHorizontal =
      event.shiftKey ||
      Math.abs(event.deltaX) > 0;

    if (wantsHorizontal) {
      event.preventDefault();

      rail.scrollLeft += event.shiftKey
        ? event.deltaY
        : event.deltaX;
    }
  }

  return (
    <section className="group/rail relative overflow-visible py-1">
      <div
        className={`mb-0 flex items-center justify-between gap-4 ${CONTENT_EDGE_PADDING}`}
      >
       <h2 className="text-[15px] font-bold tracking-tight text-white md:text-[1.32rem]">
  {title}
</h2>

        <div className="hidden gap-2 opacity-0 transition duration-300 group-hover/rail:opacity-100 md:flex">
          <button
            type="button"
            onClick={() =>
              scrollByAmount(-900)
            }
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/55 text-lg font-light text-white/75 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100"
            aria-label={`Scroll ${title} left`}
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() =>
              scrollByAmount(900)
            }
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/55 text-lg font-light text-white/75 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100"
            aria-label={`Scroll ${title} right`}
          >
            ›
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-8 z-20 hidden w-16 bg-gradient-to-r from-black via-black/60 to-transparent opacity-0 transition duration-300 group-hover/rail:opacity-100 md:block" />

      <div className="pointer-events-none absolute bottom-0 right-0 top-8 z-20 hidden w-20 bg-gradient-to-l from-black via-black/60 to-transparent opacity-0 transition duration-300 group-hover/rail:opacity-100 md:block" />

      <div
        ref={railRef}
        onWheel={handleWheel}
        className={`flex touch-pan-x snap-x snap-mandatory overflow-x-auto overflow-y-visible pb-5 pt-3 scroll-smooth overscroll-x-contain [scrollbar-width:none] md:pb-6 md:pt-4 [&::-webkit-scrollbar]:hidden ${CONTENT_EDGE_PADDING} ${CONTENT_RAIL_GAP}`}
      >
        {items.map((item, index) => (
          <div
            key={`${title}-${item.id}`}
            className={`shrink-0 snap-start transition duration-300 group-hover/rail:opacity-80 hover:!opacity-100 ${CONTENT_CARD_SIZE}`}
          >
            <HoverPreviewCard
              item={item}
              index={index}
            />
          </div>
        ))}
      </div>
    </section>
  );
}