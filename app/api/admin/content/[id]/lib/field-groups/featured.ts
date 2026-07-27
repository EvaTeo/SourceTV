import type { Prisma } from "@/app/generated/prisma";
import { optionalCleanString } from "../parsers";

type RequestBody = Record<string, unknown>;

type ContentUpdate =
  Prisma.ProjectSubmissionUpdateInput;

export function applyFeaturedFields(
  data: ContentUpdate,
  body: RequestBody
) {
  if (typeof body.featured === "boolean") {
    data.featured = body.featured;

    if (!body.featured) {
      data.featuredRank = null;
    }
  }

  if (body.heroBadge !== undefined) {
    data.heroBadge =
      optionalCleanString(body.heroBadge);
  }

  if (
    body.recognitionLevel !== undefined
  ) {
    data.recognitionLevel =
      optionalCleanString(
        body.recognitionLevel
      );
  }
}