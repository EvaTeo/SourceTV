import type { LiveActivityItem } from "../../components/LiveActivity";

import {
  formatLabel,
  formatNumber,
  type AnalyticsDashboardData,
} from "./helpers";

export function buildActivityMetrics(
  data: AnalyticsDashboardData
) {
  const {
    continueWatching,
    users,
    partnerApplications,
    contracts,
    adCampaigns,
    adImpressions,
  } = data;

  const items: LiveActivityItem[] = [
    ...continueWatching
      .slice(0, 12)
      .map((item) => {
        const title =
          item.project?.title ||
          "Unknown title";

        const completed =
          Boolean(
            item.completed
          );

        return {
          id: `playback-${item.id}`,

          type: completed
            ? ("completion" as const)
            : ("watch" as const),

          title: completed
            ? "Title completed"
            : "Playback activity",

          description: completed
            ? `A viewer completed ${title}.`
            : `A viewer continued watching ${title}.`,

          timestamp:
            item.watchedAt.toISOString(),

          href: item.project
            ? `/watch/${item.project.id}`
            : undefined,
        };
      }),

    ...users
      .slice(0, 8)
      .map((account) => ({
        id: `user-${account.id}`,

        type:
          "user" as const,

        title:
          "New SourceTV account",

        description:
          account.email
            ? `${account.email} joined SourceTV.`
            : "A new viewer joined SourceTV.",

        timestamp:
          account.createdAt.toISOString(),

        href:
          "/admin/users",
      })),

    ...partnerApplications
      .slice(0, 8)
      .map(
        (application) => ({
          id: `partner-${application.id}`,

          type:
            "partner" as const,

          title:
            "Partner application",

          description:
            `A partner application is currently ${formatLabel(
              application.status
            ).toLowerCase()}.`,

          timestamp:
            application.createdAt.toISOString(),

          href:
            "/admin/partners",
        })
      ),

    ...contracts
      .slice(0, 8)
      .map((contract) => ({
        id: `contract-${contract.id}`,

        type:
          "contract" as const,

        title:
          "Rights contract updated",

        description:
          contract.project?.title
            ? `${contract.project.title} contract is ${formatLabel(
                contract.status
              ).toLowerCase()}.`
            : `A rights contract is ${formatLabel(
                contract.status
              ).toLowerCase()}.`,

        timestamp:
          contract.updatedAt.toISOString(),

        href:
          "/admin/contracts",
      })),

    ...adCampaigns
      .slice(0, 8)
      .map((campaign) => ({
        id: `campaign-${campaign.id}`,

        type:
          "ad" as const,

        title:
          "Advertising campaign updated",

        description:
          `${campaign.name} is ${formatLabel(
            campaign.status
          ).toLowerCase()} with ${formatNumber(
            campaign.impressions.length
          )} recorded impression${
            campaign
              .impressions
              .length === 1
              ? ""
              : "s"
          }.`,

        timestamp:
          campaign.updatedAt.toISOString(),

        href:
          "/admin/ads",
      })),

    ...adImpressions
      .slice(0, 8)
      .map(
        (impression) => ({
          id: `impression-${impression.id}`,

          type:
            "ad" as const,

          title:
            impression.clicked
              ? "Advertisement clicked"
              : impression.completed
                ? "Advertisement completed"
                : impression.skipped
                  ? "Advertisement skipped"
                  : "Advertisement viewed",

          description:
            impression.campaign
              ?.name
              ? `${impression.campaign.name} recorded a ${formatLabel(
                  impression.placement
                ).toLowerCase()} event.`
              : `A ${formatLabel(
                  impression.placement
                ).toLowerCase()} advertising event was recorded.`,

          timestamp:
            impression.createdAt.toISOString(),

          href:
            "/admin/ads",
        })
      ),
  ]
    .sort(
      (a, b) =>
        new Date(
          b.timestamp
        ).getTime() -
        new Date(
          a.timestamp
        ).getTime()
    )
    .slice(0, 30);

  return {
    props: {
      items,
    },
  };
}