"use client";

import Link from "next/link";

export type CategoryPosterItem = {
  id: string;
  title: string;
  type: string;
  genre: string;
  maturityRating: string;
  runtime: string;
  thumbnailUrl: string;
  backdropUrl: string;
  scheduledAt: string | null;
};

export default function CategoryPosterCard({
  item,
}: {
  item: CategoryPosterItem;
}) {
  const artwork =
    item.thumbnailUrl ||
    item.backdropUrl;

  return (
    <Link
      href={`/watch/${item.id}`}
      className="group block min-w-0 outline-none"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-[0.85rem] border border-white/[0.07] bg-zinc-950 shadow-[0_12px_30px_rgba(0,0,0,0.38)] transition duration-300 group-hover:-translate-y-1 group-hover:border-white/15 group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.62)] group-focus-visible:ring-2 group-focus-visible:ring-sky-300/70 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black">
        {artwork ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.025]"
            style={{
              backgroundImage: `url(${artwork})`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.18),transparent_34%),linear-gradient(to_bottom,#111827,#020617)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-transparent to-black/12 opacity-75 transition group-hover:opacity-90" />

        {item.scheduledAt && (
          <span className="absolute left-3 top-3 rounded-full bg-sky-300 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-black shadow-[0_0_18px_rgba(56,189,248,0.5)]">
            Premiere
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm text-black shadow-[0_12px_32px_rgba(0,0,0,0.48)] transition duration-300 group-hover:scale-105">
            ▶
          </div>
        </div>
      </div>

      <div className="px-0.5 pt-3">
        <h3 className="line-clamp-1 text-sm font-black text-white/82 transition group-hover:text-white md:text-[15px]">
          {item.title}
        </h3>

        <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-white/36 md:text-[11px]">
          {item.type && (
            <span>{item.type}</span>
          )}

          {item.genre && (
            <>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="truncate">
                {item.genre}
              </span>
            </>
          )}

          {item.maturityRating && (
            <>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>
                {item.maturityRating}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}