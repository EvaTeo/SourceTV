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
    <section className="relative overflow-visible">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
            Trending Today
          </p>

          <h2 className="text-2xl font-black md:text-3xl">
            Top 10 on SourceTV
          </h2>
        </div>

        <div className="hidden rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-sky-200 md:block">
          Live Rank
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -inset-y-8 left-0 z-10 w-10 bg-gradient-to-r from-black to-transparent md:w-16" />
        <div className="pointer-events-none absolute -inset-y-8 right-0 z-10 w-10 bg-gradient-to-l from-black to-transparent md:w-16" />

        <div className="flex gap-5 overflow-x-auto overflow-y-visible px-2 pb-12 pt-5 [scrollbar-width:none] md:gap-8 md:px-8 [&::-webkit-scrollbar]:hidden">
          {items.slice(0, 10).map((item, index) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="group relative ml-10 w-[145px] shrink-0 md:ml-16 md:w-[220px]"
            >
              <span className="pointer-events-none absolute -left-7 bottom-2 z-0 translate-x-2 bg-gradient-to-br from-white via-sky-200 to-sky-500 bg-clip-text text-7xl font-black leading-none text-transparent opacity-75 drop-shadow-[0_0_18px_rgba(56,189,248,0.45)] transition-all duration-500 group-hover:-translate-x-4 group-hover:scale-110 group-hover:opacity-100 md:-left-14 md:text-9xl">
                {index + 1}
              </span>

              <span className="pointer-events-none absolute -inset-5 z-0 rounded-[2rem] bg-sky-300/0 blur-2xl transition duration-500 group-hover:bg-sky-300/18" />

              <div
                className="relative z-10 aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.045] group-hover:border-sky-300/60 group-hover:shadow-[0_0_42px_rgba(14,165,233,0.34)]"
                style={{
                  backgroundImage: item.thumbnailUrl
                    ? `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.08)), url(${item.thumbnailUrl})`
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-xl">
                  #{index + 1}
                </div>

                <div className="relative z-10 flex h-full items-end p-4">
                  <h3 className="line-clamp-2 text-base font-black leading-tight md:text-lg">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}