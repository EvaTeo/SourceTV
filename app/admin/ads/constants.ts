import type { AdCampaignForm } from "./types";

export const statuses = [
  "draft",
  "active",
  "paused",
  "ended",
];

export const placementOptions = [
  {
    label: "Pre-roll",
    value: "pre_roll",
  },
  {
    label: "Mid-roll",
    value: "mid_roll",
  },
  {
    label: "Post-roll",
    value: "post_roll",
  },
  {
    label: "Banner",
    value: "banner",
  },
];

export const adTypeOptions = [
  {
    label: "Commercial",
    value: "commercial",
  },
  {
    label: "SourceTV House",
    value: "house",
  },
  {
    label: "Sponsor",
    value: "sponsor",
  },
];

export const objectiveOptions = [
  {
    label: "Awareness",
    value: "awareness",
  },
  {
    label: "Traffic",
    value: "traffic",
  },
  {
    label: "Promotion",
    value: "promotion",
  },
  {
    label: "Branding",
    value: "branding",
  },
];

export const targetOptions = [
  {
    label: "All Content",
    value: "all",
  },
  {
    label: "Movies Only",
    value: "movie",
  },
  {
    label: "Shows Only",
    value: "show",
  },
  {
    label: "Animation Only",
    value: "animation",
  },
  {
    label: "Specific Genres",
    value: "genre",
  },
  {
    label: "Specific Ratings",
    value: "rating",
  },
  {
    label: "Featured Only",
    value: "featured",
  },
  {
    label: "Specific Project",
    value: "project",
  },
];

export const emptyAdCampaignForm: AdCampaignForm = {
  name: "",
  advertiser: "",

  status: "draft",

  adSource: "direct",
  vastTagUrl: "",

  adType: "commercial",
  objective: "awareness",
  placement: "pre_roll",

  videoUrl: "",
  imageUrl: "",
  clickUrl: "",

  skipPolicy: "after_delay",
  skipAfterSeconds: "5",
  premiumCanSkip: true,

  durationSeconds: "30",

  targetType: "all",
  targetGenres: "",
  targetRatings: "",
  targetProjectId: "",

  priority: "1",

  budgetDollars: "0",
  spentDollars: "0",
  cpmDollars: "12",

  maxImpressions: "",

  startDate: "",
  endDate: "",
};