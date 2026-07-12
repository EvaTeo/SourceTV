import ContentRail from "@/app/components/ContentRail";
import type { CategoryCatalogItem } from "./CategoryCatalogGrid";

function normalize(
  items: CategoryCatalogItem[]
) {
  return items.map((item) => ({
    ...item,
    description: item.description || "",
    type: item.type || "",
    genre: item.genre || "",
    maturityRating:
      item.maturityRating || "",
    runtime: item.runtime || "",
    thumbnailUrl:
      item.thumbnailUrl || "",
    backdropUrl:
      item.backdropUrl || "",
    trailerUrl: item.trailerUrl || "",
    creatorName:
      item.creatorName || "",
    videoUrl: item.videoUrl || "",
    mainVideoUrl:
      item.mainVideoUrl || "",
    titleLogoUrl:
      item.titleLogoUrl || "",
    status: item.status || "",
    views: item.views ?? undefined,
    scheduledAt:
      item.scheduledAt || null,
  }));
}

export default function CategoryRows({
  title,
  items,
  heroId,
}: {
  title: string;
  items: CategoryCatalogItem[];
  heroId?: string;
}) {
  const remaining = items.filter(
    (item) => item.id !== heroId
  );

  const trending = [...remaining]
    .sort(
      (a, b) => b.views - a.views
    )
    .slice(0, 12);

  const recentlyAdded = [...remaining]
    .sort((a, b) => {
      const aTime = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const bTime = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return bTime - aTime;
    })
    .slice(0, 12);

  const editorPicks = remaining
    .filter((item) => item.editorPick)
    .slice(0, 12);

  if (
    trending.length === 0 &&
    recentlyAdded.length === 0 &&
    editorPicks.length === 0
  ) {
    return null;
  }

  return (
    <section className="relative space-y-8 bg-black pb-28 pt-4 md:space-y-11 md:pb-24 md:pt-6">
      {trending.length > 0 && (
        <ContentRail
          title={`Trending ${title}`}
          items={normalize(trending)}
        />
      )}

      {recentlyAdded.length > 0 && (
        <ContentRail
          title="Recently Added"
          items={normalize(recentlyAdded)}
        />
      )}

      {editorPicks.length > 0 && (
        <ContentRail
          title="Editor's Picks"
          items={normalize(editorPicks)}
        />
      )}
    </section>
  );
}