import type { AIInsight } from "../../components/AIInsights";

import { percent } from "./helpers";

import type { buildAudienceMetrics } from "./audienceMetrics";
import type { buildAdvertisingMetrics } from "./advertisingMetrics";
import type { buildEditorialMetrics } from "./editorialMetrics";
import type { buildOverviewMetrics } from "./overviewMetrics";
import type { buildRevenueMetrics } from "./revenueMetrics";

type OverviewMetrics =
  ReturnType<
    typeof buildOverviewMetrics
  >;

type AudienceMetrics =
  ReturnType<
    typeof buildAudienceMetrics
  >;

type AdvertisingMetrics =
  ReturnType<
    typeof buildAdvertisingMetrics
  >;

type EditorialMetrics =
  ReturnType<
    typeof buildEditorialMetrics
  >;

type RevenueMetrics =
  ReturnType<
    typeof buildRevenueMetrics
  >;

export function buildAIInsights(
  overview: OverviewMetrics,
  audience: AudienceMetrics,
  advertising: AdvertisingMetrics,
  editorial: EditorialMetrics,
  revenue: RevenueMetrics
) {
  const insights: AIInsight[] =
    [];

  const {
    totalTitles,
    totalViews,
    published,
    scheduled,
    inReview,
    pendingPartners,
    mostViewed,
  } = overview;

  if (
    audience.props
      .continueWatchingCount >=
      3 &&
    audience.completionRate <
      50
  ) {
    insights.push({
      id: "audience-completion-rate",
      category: "audience",

      priority:
        audience.completionRate <
        25
          ? "high"
          : "medium",

      title:
        "Viewer completion is below target",

      description: `${audience.completionRate}% of recorded viewing activity reaches completion. Review the strongest exit points, title runtimes, and homepage positioning to improve session completion.`,

      actionLabel:
        "Review Audience",

      actionHref:
        "/admin/analytics",
    });
  }

  if (
    audience.props
      .continueWatchingCount >=
      3 &&
    audience.completionRate >=
      70
  ) {
    insights.push({
      id: "audience-completion-strength",
      category: "audience",
      priority: "low",

      title:
        "Viewer completion is performing well",

      description: `${audience.completionRate}% of recorded viewing activity reaches completion. The strongest completed titles may be useful models for future acquisitions and editorial placement.`,

      actionLabel:
        "Review Audience",

      actionHref:
        "/admin/analytics",
    });
  }

  if (
    pendingPartners.length >
    0
  ) {
    insights.push({
      id: "editorial-partner-review",
      category: "editorial",

      priority:
        pendingPartners.length >=
        5
          ? "high"
          : "medium",

      title:
        "Partner applications are waiting",

      description: `${pendingPartners.length} partner application${
        pendingPartners.length ===
        1
          ? " is"
          : "s are"
      } still pending review. Clearing the queue can prevent delays in content acquisition and partner onboarding.`,

      actionLabel:
        "Review Partners",

      actionHref:
        "/admin/partners",
    });
  }

  if (inReview.length > 0) {
    insights.push({
      id: "editorial-content-review",
      category: "editorial",

      priority:
        inReview.length >= 8
          ? "high"
          : "medium",

      title:
        "Titles are waiting in review",

      description: `${inReview.length} title${
        inReview.length === 1
          ? " is"
          : "s are"
      } currently moving through metadata, content, or rights review. Prioritize the oldest submissions to keep the publishing pipeline moving.`,

      actionLabel:
        "Open Content Review",

      actionHref:
        "/admin/review",
    });
  }

  if (scheduled.length > 0) {
    insights.push({
      id: "editorial-scheduled-titles",
      category: "editorial",
      priority: "low",

      title:
        "Scheduled titles need programming support",

      description: `${scheduled.length} title${
        scheduled.length === 1
          ? " is"
          : "s are"
      } scheduled for release. Confirm hero placement, curated collections, and supporting homepage rows before publication.`,

      actionLabel:
        "Open Editorial",

      actionHref:
        "/admin/editorial",
    });
  }

  if (
    published.length > 0 &&
    editorial
      .activeEditorialCollections
      .length === 0
  ) {
    insights.push({
      id: "editorial-no-active-collections",
      category: "editorial",
      priority: "high",

      title:
        "No editorial collections are active",

      description: `${published.length} published title${
        published.length === 1
          ? " is"
          : "s are"
      } available, but no editorial collection is currently active. Build homepage rows so viewers can discover the catalog.`,

      actionLabel:
        "Open Editorial",

      actionHref:
        "/admin/editorial",
    });
  }

  if (
    published.length > 0 &&
    editorial.activeHeroTitles
      .length === 0
  ) {
    insights.push({
      id: "editorial-no-active-heroes",
      category: "editorial",
      priority: "medium",

      title:
        "No published hero title is active",

      description:
        "The homepage hero rotation does not currently contain an active published title. Feature at least one title and confirm its hero schedule.",

      actionLabel:
        "Manage Heroes",

      actionHref:
        "/admin/editorial",
    });
  }

  const emptyActiveCollections =
    editorial
      .activeEditorialCollections
      .filter(
        (collection) =>
          collection.items
            .length === 0
      );

  if (
    emptyActiveCollections.length >
    0
  ) {
    insights.push({
      id: "editorial-empty-collections",
      category: "editorial",
      priority: "medium",

      title:
        "Active collections are empty",

      description: `${emptyActiveCollections.length} active collection${
        emptyActiveCollections.length ===
        1
          ? " has"
          : "s have"
      } no assigned titles. Add content or move the collection back to draft before it appears on the homepage.`,

      actionLabel:
        "Review Collections",

      actionHref:
        "/admin/editorial",
    });
  }

  if (
    totalTitles > 0 &&
    published.length /
      totalTitles <
      0.6
  ) {
    const unpublishedCount =
      totalTitles -
      published.length;

    insights.push({
      id: "catalog-published-share",
      category: "catalog",

      priority:
        published.length /
          totalTitles <
        0.35
          ? "high"
          : "medium",

      title:
        "A large share of the catalog is not live",

      description: `${published.length} of ${totalTitles} titles are currently published, leaving ${unpublishedCount} outside the live catalog. Review stalled, scheduled, archived, and rejected titles for possible next actions.`,

      actionLabel:
        "Review Catalog",

      actionHref:
        "/admin/content",
    });
  }

  if (totalTitles === 0) {
    insights.push({
      id: "catalog-empty",
      category: "catalog",
      priority: "high",

      title:
        "The catalog is empty",

      description:
        "SourceTV does not currently have any submitted titles. Add or approve content before preparing the public catalog for launch.",

      actionLabel:
        "Add Content",

      actionHref:
        "/admin/upload",
    });
  }

  if (
    totalTitles > 0 &&
    totalViews === 0
  ) {
    insights.push({
      id: "catalog-no-views",
      category: "catalog",
      priority: "medium",

      title:
        "The catalog has no recorded views",

      description:
        "Titles exist in SourceTV, but no title views have been recorded. Verify that view tracking is connected to playback and title-page activity.",

      actionLabel:
        "Review Content",

      actionHref:
        "/admin/content",
    });
  }

  if (
    mostViewed &&
    totalViews > 0 &&
    (mostViewed.views || 0) /
      totalViews >=
      0.5
  ) {
    insights.push({
      id: "catalog-view-concentration",
      category: "catalog",
      priority: "medium",

      title:
        "Views are concentrated in one title",

      description: `${mostViewed.title} accounts for ${percent(
        mostViewed.views || 0,
        totalViews
      )}% of recorded title views. Consider promoting additional titles to create a healthier distribution of audience attention.`,

      actionLabel:
        "Open Editorial",

      actionHref:
        "/admin/editorial",
    });
  }

  if (
    advertising.props
      .campaignRows.length ===
      0
  ) {
    insights.push({
      id: "advertising-no-campaigns",
      category: "advertising",
      priority: "high",

      title:
        "No advertising campaigns exist",

      description:
        "SourceTV has no advertising campaigns configured. Create at least one campaign before testing ad-supported playback and revenue reporting.",

      actionLabel:
        "Create Campaign",

      actionHref:
        "/admin/ads",
    });
  } else if (
    advertising.activeCampaigns
      .length === 0
  ) {
    insights.push({
      id: "advertising-no-active-campaigns",
      category: "advertising",
      priority: "high",

      title:
        "No advertising campaigns are active",

      description:
        "Advertising campaigns exist, but none are currently active. Review campaign status, scheduling, budget, and creative delivery.",

      actionLabel:
        "Open Advertising",

      actionHref:
        "/admin/ads",
    });
  }

  if (
    advertising.props
      .totalImpressions >=
      10 &&
    advertising.adCompletionRate <
      50
  ) {
    insights.push({
      id: "advertising-completion-rate",
      category: "advertising",

      priority:
        advertising.adCompletionRate <
        25
          ? "high"
          : "medium",

      title:
        "Ad completion is below target",

      description: `${advertising.adCompletionRate}% of recorded ad impressions are completed, while ${advertising.adSkipRate}% are skipped. Review creative length, skip timing, playback reliability, and placement strategy.`,

      actionLabel:
        "Review Advertising",

      actionHref:
        "/admin/ads",
    });
  }

  if (
    advertising.props
      .totalImpressions >=
      10 &&
    advertising.adCtr < 1
  ) {
    insights.push({
      id: "advertising-low-ctr",
      category: "advertising",
      priority: "medium",

      title:
        "Advertising click-through is low",

      description: `The current click-through rate is ${advertising.adCtr}%. Review calls to action, creative relevance, click destinations, and campaign targeting.`,

      actionLabel:
        "Review Campaigns",

      actionHref:
        "/admin/ads",
    });
  }

  if (
    advertising.activeCampaigns
      .length > 0 &&
    advertising.props
      .totalImpressions === 0
  ) {
    insights.push({
      id: "advertising-no-delivery",
      category: "advertising",
      priority: "high",

      title:
        "Active campaigns are not delivering",

      description: `${advertising.activeCampaigns.length} active campaign${
        advertising.activeCampaigns.length ===
        1
          ? " has"
          : "s have"
      } no recorded impressions. Verify ad eligibility, placement toggles, campaign dates, and impression tracking.`,

      actionLabel:
        "Check Ad Delivery",

      actionHref:
        "/admin/ads",
    });
  }

  if (
    published.length > 0 &&
    advertising.adRevenue === 0
  ) {
    insights.push({
      id: "revenue-no-ad-revenue",
      category: "revenue",

      priority:
        advertising
          .activeCampaigns
          .length > 0
          ? "high"
          : "medium",

      title:
        "The live catalog is not generating ad revenue",

      description: `${published.length} published title${
        published.length === 1
          ? " is"
          : "s are"
      } available, but no advertising revenue has been recorded. Confirm campaign delivery and revenue tracking before launch.`,

      actionLabel:
        "Open Revenue",

      actionHref:
        "/admin/revenue",
    });
  }

  if (
    advertising.adRevenue >
      0 &&
    revenue.estimatedPlatformProfit <=
      0
  ) {
    insights.push({
      id: "revenue-platform-margin",
      category: "revenue",
      priority: "high",

      title:
        "Estimated platform margin is not positive",

      description:
        "Estimated partner obligations consume all recorded advertising revenue. Review revenue-share assumptions, campaign pricing, and platform costs.",

      actionLabel:
        "Review Revenue",

      actionHref:
        "/admin/revenue",
    });
  }

  if (
    revenue.props
      .totalContracts > 0 &&
    revenue.signedContracts
      .length === 0
  ) {
    insights.push({
      id: "revenue-no-signed-contracts",
      category: "revenue",
      priority: "medium",

      title:
        "No rights contracts are signed",

      description: `${revenue.props.totalContracts} contract${
        revenue.props.totalContracts ===
        1
          ? " exists"
          : "s exist"
      }, but none are signed. Rights and payout reporting may remain incomplete until contracts are finalized.`,

      actionLabel:
        "Review Contracts",

      actionHref:
        "/admin/contracts",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "platform-no-critical-issues",
      category: "editorial",
      priority: "low",

      title:
        "No major analytics risks detected",

      description:
        "Current catalog, audience, advertising, and revenue signals do not trigger a priority recommendation. Continue monitoring activity as more platform data is collected.",

      actionLabel:
        "Open Overview",

      actionHref:
        "/admin/analytics",
    });
  }

  return {
    props: {
      insights,
    },
  };
}