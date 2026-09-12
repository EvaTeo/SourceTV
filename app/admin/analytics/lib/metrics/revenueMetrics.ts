import type { AnalyticsDashboardData } from "./helpers";

import type { buildAdvertisingMetrics } from "./advertisingMetrics";

type AdvertisingMetrics =
  ReturnType<
    typeof buildAdvertisingMetrics
  >;

export function buildRevenueMetrics(
  data: AnalyticsDashboardData,
  advertising: AdvertisingMetrics,
  topPartners: [string, number][]
) {
  const {
    contracts,
    titles,
  } = data;

  const signedContracts =
    contracts.filter(
      (contract) =>
        contract.status ===
        "signed"
    );

  const published =
    titles.filter(
      (title) =>
        title.workflowStage ===
        "published"
    );

  const estimatedPartnerShare =
    advertising.adRevenue *
    0.45;

  const estimatedPlatformProfit =
    advertising.adRevenue -
    estimatedPartnerShare;

  return {
    props: {
      adRevenue:
        advertising.adRevenue,

      revenueToday:
        advertising.revenueToday,

      revenueThisMonth:
        advertising.revenueThisMonth,

      estimatedPartnerShare,
      estimatedPlatformProfit,

      totalAdSpend:
        advertising.totalAdSpend,

      activeCampaigns:
        advertising
          .activeCampaigns
          .length,

      totalImpressions:
        data.adImpressions
          .length,

      signedContracts:
        signedContracts.length,

      totalContracts:
        contracts.length,

      publishedTitles:
        published.length,

      totalTitles:
        titles.length,

      placementRows:
        advertising
          .placementRows,

      partnerRows:
        topPartners,
    },

    signedContracts,
    published,
    estimatedPartnerShare,
    estimatedPlatformProfit,
  };
}