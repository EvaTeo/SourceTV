import {
  placementOptions,
} from "./constants";

import type {
  AdCampaign,
  AdCampaignStats,
} from "./types";

export function moneyFromCents(
  cents: number
) {
  return `$${(
    cents / 100
  ).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

export function formatDate(
  date?: string | null
) {
  if (!date) {
    return "Not set";
  }

  return new Date(
    date
  ).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function placementLabel(
  value: string
) {
  return (
    placementOptions.find(
      (placement) =>
        placement.value ===
        value
    )?.label ||
    value.replaceAll(
      "_",
      " "
    )
  );
}

export function toNullableNumber(
  value: string
) {
  if (!value.trim()) {
    return null;
  }

  const number =
    Number(value);

  if (
    Number.isNaN(number) ||
    number < 0
  ) {
    return null;
  }

  return Math.floor(
    number
  );
}

export function statusClass(
  status: string
) {
  if (
    status === "active"
  ) {
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  }

  if (
    status === "paused"
  ) {
    return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
  }

  if (
    status === "ended"
  ) {
    return "border-red-400/40 bg-red-500/12 text-red-200";
  }

  return "border-white/15 bg-white/[0.05] text-white/65";
}

export function getAdCampaignStats(
  campaigns: AdCampaign[]
): AdCampaignStats {
  const impressions =
    campaigns.reduce(
      (sum, campaign) =>
        sum +
        (campaign.impressions
          ?.length || 0),
      0
    );

  const completed =
    campaigns.reduce(
      (sum, campaign) =>
        sum +
        (campaign.impressions?.filter(
          (impression) =>
            impression.completed
        ).length || 0),
      0
    );

  const clicks =
    campaigns.reduce(
      (sum, campaign) =>
        sum +
        (campaign.impressions?.filter(
          (impression) =>
            impression.clicked
        ).length || 0),
      0
    );

  const active =
    campaigns.filter(
      (campaign) =>
        campaign.status ===
        "active"
    ).length;

  return {
    total:
      campaigns.length,

    active,
    impressions,
    completed,
    clicks,
  };
}