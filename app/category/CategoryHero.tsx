import FullscreenPlayButton from "@/app/watch/[slug]/FullscreenPlayButton";
import Link from "next/link";
import DominantColorGlow from "./DominantColorGlow";

export type CategoryContentItem = {
  id: string;
  title: string;
  description: string;
  type: string;
  genre: string;
  year?: number | null;
  maturityRating: string;
  runtime: string;
  creatorName: string;
  thumbnailUrl: string;
  backdropUrl: string;
  titleLogoUrl: string;
  mainVideoUrl: string;
  videoUrl: string;
};

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />

      <path
        d="M12 11v6"
        strokeLinecap="round"
      />

      <path
        d="M12 7.5h.01"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CategoryHero({
  categoryTitle,
  categoryDescription,
  item,
}: {
  categoryTitle: string;
  categoryDescription: string;
  item?: CategoryContentItem | null;
}) {
  const playerUrl =
    item?.mainVideoUrl ||
    item?.videoUrl ||
    "";

  const artwork =
    item?.backdropUrl ||
    item?.thumbnailUrl;

  const details = [
    item?.year
      ? String(item.year)
      : null,
    item?.maturityRating,
    item?.runtime,
    item?.genre,
  ].filter(Boolean);

  return (
    <section
      className="relative min-h-[460px] overflow-hidden bg-black px-5 pb-14 pt-28 text-white md:min-h-[560px] md:px-10 md:pb-16 md:pt-32 xl:px-12"
      style={{
        backgroundImage: artwork
          ? `url(${artwork})`
          : "radial-gradient(circle at 72% 20%, rgba(14,165,233,0.2), transparent 34%), linear-gradient(to right, #020617, black)",
        backgroundSize: "cover",
        backgroundPosition: "center 28%",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/96 via-black/68 to-black/16" />

      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/80 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <DominantColorGlow
        imageUrl={artwork}
        className="-left-[18%] top-[2%] h-[118%] w-[82%] blur-2xl"
      />

      <div className="absolute right-5 top-28 z-20 md:right-10 md:top-32 xl:right-12">
        <p className="text-right text-[11px] font-black uppercase tracking-[0.34em] text-white/72 drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)] md:text-sm">
          {categoryTitle}
        </p>

        <div className="ml-auto mt-2 h-px w-14 bg-gradient-to-l from-sky-300/80 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[calc(460px-7rem)] w-full items-end md:min-h-[calc(560px-8rem)]">
        <div className="w-full max-w-[780px]">
          {item ? (
            <>
              {item.titleLogoUrl ? (
                <img
                  src={item.titleLogoUrl}
                  alt={item.title}
                  className="max-h-[115px] w-auto max-w-[82vw] object-contain object-left drop-shadow-[0_16px_38px_rgba(0,0,0,0.78)] md:max-h-[175px] md:max-w-[650px]"
                />
              ) : (
                <h1 className="max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.045em] drop-shadow-[0_14px_34px_rgba(0,0,0,0.8)] md:text-7xl">
                  {item.title}
                </h1>
              )}

              {details.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-white/62 drop-shadow-[0_3px_10px_rgba(0,0,0,0.72)] md:text-sm">
                  {details.map((detail, index) => (
                    <span
                      key={`${detail}-${index}`}
                      className="flex items-center gap-3"
                    >
                      {index > 0 && (
                        <span className="h-1 w-1 rounded-full bg-white/28" />
                      )}

                      {detail}
                    </span>
                  ))}
                </div>
              )}

              {item.description && (
                <p className="mt-5 line-clamp-3 max-w-2xl text-sm leading-7 text-white/72 drop-shadow-[0_4px_14px_rgba(0,0,0,0.78)] md:text-base md:leading-8">
                  {item.description}
                </p>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {playerUrl.startsWith("http") && (
                  <FullscreenPlayButton
                    url={playerUrl}
                    poster={
                      item.thumbnailUrl ||
                      item.backdropUrl
                    }
                    title={item.title}
                    slug={item.id}
                    type={item.type}
                    buttonClassName="inline-flex min-w-[145px] items-center justify-center gap-2.5 rounded-md bg-white px-7 py-3.5 text-sm font-black text-black shadow-[0_14px_34px_rgba(0,0,0,0.42)] transition hover:scale-[1.025] hover:bg-sky-200 md:min-w-[170px] md:text-base"
                    buttonContent={
                      <>
                        <span className="text-xs">
                          ▶
                        </span>

                        <span>Play</span>
                      </>
                    }
                  />
                )}

                <Link
                  href={`/watch/${item.id}`}
                  className="inline-flex min-w-[145px] items-center justify-center gap-2 rounded-md border border-white/16 bg-black/35 px-7 py-3.5 text-sm font-black text-white/82 shadow-[0_14px_34px_rgba(0,0,0,0.34)] backdrop-blur-xl transition hover:border-white/30 hover:bg-white/[0.1] hover:text-white md:min-w-[170px] md:text-base"
                >
                  <InfoIcon />
                  More Info
                </Link>
              </div>
            </>
          ) : (
            <div className="max-w-2xl">
              <h1 className="text-4xl font-black leading-[0.94] tracking-[-0.04em] md:text-7xl">
                {categoryTitle}
              </h1>

              <p className="mt-5 text-sm leading-7 text-white/58 md:text-base md:leading-8">
                {categoryDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}