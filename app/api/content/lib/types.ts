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

export type RawContentItem = ProjectSubmission;

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