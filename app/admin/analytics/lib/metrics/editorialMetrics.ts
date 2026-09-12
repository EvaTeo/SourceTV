import {
  getAnalyticsDates,
  getCollectionDisplayStatus,
  isDateRangeActive,
  type AnalyticsDashboardData,
} from "./helpers";

export function buildEditorialMetrics(
  data: AnalyticsDashboardData
) {
  const {
    editorialCollections,
    heroTitles,
  } = data;

  const { now } =
    getAnalyticsDates();

  const activeEditorialCollections =
    editorialCollections.filter(
      (collection) =>
        collection.status ===
          "active" &&
        isDateRangeActive(
          collection.startsAt,
          collection.endsAt,
          now
        )
    );

  const scheduledEditorialCollections =
    editorialCollections.filter(
      (collection) => {
        const beginsInFuture =
          collection.startsAt !==
            null &&
          collection.startsAt >
            now;

        return (
          collection.status ===
            "scheduled" ||
          beginsInFuture
        );
      }
    );

  const totalCollectionItems =
    editorialCollections.reduce(
      (sum, collection) =>
        sum +
        collection.items.length,
      0
    );

  const editorialCollectionRows =
    editorialCollections.map(
      (collection) => ({
        id: collection.id,

        title:
          collection.title,

        placement:
          collection.placement,

        status:
          getCollectionDisplayStatus(
            collection.status,
            collection.startsAt,
            collection.endsAt,
            now
          ),

        itemCount:
          collection.items.length,

        startsAt:
          collection.startsAt?.toISOString() ||
          null,

        endsAt:
          collection.endsAt?.toISOString() ||
          null,
      })
    );

  const activeHeroTitles =
    heroTitles.filter(
      (title) =>
        title.featured &&
        title.workflowStage ===
          "published" &&
        isDateRangeActive(
          title.heroStartDate,
          title.heroEndDate,
          now
        )
    );

  const editorialHeroRows =
    heroTitles
      .filter((title) => {
        const hasHeroConfiguration =
          title.featured ||
          title.heroPriority !==
            null ||
          title.featuredRank !==
            null;

        const hasNotEnded =
          title.heroEndDate ===
            null ||
          title.heroEndDate >=
            now;

        return (
          hasHeroConfiguration &&
          hasNotEnded
        );
      })
      .sort((a, b) => {
        const aRank =
          a.featuredRank ??
          Number.MAX_SAFE_INTEGER;

        const bRank =
          b.featuredRank ??
          Number.MAX_SAFE_INTEGER;

        if (
          aRank !== bRank
        ) {
          return (
            aRank - bRank
          );
        }

        return (
          (b.heroPriority ||
            0) -
          (a.heroPriority ||
            0)
        );
      })
      .slice(0, 8)
      .map((title) => ({
        id: title.id,
        title: title.title,

        badge:
          title.heroBadge,

        priority:
          title.heroPriority ||
          0,

        featuredRank:
          title.featuredRank,

        views:
          title.views || 0,

        genre:
          title.genre,

        startsAt:
          title.heroStartDate?.toISOString() ||
          null,

        endsAt:
          title.heroEndDate?.toISOString() ||
          null,
      }));

  return {
    props: {
      activeCollections:
        activeEditorialCollections.length,

      scheduledCollections:
        scheduledEditorialCollections.length,

      totalCollectionItems,

      activeHeroes:
        activeHeroTitles.length,

      collections:
        editorialCollectionRows,

      heroes:
        editorialHeroRows,
    },

    activeEditorialCollections,
    scheduledEditorialCollections,
    activeHeroTitles,
    editorialCollectionRows,
    editorialHeroRows,
    totalCollectionItems,
  };
}