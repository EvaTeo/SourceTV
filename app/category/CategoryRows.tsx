import ContentRail from "@/app/components/ContentRail";
import type { CategoryContentItem } from "./CategoryHero";

type RailItem = CategoryContentItem & {
  status?: string | null;
  scheduledAt?: Date | string | null;
  trailerUrl?: string | null;
  views?: number | null;
  createdAt?: Date | string | null;
  editorPick?: boolean | null;
};

function normalize(items: RailItem[]) {
  return items.map((item) => ({
    ...item,
    description: item.description || "",
    type: item.type || "",
    genre: item.genre || "",
    maturityRating: item.maturityRating || "",
    runtime: item.runtime || "",
    thumbnailUrl: item.thumbnailUrl || "",
    backdropUrl: item.backdropUrl || "",
    trailerUrl: item.trailerUrl || "",
    creatorName: item.creatorName || "",
    videoUrl: item.videoUrl || "",
    mainVideoUrl: item.mainVideoUrl || "",
    titleLogoUrl: item.titleLogoUrl || "",
    status: item.status || "",
    views: item.views ?? undefined,
    scheduledAt: item.scheduledAt
      ? new Date(item.scheduledAt).toISOString()
      : null,
  }));
}

function uniqueItems(items: RailItem[]) {
  return Array.from(
    new Map(items.map((item) => [item.id, item])).values()
  );
}

export default function CategoryRows({
  title,
  items,
  heroId,
}: {
  title: string;
  items: RailItem[];
  heroId?: string;
}) {
  const remaining = uniqueItems(
    items.filter((item) => item.id !== heroId)
  );

  const trending = [...remaining]
    .sort(
      (a, b) =>
        Number(b.views || 0) - Number(a.views || 0)
    )
    .slice(0, 12);

  const recentlyAdded = [...remaining]
    .sort((a, b) => {
      const bTime = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      const aTime = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      return bTime - aTime;
    })
    .slice(0, 12);

  const editorPicks = remaining
    .filter((item) => item.editorPick)
    .slice(0, 12);

  const genres = Array.from(
    new Set(
      remaining
        .map((item) => item.genre?.trim())
        .filter((genre): genre is string => Boolean(genre))
    )
  ).slice(0, 4);

  if (remaining.length === 0) {
    return (
      <section className="px-5 py-20 text-center md:px-12">
        <div className="mx-auto max-w-xl rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] px-6 py-14">
          <h2 className="text-2xl font-black text-white">
            More titles are coming
          </h2>

          <p className="mt-3 text-sm leading-7 text-white/42">
            New {title.toLowerCase()} will appear here as
            they are added to SourceTV.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative space-y-8 bg-black pb-28 pt-8 md:space-y-11 md:pb-24 md:pt-12">
      {trending.length > 0 && (
        <ContentRail
          title={`Trending ${title}`}
          items={normalize(trending)}
        />
      )}

      {recentlyAdded.length > 0 && (
        <ContentRail
          title={`Recently Added ${title}`}
          items={normalize(recentlyAdded)}
        />
      )}

      {editorPicks.length > 0 && (
        <ContentRail
          title="Editor's Picks"
          items={normalize(editorPicks)}
        />
      )}

      {genres.map((genre) => {
        const genreItems = remaining
          .filter((item) => item.genre === genre)
          .slice(0, 12);

        if (genreItems.length === 0) {
          return null;
        }

        return (
          <ContentRail
            key={genre}
            title={genre}
            items={normalize(genreItems)}
          />
        );
      })}

      {remaining.length > 0 && (
        <ContentRail
          title={`Explore All ${title}`}
          items={normalize(remaining.slice(0, 24))}
        />
      )}
    </section>
  );
}