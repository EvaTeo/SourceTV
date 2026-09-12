import type { getAnalyticsDashboard } from "./analyticsRepository";

import { buildActivityMetrics } from "./metrics/activityMetrics";
import { buildAdvertisingMetrics } from "./metrics/advertisingMetrics";
import { buildAIInsights } from "./metrics/aiInsights";
import { buildAudienceMetrics } from "./metrics/audienceMetrics";
import { buildEditorialMetrics } from "./metrics/editorialMetrics";
import { buildOverviewMetrics } from "./metrics/overviewMetrics";
import { buildRevenueMetrics } from "./metrics/revenueMetrics";
import { topEntries } from "./metrics/helpers";

type AnalyticsDashboardData =
  Awaited<ReturnType<typeof getAnalyticsDashboard>>;

export function buildAnalyticsMetrics(
  data: AnalyticsDashboardData
) {
  const audience =
    buildAudienceMetrics(data);

  const advertising =
    buildAdvertisingMetrics(data);

  const topPartners =
    topEntries(
      data.titles.reduce(
        (
          map: Record<
            string,
            number
          >,
          title
        ) => {
          const partner =
            title.creatorName ||
            title.creatorEmail ||
            "Unknown";

          map[partner] =
            (map[partner] || 0) +
            1;

          return map;
        },
        {}
      )
    );

  const revenue =
    buildRevenueMetrics(
      data,
      advertising,
      topPartners
    );

  const overview =
    buildOverviewMetrics(
      data,
      audience,
      advertising,
      revenue
    );

  const editorial =
    buildEditorialMetrics(data);

  const activity =
    buildActivityMetrics(data);

  const ai =
    buildAIInsights(
      overview,
      audience,
      advertising,
      editorial,
      revenue
    );

  return {
    overview:
      overview.props,

    editorial:
      editorial.props,

    audience:
      audience.props,

    advertising:
      advertising.props,

    revenue:
      revenue.props,

    activity:
      activity.props,

    ai:
      ai.props,
  };
}