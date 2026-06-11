import TrackView from "./TrackView";
import AddToWatchlistButton from "./AddToWatchlistButton";
import SaveToContinueWatching from "./SaveToContinueWatching";
import FullscreenPlayButton from "./FullscreenPlayButton";
import ContentRail from "@/app/components/ContentRail";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;

  const isAdminPreview = preview === "admin";
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

  const otherContent = content.filter((c) => c.id !== item.id);

  const sameGenre = otherContent.filter((c) => c.genre === item.genre);

  const moreLikeThis =
    sameGenre.length > 0 ? sameGenre.slice(0, 12) : otherContent.slice(0, 12);

  const becauseYouWatched = otherContent
    .filter(
      (c) =>
        c.genre === item.genre ||
        c.type === item.type ||
        c.creatorName === item.creatorName
    )
    .slice(0, 12);

  const creatorMore = item.creatorName
    ? otherContent
        .filter((c) => c.creatorName === item.creatorName)
        .slice(0, 12)
    : [];

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
        className="relative min-h-screen overflow-hidden px-4 pb-14 pt-24 md:px-12 md:pb-20 md:pt-32"
        style={{
          backgroundImage:
            item.backdropUrl || item.thumbnailUrl
              ? `url(${item.backdropUrl || item.thumbnailUrl})`
              : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.28), transparent 34%), linear-gradient(to right, black, #020617)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/14 to-black/30" />

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

        <div className="relative z-10 flex min-h-[calc(100vh-10rem)] items-end">
          <div className="w-full max-w-[760px] pb-8 md:pb-10">
            {item.titleLogoUrl ? (
  <img
    src={item.titleLogoUrl}
    alt={item.title}
    className="max-h-[130px] w-auto max-w-[85vw] object-contain drop-shadow-[0_12px_35px_rgba(0,0,0,0.65)] md:max-h-[220px] md:max-w-[620px]"
  />
) : (
  <h1 className="max-w-5xl text-5xl font-black leading-[0.88] tracking-tight md:text-8xl">
    {item.title}
  </h1>
)}

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-white/64 md:text-sm">
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

            <div className="mt-7">
              {playerUrl && playerUrl.startsWith("http") ? (
                <FullscreenPlayButton
                  url={playerUrl}
                  poster={item.thumbnailUrl}
                  title={item.title}
                  slug={item.id}
                  type={item.type}
                />
              ) : (
                <button className="cursor-not-allowed rounded-full bg-white/20 px-12 py-5 text-lg font-black text-white/50">
                  No Video
                </button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <AddToWatchlistButton
                title={item.title}
                slug={item.id}
                thumbnailUrl={item.thumbnailUrl || ""}
                type={item.type}
                genre={item.genre}
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

            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/72 md:mt-7 md:text-lg md:leading-8">
              {item.description}
            </p>
          </div>
        </div>
      </section>

      {playerUrl && playerUrl.startsWith("http") && (
        <SaveToContinueWatching
          title={item.title}
          slug={item.id}
          thumbnailUrl={item.thumbnailUrl || ""}
          type={item.type}
          genre={item.genre}
          creatorName={item.creatorName}
        />
      )}

      <section className="space-y-10 px-4 pb-28 pt-10 md:space-y-14 md:px-12 md:pb-24 md:pt-14">
        {becauseYouWatched.length > 0 && (
          <ContentRail
            title={`Because You Watched ${item.title}`}
            items={becauseYouWatched}
          />
        )}

        <ContentRail title="More Like This" items={moreLikeThis} />

        {creatorMore.length > 0 && (
          <ContentRail
            title={`More From ${item.creatorName}`}
            items={creatorMore}
          />
        )}
      </section>
    </main>
  );
}