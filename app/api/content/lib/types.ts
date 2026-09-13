import type { ProjectSubmission } from "@/app/generated/prisma";

export type ContentMode =
  | "all"
  | "trending"
  | "featured"
  | "new"
  | "editor_picks"
  | "genre"
  | "type"
  | "creator"
  | "because_you_watched"
  | "hidden_gems"
  | "recommended";

export type ContentQuery = {
  mode: ContentMode;
  type: string | null;
  genre: string | null;
  creatorName: string | null;
  excludeId: string | null;
  limit: number;
};

export type RawContentItem =
  ProjectSubmission;

/**
 * Minimum database shape required by
 * selectPublicContent().
 *
 * Full ProjectSubmission records satisfy this type,
 * while browse can request only these viewer-facing
 * and ranking fields.
 */
export type ContentSelectableItem = Pick<
  ProjectSubmission,
  | "id"
  | "title"
  | "description"
  | "type"
  | "genre"
  | "videoUrl"
  | "mainVideoUrl"
  | "trailerUrl"
  | "thumbnailUrl"
  | "backdropUrl"
  | "titleLogoUrl"
  | "status"
  | "views"
  | "year"
  | "maturityRating"
  | "runtime"
  | "creatorName"
  | "scheduledAt"
  | "createdAt"
  | "publishedAt"
  | "editorPick"
  | "featured"
  | "featuredRank"
  | "heroPriority"
  | "heroStartDate"
  | "heroEndDate"
>;

export type PublicContentItem = Omit<
  ProjectSubmission,
  | "description"
  | "type"
  | "genre"
  | "thumbnailUrl"
  | "backdropUrl"
  | "trailerUrl"
  | "creatorName"
> & {
  description: string;
  type: string;
  genre: string;
  thumbnailUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  creatorName: string;
};