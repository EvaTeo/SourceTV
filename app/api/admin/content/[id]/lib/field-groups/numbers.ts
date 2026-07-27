import type { Prisma } from "@/app/generated/prisma";
import { parseOptionalNumber } from "../parsers";

type RequestBody = Record<string, unknown>;

type ContentUpdate =
  Prisma.ProjectSubmissionUpdateInput;

export function applyNumberFields(
  data: ContentUpdate,
  body: RequestBody
) {
  const revenueShare =
    parseOptionalNumber(
      body.revenueShare,
      "Revenue share",
      {
        min: 0,
        max: 100,
        integer: true,
      }
    );

  if (
    revenueShare !== undefined &&
    revenueShare !== null
  ) {
    data.revenueShare = revenueShare;
  }

  const featuredRank =
    parseOptionalNumber(
      body.featuredRank,
      "Featured rank",
      {
        min: 1,
        integer: true,
        nullable: true,
      }
    );

  if (featuredRank !== undefined) {
    data.featuredRank = featuredRank;
  }

  const heroPriority =
    parseOptionalNumber(
      body.heroPriority,
      "Hero priority",
      {
        min: 1,
        integer: true,
        nullable: true,
      }
    );

  if (heroPriority !== undefined) {
    data.heroPriority = heroPriority;
  }
}