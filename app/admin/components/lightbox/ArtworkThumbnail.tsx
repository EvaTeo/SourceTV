"use client";

import Image from "next/image";

type ArtworkThumbnailProps = {
  src: string | null;
  title: string;
  onClick?: () => void;
};

export default function ArtworkThumbnail({
  src,
  title,
  onClick,
}: ArtworkThumbnailProps) {
  if (!src) {
    return (
      <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl border border-white/10 bg-black/20 px-4 text-center text-sm text-white/30">
        No artwork
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      aria-label={`Inspect ${title}`}
      className="group relative block aspect-[2/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20 text-left disabled:cursor-default"
    >
      <Image
        src={src}
        alt={title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition duration-300 group-hover:scale-[1.03]"
      />

      {onClick && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <div className="w-full p-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-white">
              Click to inspect
            </p>
          </div>
        </div>
      )}
    </button>
  );
}