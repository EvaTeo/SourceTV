"use client";

import Link from "next/link";

type ContentItem = {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
};

export default function TopTenRail({ items }: { items: ContentItem[] }) {
  if (!items.length) return null;

  return (
    <section className="relative overflow-visible py-1">
      <div className="mb-0 px-5 md:px-12">
        <h2 className="text-[15px] font-bold tracking-tight text-white md:text-[1.32rem]">
          Today's Top 10
        </h2>
      </div>

      <div className="relative">
        <div className="flex gap-3 overflow-x-auto overflow-y-visible px-5 pb-6 pt-5 [scrollbar-width:none] md:gap-5 md:px-12 md:pb-7 md:pt-6 [&::-webkit-scrollbar]:hidden">
          {items.slice(0, 10).map((item, index) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="group relative ml-7 w-[132px] shrink-0 md:ml-12 md:w-[192px]"
              aria-label={`Watch ${item.title}`}
            >
              <span className="pointer-events-none absolute -left-7 bottom-1 z-0 translate-x-2 text-[5.8rem] font-black leading-none text-black [-webkit-text-stroke:2px_rgba(255,255,255,0.42)] opacity-90 drop-shadow-[0_16px_32px_rgba(0,0,0,0.72)] transition-all duration-500 group-hover:-translate-x-3 group-hover:scale-105 group-hover:opacity-100 md:-left-12 md:text-[8.5rem] md:[-webkit-text-stroke:3px_rgba(255,255,255,0.42)]">
                {index + 1}
              </span>

              <div
                className="relative z-10 aspect-[2/3] overflow-hidden rounded-[0.85rem] bg-zinc-950 bg-cover bg-center shadow-[0_10px_26px_rgba(0,0,0,0.32)] transition duration-500 group-hover:-translate-y-2 group-hover:scale-[1.045] group-hover:shadow-[0_20px_54px_rgba(0,0,0,0.62)]"
                style={{
                  backgroundImage: item.thumbnailUrl
                    ? `url(${item.thumbnailUrl})`
                    : undefined,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}