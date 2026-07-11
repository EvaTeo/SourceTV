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
          OR: [{ scheduledAt: null }, { scheduledAt: { lte: now } }],
        },
    orderBy: {
      views: "desc",
    },
  });

  const item = content.find((c) => {
    const titleSlug = c.title.toLowerCase().trim().replace(/\s+/g, "-");
    return c.id === slug || titleSlug === slug;
  });

  if (!item) return notFound();

  const playerUrl = item.mainVideoUrl || item.videoUrl;

  const trailerPreviewUrl =
    item.trailerUrl && item.trailerUrl.includes("playlist.m3u8")
      ? item.trailerUrl
      : "";

  const otherContent = content.filter((c) => c.id !== item.id);
  const sameGenre = otherContent.filter((c) => c.genre === item.genre);

  const moreLikeThisRaw =
    sameGenre.length > 0 ? sameGenre.slice(0, 12) : otherContent.slice(0, 12);

  const becauseYouWatchedRaw = otherContent
    .filter(
      (c) =>
        c.genre === item.genre ||
        c.type === item.type ||
        c.creatorName === item.creatorName
    )
    .slice(0, 12);

  const creatorMoreRaw = item.creatorName
    ? otherContent
        .filter((c) => c.creatorName === item.creatorName)
        .slice(0, 12)
    : [];

  const moreLikeThis = cleanRailItems(moreLikeThisRaw);
  const becauseYouWatched = cleanRailItems(becauseYouWatchedRaw);
  const creatorMore = cleanRailItems(creatorMoreRaw);

  const details = [
    item.maturityRating || "Not Rated",
    item.runtime,
    item.type,
    item.genre,
    item.creatorName,
  ].filter(Boolean);

  return (
    <main className="min-h-screen overflow-x-hidden bg-black pb-28 text-white md:pb-0">
      <TrackView projectId={item.id} />

      <section
        className="relative min-h-screen overflow-hidden px-4 pb-12 pt-24 md:px-12 md:pb-16 md:pt-32"
        style={{
          backgroundImage:
            item.backdropUrl || item.thumbnailUrl
              ? `url(${item.backdropUrl || item.thumbnailUrl})`
              : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, black, #020617)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {trailerPreviewUrl && <WatchHeroTrailer url={trailerPreviewUrl} />}

        <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/42 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-[46vh] bg-gradient-to-t from-black via-black/50 to-transparent" />

        {isAdminPreview && (
          <div className="absolute left-4 top-24 z-20 flex flex-wrap items-center gap-3 md:left-12 md:top-28">
            <Link
              href="/admin/review"
              className="rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs font-bold text-white/70 backdrop-blur transition hover:border-sky-300 hover:text-sky-200"
            >
              ← Admin Review
            </Link>

            <span className="rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-xs font-black text-yellow-100">
              Admin Preview
            </span>
          </div>
        )}

        <div className="relative z-10 flex min-h-[calc(100vh-9rem)] items-end">
          <div className="w-full max-w-[820px] pb-8 md:pb-12">
            {item.titleLogoUrl ? (
              <img
                src={item.titleLogoUrl}
                alt={item.title}
                className="max-h-[175px] w-auto max-w-[92vw] object-contain drop-shadow-[0_14px_38px_rgba(0,0,0,0.72)] md:max-h-[360px] md:max-w-[960px]"
              />
            ) : (
              <h1 className="max-w-5xl text-5xl font-black leading-[0.88] tracking-tight md:text-8xl">
                {item.title}
              </h1>
            )}

            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/68 md:mt-7 md:text-sm">
              {details.map((detail, index) => (
                <span key={`${detail}-${index}`}>
                  {index > 0 && <span className="mr-2 text-white/35">•</span>}
                  {detail}
                </span>
              ))}

              {item.scheduledAt && (
                <span>
                  <span className="mr-2 text-white/35">•</span>
                  Premieres{" "}
                  {new Date(item.scheduledAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              )}
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/76 md:mt-6 md:text-lg md:leading-8">
              {item.description || ""}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {playerUrl && playerUrl.startsWith("http") ? (
             <FullscreenPlayButton
  url={playerUrl}
  poster={item.thumbnailUrl}
  title={item.title}
  slug={item.id}
  type={item.type || ""}
  autoOpen={shouldAutoPlay}
/>
              ) : (
                <button className="cursor-not-allowed rounded-full bg-white/20 px-12 py-5 text-lg font-black text-white/50">
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
                className="group inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/80 backdrop-blur-xl transition hover:border-sky-300/50 hover:bg-white/[0.08] hover:text-sky-200 md:h-14 md:w-14"
                aria-label="Like title"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="h-5 w-5 stroke-[2.2] transition group-hover:scale-110 md:h-6 md:w-6"
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
              </button>
            </div>
          </div>
        </div>
      </section>

      {playerUrl && playerUrl.startsWith("http") && (
        <SaveToContinueWatching
          title={item.title}
          slug={item.id}
          thumbnailUrl={item.thumbnailUrl || ""}
          type={item.type || ""}
          genre={item.genre || ""}
          creatorName={item.creatorName || ""}
        />
      )}

      <section className="space-y-6 px-0 pb-28 pt-8 md:space-y-8 md:pb-24 md:pt-10">
        {becauseYouWatched.length > 0 && (
          <ContentRail
            title={`Because You Watched ${item.title}`}
            items={becauseYouWatched}
          />
        )}

        <div className="py-2">
          <BannerAd projectId={item.id} />
        </div>

        <ContentRail title="More Like This" items={moreLikeThis} />

        {creatorMore.length > 0 && (
          <ContentRail
            title={`More From ${item.creatorName || "This Creator"}`}
            items={creatorMore}
          />
        )}
      </section>
    </main>
  );
}