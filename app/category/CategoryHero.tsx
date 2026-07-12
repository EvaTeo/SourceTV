import FullscreenPlayButton from "@/app/watch/[slug]/FullscreenPlayButton";
import Link from "next/link";
import CategoryHeader from "./CategoryHeader";

export type CategoryContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  year?: number | null;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;
  mainVideoUrl?: string | null;
  videoUrl?: string | null;
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
      <path d="M12 11v6" strokeLinecap="round" />
      <path d="M12 7.5h.01" strokeLinecap="round" />
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
    item?.mainVideoUrl || item?.videoUrl || "";

  const details = [
    item?.year ? String(item.year) : null,
    item?.maturityRating,
    item?.runtime,
    item?.genre,
  ].filter(Boolean);

  return (
    <section
      className="relative min-h-[76vh] overflow-hidden bg-black px-5 pb-16 pt-28 text-white md:min-h-[84vh] md:px-12 md:pb-20 md:pt-32"
      style={{
        backgroundImage:
          item?.backdropUrl || item?.thumbnailUrl
            ? `url(${item.backdropUrl || item.thumbnailUrl})`
            : "radial-gradient(circle at 72% 22%, rgba(14,165,233,0.18), transparent 32%), linear-gradient(to right, #020617, black)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/68 to-black/14" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/78 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[44vh] bg-gradient-to-t from-black via-black/75 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_48%,rgba(56,189,248,0.1),transparent_28%)]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(76vh-7rem)] max-w-[1500px] items-end md:min-h-[calc(84vh-8rem)]">
        <div className="w-full max-w-[820px]">
          <CategoryHeader
            title={categoryTitle}
            description={categoryDescription}
          />

          {item && (
            <div className="mt-9">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/40">
                Featured in {categoryTitle}
              </p>

              {item.titleLogoUrl ? (
                <img
                  src={item.titleLogoUrl}
                  alt={item.title}
                  className="mt-4 max-h-[120px] w-auto max-w-[78vw] object-contain drop-shadow-[0_14px_38px_rgba(0,0,0,0.75)] md:max-h-[180px] md:max-w-[650px]"
                />
              ) : (
                <h2 className="mt-3 max-w-3xl text-3xl font-black leading-[0.95] tracking-[-0.035em] md:text-6xl">
                  {item.title}
                </h2>
              )}

              {details.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-white/58 md:text-sm">
                  {details.map((detail, index) => (
                    <span
                      key={`${detail}-${index}`}
                      className="flex items-center gap-3"
                    >
                      {index > 0 && (
                        <span className="h-1 w-1 rounded-full bg-white/25" />
                      )}

                      {detail}
                    </span>
                  ))}
                </div>
              )}

              {item.description && (
                <p className="mt-4 line-clamp-3 max-w-2xl text-sm leading-7 text-white/65 md:text-base md:leading-8">
                  {item.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {playerUrl.startsWith("http") && (
                  <FullscreenPlayButton
                    url={playerUrl}
                    poster={
                      item.thumbnailUrl ||
                      item.backdropUrl
                    }
                    title={item.title}
                    slug={item.id}
                    type={item.type || ""}
                    buttonClassName="inline-flex min-w-[150px] items-center justify-center gap-3 rounded-md bg-white px-7 py-3.5 text-sm font-black text-black shadow-[0_12px_34px_rgba(0,0,0,0.35)] transition hover:scale-[1.025] hover:bg-sky-200 md:min-w-[180px] md:px-8 md:text-base"
                  />
                )}

                <Link
                  href={`/watch/${item.id}`}
                  className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-md border border-white/14 bg-black/42 px-7 py-3.5 text-sm font-black text-white/82 shadow-[0_12px_34px_rgba(0,0,0,0.3)] backdrop-blur-xl transition hover:border-white/28 hover:bg-white/[0.09] hover:text-white md:min-w-[180px] md:px-8 md:text-base"
                >
                  <InfoIcon />
                  More Info
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}