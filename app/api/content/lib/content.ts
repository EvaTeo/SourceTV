import type {
  ContentQuery,
  ContentSelectableItem,
} from "./types";

function shuffle<T>(items: T[]) {
  const result = [...items];

  for (
    let index = result.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1)
    );

    [
      result[index],
      result[randomIndex],
    ] = [
      result[randomIndex],
      result[index],
    ];
  }

  return result;
}

function cleanContentItem<
  T extends ContentSelectableItem,
>(item: T) {
  return {
    ...item,
    description:
      item.description || "",
    type: item.type || "",
    genre: item.genre || "",
    thumbnailUrl:
      item.thumbnailUrl || "",
    backdropUrl:
      item.backdropUrl || "",
    trailerUrl:
      item.trailerUrl || "",
    creatorName:
      item.creatorName || "",
  };
}

function matches(
  value:
    | string
    | null
    | undefined,
  target: string | null
) {
  return Boolean(
    target &&
      value?.toLowerCase() ===
        target.toLowerCase()
  );
}

function getPublishedTime(
  item: ContentSelectableItem
) {
  return new Date(
    item.publishedAt ||
      item.createdAt
  ).getTime();
}

function filterFeaturedContent<
  T extends ContentSelectableItem,
>(
  content: T[],
  currentTime: number
) {
  return content
    .filter((item) => {
      if (!item.featured) {
        return false;
      }

      const startsAt =
        item.heroStartDate
          ? new Date(
              item.heroStartDate
            ).getTime()
          : null;

      const endsAt =
        item.heroEndDate
          ? new Date(
              item.heroEndDate
            ).getTime()
          : null;

      if (
        (startsAt !== null &&
          Number.isNaN(
            startsAt
          )) ||
        (endsAt !== null &&
          Number.isNaN(
            endsAt
          ))
      ) {
        return false;
      }

      return (
        (startsAt === null ||
          startsAt <=
            currentTime) &&
        (endsAt === null ||
          endsAt >= currentTime)
      );
    })
    .sort((a, b) => {
      const aPriority =
        typeof a.heroPriority ===
        "number"
          ? a.heroPriority
          : typeof a.featuredRank ===
              "number"
            ? a.featuredRank
            : 999;

      const bPriority =
        typeof b.heroPriority ===
        "number"
          ? b.heroPriority
          : typeof b.featuredRank ===
              "number"
            ? b.featuredRank
            : 999;

      if (
        aPriority !== bPriority
      ) {
        return (
          aPriority -
          bPriority
        );
      }

      return (
        getPublishedTime(b) -
        getPublishedTime(a)
      );
    });
}

function scoreRecommendation(
  item: ContentSelectableItem
) {
  return (
    (item.featured ? 5 : 0) +
    (item.editorPick ? 4 : 0) +
    Math.min(
      item.views || 0,
      1000
    ) /
      100
  );
}

function scoreRelatedContent(
  item: ContentSelectableItem,
  query: ContentQuery
) {
  let score = 0;

  if (
    matches(
      item.genre,
      query.genre
    )
  ) {
    score += 4;
  }

  if (
    matches(
      item.type,
      query.type
    )
  ) {
    score += 2;
  }

  if (
    matches(
      item.creatorName,
      query.creatorName
    )
  ) {
    score += 3;
  }

  return score;
}

export function selectPublicContent<
  T extends ContentSelectableItem,
>(
  content: T[],
  query: ContentQuery,
  now: Date
) {
  const cleanContent = content
    .filter(
      (item) =>
        item.id !==
        query.excludeId
    )
    .map(cleanContentItem);

  let result = cleanContent;

  if (
    query.mode ===
    "trending"
  ) {
    result = [
      ...cleanContent,
    ].sort(
      (a, b) =>
        (b.views || 0) -
        (a.views || 0)
    );
  }

  if (
    query.mode ===
    "featured"
  ) {
    result =
      filterFeaturedContent(
        cleanContent,
        now.getTime()
      );
  }

  if (
    query.mode === "new"
  ) {
    result = [
      ...cleanContent,
    ].sort(
      (a, b) =>
        getPublishedTime(b) -
        getPublishedTime(a)
    );
  }

  if (
    query.mode ===
    "editor_picks"
  ) {
    result =
      cleanContent.filter(
        (item) =>
          item.editorPick
      );
  }

  if (
    query.mode ===
      "genre" &&
    query.genre
  ) {
    result =
      cleanContent.filter(
        (item) =>
          matches(
            item.genre,
            query.genre
          )
      );
  }

  if (
    query.mode ===
      "type" &&
    query.type
  ) {
    result =
      cleanContent.filter(
        (item) =>
          matches(
            item.type,
            query.type
          )
      );
  }

  if (
    query.mode ===
      "creator" &&
    query.creatorName
  ) {
    result =
      cleanContent.filter(
        (item) =>
          matches(
            item.creatorName,
            query.creatorName
          )
      );
  }

  if (
    query.mode ===
    "because_you_watched"
  ) {
    result = cleanContent
      .filter(
        (item) =>
          matches(
            item.type,
            query.type
          ) ||
          matches(
            item.genre,
            query.genre
          ) ||
          matches(
            item.creatorName,
            query.creatorName
          )
      )
      .sort(
        (a, b) =>
          scoreRelatedContent(
            b,
            query
          ) -
          scoreRelatedContent(
            a,
            query
          )
      );
  }

  if (
    query.mode ===
    "hidden_gems"
  ) {
    result = cleanContent
      .filter(
        (item) =>
          !item.featured
      )
      .sort(
        (a, b) =>
          (a.views || 0) -
          (b.views || 0)
      );
  }

  if (
    query.mode ===
    "recommended"
  ) {
    result = shuffle(
      cleanContent
    ).sort(
      (a, b) =>
        scoreRecommendation(
          b
        ) -
        scoreRecommendation(
          a
        )
    );
  }

  return result.slice(
    0,
    query.limit
  );
}