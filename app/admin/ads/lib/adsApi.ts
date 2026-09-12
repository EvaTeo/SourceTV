import type {
  AdCampaign,
  AdCampaignForm,
} from "../types";

import { toNullableNumber } from "../utils";

async function readJson(
  response: Response
) {
  return response
    .json()
    .catch(() => null);
}

export async function fetchAdCampaigns(): Promise<
  AdCampaign[]
> {
  const response =
    await fetch(
      "/api/admin/ads",
      {
        cache: "no-store",
      }
    );

  if (
    response.status ===
    403
  ) {
    window.location.href =
      "/login";

    return [];
  }

  const data =
    await readJson(
      response
    );

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Could not load ad campaigns."
    );
  }

  return Array.isArray(data)
    ? data
    : [];
}

export async function createAdCampaign(
  form: AdCampaignForm
) {
  const response =
    await fetch(
      "/api/admin/ads",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name:
            form.name,

          advertiser:
            form.advertiser,

          status:
            form.status,

          adSource:
            form.adSource,

          vastTagUrl:
            form.vastTagUrl,

          adType:
            form.adType,

          objective:
            form.objective,

          placement:
            form.placement,

          videoUrl:
            form.videoUrl,

          imageUrl:
            form.imageUrl,

          clickUrl:
            form.clickUrl,

          skipPolicy:
            form.skipPolicy,

          skipAfterSeconds:
            Number(
              form.skipAfterSeconds ||
                5
            ),

          premiumCanSkip:
            form.premiumCanSkip,

          durationSeconds:
            Number(
              form.durationSeconds ||
                30
            ),

          targetType:
            form.targetType,

          targetGenres:
            form.targetGenres,

          targetRatings:
            form.targetRatings,

          targetProjectId:
            form.targetProjectId,

          priority:
            Number(
              form.priority ||
                1
            ),

          budgetCents:
            Math.round(
              Number(
                form.budgetDollars ||
                  0
              ) * 100
            ),

          spentCents:
            Math.round(
              Number(
                form.spentDollars ||
                  0
              ) * 100
            ),

          cpmCents:
            Math.round(
              Number(
                form.cpmDollars ||
                  12
              ) * 100
            ),

          maxImpressions:
            toNullableNumber(
              form.maxImpressions
            ),

          startDate:
            form.startDate ||
            null,

          endDate:
            form.endDate ||
            null,
        }),
      }
    );

  const data =
    await readJson(
      response
    );

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Could not create ad campaign."
    );
  }

  return data;
}

export async function updateAdCampaignStatus(
  campaignId: string,
  status: string
) {
  const response =
    await fetch(
      "/api/admin/ads",
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          campaignId,
          status,
        }),
      }
    );

  const data =
    await readJson(
      response
    );

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Could not update ad campaign."
    );
  }

  return data;
}