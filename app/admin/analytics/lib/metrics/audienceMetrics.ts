import {
  addSignal,
  getAnalyticsDates,
  percent,
  topEntries,
  type AnalyticsDashboardData,
} from "./helpers";

export function buildAudienceMetrics(
  data: AnalyticsDashboardData
) {
  const {
    users,
    profiles,
    continueWatching,
    watchlist,
    reactions,
  } = data;

  const {
    startOfToday,
    startOfMonth,
  } = getAnalyticsDates();

  const watchEventsToday =
    continueWatching.filter(
      (item) =>
        item.watchedAt >=
        startOfToday
    );

  const newUsersThisMonth =
    users.filter(
      (item) =>
        item.createdAt >=
        startOfMonth
    );

  const totalWatchSeconds =
    continueWatching.reduce(
      (sum, item) =>
        sum +
        Math.max(
          item.currentTime || 0,
          0
        ),
      0
    );

  const totalWatchHours =
    totalWatchSeconds > 0
      ? Math.round(
          (totalWatchSeconds /
            3600) *
            10
        ) / 10
      : 0;

  const completedTitles =
    continueWatching.filter(
      (item) =>
        item.completed
    );

  const completionRate =
    percent(
      completedTitles.length,
      continueWatching.length
    );

  const likedReactions =
    reactions.filter(
      (reaction) =>
        reaction.liked
    );

  const dislikedReactions =
    reactions.filter(
      (reaction) =>
        reaction.disliked
    );

  const genreSignals: Record<
    string,
    number
  > = {};

  const typeSignals: Record<
    string,
    number
  > = {};

  for (const item of continueWatching) {
    addSignal(
      genreSignals,
      item.project?.genre ||
        "Uncategorized",
      item.completed ? 4 : 3
    );

    addSignal(
      typeSignals,
      item.project?.type ||
        "Unknown",
      item.completed ? 4 : 3
    );
  }

  for (const item of watchlist) {
    addSignal(
      genreSignals,
      item.project?.genre ||
        "Uncategorized",
      1
    );

    addSignal(
      typeSignals,
      item.project?.type ||
        "Unknown",
      1
    );
  }

  for (const reaction of likedReactions) {
    addSignal(
      genreSignals,
      reaction.project?.genre ||
        "Uncategorized",
      2
    );

    addSignal(
      typeSignals,
      reaction.project?.type ||
        "Unknown",
      2
    );
  }

  const topGenres =
    topEntries(genreSignals);

  const topTypes =
    topEntries(typeSignals);

  const topWatchlistTitles =
    topEntries(
      watchlist.reduce(
        (
          map: Record<
            string,
            number
          >,
          item
        ) => {
          const title =
            item.project?.title ||
            "Unknown Title";

          map[title] =
            (map[title] || 0) + 1;

          return map;
        },
        {}
      )
    );

  const topLikedTitles =
    topEntries(
      likedReactions.reduce(
        (
          map: Record<
            string,
            number
          >,
          reaction
        ) => {
          const title =
            reaction.project?.title ||
            "Unknown Title";

          map[title] =
            (map[title] || 0) + 1;

          return map;
        },
        {}
      )
    );

  return {
    props: {
      totalUsers:
        users.length,

      totalProfiles:
        profiles.length,

      newUsersThisMonth:
        newUsersThisMonth.length,

      continueWatchingCount:
        continueWatching.length,

      completedTitlesCount:
        completedTitles.length,

      watchlistCount:
        watchlist.length,

      likesCount:
        likedReactions.length,

      watchEventsToday:
        watchEventsToday.length,

      completionRate,
      totalWatchHours,
      topGenres,
      topTypes,
      topWatchlistTitles,
      topLikedTitles,
    },

    completedTitles,
    likedReactions,
    dislikedReactions,
    watchEventsToday,
    newUsersThisMonth,
    completionRate,
    totalWatchHours,
    topGenres,
    topTypes,
    topWatchlistTitles,
    topLikedTitles,
  };
}