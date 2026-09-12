import {
  getAnalyticsDates,
  percent,
  type AnalyticsDashboardData,
} from "./helpers";

export function buildAdvertisingMetrics(
  data: AnalyticsDashboardData
) {
  const {
    adCampaigns,
    adImpressions,
  } = data;

  const {
    startOfToday,
    startOfMonth,
  } = getAnalyticsDates();

  const completedAdViews =
    adImpressions.filter(
      (impression) =>
        impression.completed
    );

  const skippedAds =
    adImpressions.filter(
      (impression) =>
        impression.skipped
    );

  const clickedAds =
    adImpressions.filter(
      (impression) =>
        impression.clicked
    );

  const impressionsToday =
    adImpressions.filter(
      (impression) =>
        impression.createdAt >=
        startOfToday
    );

  const impressionsThisMonth =
    adImpressions.filter(
      (impression) =>
        impression.createdAt >=
        startOfMonth
    );

  const totalAdSpendCents =
    adCampaigns.reduce(
      (sum, campaign) =>
        sum +
        (campaign.spentCents ||
          0),
      0
    );

  const totalAdSpend =
    totalAdSpendCents / 100;

  const adRevenue =
    totalAdSpend;

  function revenueFromImpressions(
    items: typeof adImpressions
  ) {
    const cents =
      items.reduce(
        (
          sum,
          impression
        ) =>
          sum +
          (impression.campaign
            ?.cpmCents || 0) /
            1000,
        0
      );

    return cents / 100;
  }

  const revenueToday =
    revenueFromImpressions(
      impressionsToday
    );

  const revenueThisMonth =
    revenueFromImpressions(
      impressionsThisMonth
    );

  const adCtr = percent(
    clickedAds.length,
    adImpressions.length
  );

  const adCompletionRate =
    percent(
      completedAdViews.length,
      adImpressions.length
    );

  const adSkipRate = percent(
    skippedAds.length,
    adImpressions.length
  );

  const averageAdWatchSeconds =
    adImpressions.length > 0
      ? Math.round(
          adImpressions.reduce(
            (
              sum,
              impression
            ) =>
              sum +
              (impression.watchedSeconds ||
                0),
            0
          ) /
            adImpressions.length
        )
      : 0;

  const activeCampaigns =
    adCampaigns.filter(
      (campaign) =>
        campaign.status ===
        "active"
    );

  const campaignRows =
    adCampaigns
      .map((campaign) => {
        const impressions =
          campaign.impressions
            .length;

        const completed =
          campaign.impressions.filter(
            (impression) =>
              impression.completed
          ).length;

        const clicked =
          campaign.impressions.filter(
            (impression) =>
              impression.clicked
          ).length;

        return {
          id: campaign.id,
          name: campaign.name,

          advertiser:
            campaign.advertiser ||
            campaign.adType ||
            "Unknown",

          placement:
            campaign.placement,

          status:
            campaign.status,

          impressions,

          spend:
            campaign.spentCents ||
            0,

          ctr: percent(
            clicked,
            impressions
          ),

          completionRate:
            percent(
              completed,
              impressions
            ),
        };
      })
      .sort(
        (a, b) =>
          b.impressions -
          a.impressions
      )
      .slice(0, 8);

  const placementRows = [
    "pre_roll",
    "mid_roll",
    "post_roll",
    "banner",
  ].map((placement) => ({
    label: placement,

    value:
      adImpressions.filter(
        (impression) =>
          impression.placement ===
          placement
      ).length,
  }));

  return {
    props: {
      totalRevenue:
        adRevenue,

      revenueToday,
      revenueThisMonth,

      totalImpressions:
        adImpressions.length,

      impressionsToday:
        impressionsToday.length,

      impressionsThisMonth:
        impressionsThisMonth.length,

      activeCampaigns:
        activeCampaigns.length,

      completedViews:
        completedAdViews.length,

      skippedAds:
        skippedAds.length,

      clickedAds:
        clickedAds.length,

      ctr: adCtr,

      completionRate:
        adCompletionRate,

      skipRate:
        adSkipRate,

      averageWatchSeconds:
        averageAdWatchSeconds,

      campaignRows,
      placementRows,
    },

    adRevenue,
    totalAdSpend,
    revenueToday,
    revenueThisMonth,
    activeCampaigns,
    completedAdViews,
    skippedAds,
    clickedAds,
    impressionsToday,
    impressionsThisMonth,
    adCtr,
    adCompletionRate,
    adSkipRate,
    averageAdWatchSeconds,
    campaignRows,
    placementRows,
  };
}