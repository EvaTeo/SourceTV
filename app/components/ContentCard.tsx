"use client";

import Link from "next/link";
import { useMemo } from "react";

type ContentCardProps = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  maturityRating?: string | null;
  runtime?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  trailerUrl?: string | null;
  views?: number | null;
  scheduledAt?: string | null;
  status?: string | null;
  href?: string;
  adminPreview?: boolean;
  compact?: boolean;
};

export default function ContentCard({
  id,
  title,
  description,
  type,
  genre,
  maturityRating,
  runtime,
  thumbnailUrl,
  backdropUrl,
  views,
  scheduledAt,
  status,
  href,
  adminPreview = false,
  compact = false,
}: ContentCardProps) {
  const targetHref = useMemo(() => {
    if (href) return href;
    return `/watch/${id}${adminPreview ? "?preview=admin" : ""}`;
  }, [href, id, adminPreview]);

  const isScheduled =
    scheduledAt && new Date(scheduledAt).getTime() > Date.now();

  return (
    <Link
      href={targetHref}
      className={`group relative block shrink-0 overflow-hidden rounded-[1.4rem] border border-white/10 bg-zinc-950 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-sky-300/50 hover:shadow-[0_0_45px_rgba(56,189,248,0.22)] ${
        compact ? "w-[155px] md:w-[190px]" : "w-[180px] md:w-[240px]"
      }`}
    >
      <div
        className="relative aspect-[2/3] overflow-hidden bg-zinc-900"
        style={{
          backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 opacity-0 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          style={{
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-85" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {isScheduled && (
            <span className="rounded-full bg-sky-400 px-2.5 py-1 text-[10px] font-black uppercase text-black shadow-[0_0_18px_rgba(56,189,248,0.65)]">
              Premiere
            </span>
          )}

          {status && adminPreview && (
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-black uppercase text-white/80 backdrop-blur">
              {status}
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="line-clamp-2 text-lg font-black leading-tight text-white">
            {title}
          </h3>

          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-semibold text-white/55">
            {type && <span>{type}</span>}
            {genre && <span>• {genre}</span>}
            {maturityRating && <span>• {maturityRating}</span>}
          </div>
        </div>
      </div>

      <div className="hidden border-t border-white/10 bg-black/80 p-4 backdrop-blur-xl md:block">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-white/45">
          {runtime && <span>{runtime}</span>}
          {views !== undefined && views !== null && (
            <span>{views.toLocaleString()} views</span>
          )}
        </div>

        {description && (
          <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/50">
            {description}
          </p>
        )}

        {scheduledAt && (
          <p className="mt-3 text-[11px] font-bold text-sky-200/80">
            Releases{" "}
            {new Date(scheduledAt).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}