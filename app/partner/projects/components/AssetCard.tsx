import PlayIcon from "./icons/PlayIcon";

type AssetCardProps = {
  title: string;
  url?: string | null;
  type: "image" | "link";
  aspect: "poster" | "wide";
};

export default function AssetCard({
  title,
  url,
  type,
  aspect,
}: AssetCardProps) {
  const aspectClass =
    aspect === "poster"
      ? "aspect-[2/3]"
      : "aspect-video";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20">
      <div
        className={`${aspectClass} relative overflow-hidden bg-[#070a10]`}
      >
        {type === "image" && url ? (
          <img
            src={url}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_55%)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/35">
              <PlayIcon />
            </div>
          </div>
        )}

        {!url ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="text-xs font-semibold text-white/25">
              Not uploaded
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <p className="text-sm font-black text-white/75">
          {title}
        </p>

        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-xs font-black text-sky-300 transition hover:text-sky-200"
          >
            Open Asset
            <span>↗</span>
          </a>
        ) : (
          <p className="mt-2 text-xs text-white/30">
            No file attached
          </p>
        )}
      </div>
    </div>
  );
}