import BannerAd from "@/app/components/BannerAd";
import ContentRail from "@/app/components/ContentRail";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToWatchlistButton from "./AddToWatchlistButton";
import FullscreenPlayButton from "./FullscreenPlayButton";
import SaveToContinueWatching from "./SaveToContinueWatching";
import TrackView from "./TrackView";
import WatchHeroTrailer from "./WatchHeroTrailer";

function cleanRailItems(items: any[]) {
  return items.map((content) => ({
    ...content,
    description: content.description || "",
    type: content.type || "",
    genre: content.genre || "",
    thumbnailUrl: content.thumbnailUrl || "",
    backdropUrl: content.backdropUrl || "",
    trailerUrl: content.trailerUrl || "",
    creatorName: content.creatorName || "",
  }));
}

function LikeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.1] md:h-6 md:w-6"
      aria-hidden="true"
    >
      <path
        d="M7 11v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M7 11 12 3c.7-1.1 2.4-.6 2.4.8V9h4.1c1.5 0 2.7 1.3 2.4 2.8l-1.2 6.5A3.2 3.2 0 0 1 16.5 21H7V11Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    preview?: string;
    play?: string;
  }>;
}) {
  const { slug } = await params;
  const { preview, play } = await searchParams;

  const isAdminPreview = preview === "admin";
  const shouldAutoPlay = play === "true";
  const now = new Date();

  const content = await prisma.projectSubmission.findMany({
    where: isAdminPreview
      ? {}
      : {
          status: "approved",
          OR: [
            { scheduledAt: null },
            { scheduledAt: { lte: now } },
          ],
        },
    orderBy: {
      views: "desc",
    },
  });

  const item = content.find((contentItem) => {
    const titleSlug = contentItem.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    return contentItem.id === slug || titleSlug === slug;
  });

  if (!item) {
    return notFound();
  }

  const playerUrl = item.mainVideoUrl || item.videoUrl;

  const trailerPreviewUrl =
    item.trailerUrl &&
    item.trailerUrl.includes("playlist.m3u8")
      ? item.trailerUrl
      : "";

  const otherContent = content.filter(
    (contentItem) => contentItem.id !== item.id
  );

  const sameGenre = otherContent.filter(
    (contentItem) => contentItem.genre === item.genre
  );

  const moreLikeThisRaw =
    sameGenre.length > 0
      ? sameGenre.slice(0, 12)
      : otherContent.slice(0, 12);

  const becauseYouWatchedRaw = otherContent
    .filter(
      (contentItem) =>
        contentItem.genre === item.genre ||
        contentItem.type === item.type ||
        contentItem.creatorName === item.creatorName
    )
    .slice(0, 12);

  const creatorMoreRaw = item.creatorName
    ? otherContent
        .filter(
          (contentItem) =>
            contentItem.creatorName === item.creatorName
        )
        .slice(0, 12)
    : [];

  const moreLikeThis = cleanRailItems(moreLikeThisRaw);

  const becauseYouWatched = cleanRailItems(
    becauseYouWatchedRaw
  );

  const creatorMore = cleanRailItems(creatorMoreRaw);

  const primaryDetails = [
    item.year ? String(item.year) : null,
    item.maturityRating || "Not Rated",
    item.runtime,
    item.type,
  ].filter(Boolean);

  const secondaryDetails = [
    item.genre,
    item.creatorName
      ? `From ${item.creatorName}`
      : null,
  ].filter(Boolean);

  const hasPlayableVideo =
    Boolean(playerUrl) &&
    Boolean(playerUrl?.startsWith("http"));

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-24 text-white md:pb-0">
      <TrackView projectId={item.id} />

      <section
        className="relative min-h-[92vh] overflow-hidden bg-black px-4 pb-14 pt-24 md:min-h-screen md:px-12 md:pb-20 md:pt-32"
        style={{
          backgroundImage:
            item.backdropUrl || item.thumbnailUrl
              ? `url(${item.backdropUrl || item.thumbnailUrl})`
              : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, black, #020617)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {trailerPreviewUrl && (
          <WatchHeroTrailer url={trailerPreviewUrl} />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/56 to-black/10" />

        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-[58vh] bg-gradient-to-t from-black via-black/78 to-transparent" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_42%,rgba(56,189,248,0.11),transparent_30%)]" />

        {isAdminPreview && (
          <div className="absolute left-4 top-24 z-20 flex flex-wrap items-center gap-3 md:left-12 md:top-28">
            <Link
              href="/admin/review"
              className="rounded-full border border-white/12 bg-black/50 px-4 py-2 text-xs font-bold text-white/72 shadow-[0_12px_34px_rgba(0,0,0,0.32)] backdrop-blur-xl transition hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-100"
            >
              ← Admin Review
            </Link>

            <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-yellow-100 backdrop-blur-xl">
              Admin Preview
            </span>
          </div>
        )}

        <div className="relative z-10 flex min-h-[calc(92vh-8rem)] items-end md:min-h-[calc(100vh-9rem)]">
          <div className="w-full max-w-[880px] pb-6 md:pb-10">
            <div className="animate-[watchReveal_850ms_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0">
              {item.titleLogoUrl ? (
                <img
                  src={item.titleLogoUrl}
                  alt={item.title}
                  className="max-h-[150px] w-auto max-w-[92vw] object-contain drop-shadow-[0_16px_42px_rgba(0,0,0,0.78)] md:max-h-[310px] md:max-w-[860px]"
                />
              ) : (
                <h1 className="max-w-5xl text-5xl font-black leading-[0.88] tracking-[-0.04em] drop-shadow-[0_14px_38px_rgba(0,0,0,0.72)] md:text-8xl">
                  {item.title}
                </h1>
              )}
            </div>

            {primaryDetails.length > 0 && (
              <div className="mt-6 flex animate-[watchReveal_850ms_120ms_cubic-bezier(0.16,1,0.3,1)_forwards] flex-wrap items-center gap-x-3 gap-y-2 text-xs font-bold text-white/72 opacity-0 md:mt-7 md:text-sm">
                {primaryDetails.map((detail, index) => (
                  <span
                    key={`${detail}-${index}`}
                    className="flex items-center gap-3"
                  >
                    {index > 0 && (
                      <span className="h-1 w-1 rounded-full bg-white/28" />
                    )}

                    <span>{detail}</span>
                  </span>
                ))}

                {item.scheduledAt && (
                  <span className="flex items-center gap-3 text-sky-200">
                    <span className="h-1 w-1 rounded-full bg-white/28" />

                    <span>
                      Premieres{" "}
                      {new Date(
                        item.scheduledAt
                      ).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </span>
                )}
              </div>
            )}

            {secondaryDetails.length > 0 && (
              <div className="mt-3 flex animate-[watchReveal_850ms_220ms_cubic-bezier(0.16,1,0.3,1)_forwards] flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-white/45 opacity-0 md:text-sm">
                {secondaryDetails.map((detail, index) => (
                  <span
                    key={`${detail}-${index}`}
                    className="flex items-center gap-3"
                  >
                    {index > 0 && (
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                    )}

                    <span>{detail}</span>
                  </span>
                ))}
              </div>
            )}

            {item.description && (
              <p className="mt-5 max-w-2xl animate-[watchReveal_850ms_320ms_cubic-bezier(0.16,1,0.3,1)_forwards] text-sm leading-7 text-white/74 opacity-0 md:mt-6 md:text-lg md:leading-8">
                {item.description}
              </p>
            )}

            <div className="mt-7 flex animate-[watchReveal_850ms_430ms_cubic-bezier(0.16,1,0.3,1)_forwards] flex-wrap items-center gap-3 opacity-0 md:mt-8">
              {hasPlayableVideo && playerUrl ? (
                <FullscreenPlayButton
                  url={playerUrl}
                  poster={
                    item.thumbnailUrl ||
                    item.backdropUrl
                  }
                  title={item.title}
                  slug={item.id}
                  type={item.type || ""}
                  autoOpen={shouldAutoPlay}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-w-[180px] cursor-not-allowed items-center justify-center rounded-md bg-white/12 px-8 py-3.5 text-base font-black text-white/40 md:min-w-[210px] md:px-10 md:py-4 md:text-lg"
                >
                  No Video
                </button>
              )}

              <AddToWatchlistButton
                title={item.title}
                slug={item.id}
                thumbnailUrl={item.thumbnailUrl || ""}
                type={item.type || ""}
                genre={item.genre || ""}
              />

              <button
                type="button"
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/14 bg-black/38 text-white/78 shadow-[0_12px_34px_rgba(0,0,0,0.36)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:h-14 md:w-14"
                aria-label={`Like ${item.title}`}
              >
                <LikeIcon />
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes watchReveal {
            from {
              opacity: 0;
              transform: translateY(18px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            [class*="watchReveal"] {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>
      </section>

      {hasPlayableVideo && playerUrl && (
        <SaveToContinueWatching
          title={item.title}
          slug={item.id}
          thumbnailUrl={
            item.cardArtUrl ||
            item.backdropUrl ||
            item.thumbnailUrl ||
            ""
          }
          type={item.type || ""}
          genre={item.genre || ""}
          creatorName={item.creatorName || ""}
        />
      )}

      <section className="relative space-y-7 bg-black px-0 pb-28 pt-8 md:space-y-10 md:pb-24 md:pt-12">
        {becauseYouWatched.length > 0 && (
          <ContentRail
            title={`Because You Watched ${item.title}`}
            items={becauseYouWatched}
          />
        )}

        <div className="px-5 py-1 md:px-12">
          <BannerAd projectId={item.id} />
        </div>

        {moreLikeThis.length > 0 && (
          <ContentRail
            title="More Like This"
            items={moreLikeThis}
          />
        )}

        {creatorMore.length > 0 && (
          <ContentRail
            title={`More From ${
              item.creatorName || "This Creator"
            }`}
            items={creatorMore}
          />
        )}
      </section>
    </main>
  );
}