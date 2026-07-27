import type { Prisma } from "@/app/generated/prisma";
import { ContentRouteError } from "../errors";
import {
  optionalCleanString,
  optionalString,
} from "../parsers";

type RequestBody = Record<string, unknown>;

type ContentUpdate =
  Prisma.ProjectSubmissionUpdateInput;

function assignOptionalString(
  data: ContentUpdate,
  body: RequestBody,
  field: keyof ContentUpdate
) {
  const value = optionalString(body[field]);

  if (value !== undefined) {
    data[field] = value as never;
  }
}

function assignOptionalCleanString(
  data: ContentUpdate,
  body: RequestBody,
  field: keyof ContentUpdate
) {
  const value = optionalCleanString(body[field]);

  if (value !== undefined) {
    data[field] = value as never;
  }
}

export function applyBasicFields(
  data: ContentUpdate,
  body: RequestBody
) {
  if (body.title !== undefined) {
    const title = String(body.title).trim();

    if (!title) {
      throw new ContentRouteError({
        error: "Invalid content update",
        message: "Title cannot be empty.",
      });
    }

    data.title = title;
  }

  assignOptionalString(
    data,
    body,
    "description"
  );

  assignOptionalCleanString(
    data,
    body,
    "type"
  );

  assignOptionalCleanString(
    data,
    body,
    "genre"
  );

  assignOptionalCleanString(
    data,
    body,
    "maturityRating"
  );

  assignOptionalCleanString(
    data,
    body,
    "runtime"
  );

  assignOptionalCleanString(
    data,
    body,
    "creatorName"
  );

  assignOptionalCleanString(
    data,
    body,
    "creatorEmail"
  );

  assignOptionalCleanString(
    data,
    body,
    "creatorCompany"
  );

  assignOptionalCleanString(
    data,
    body,
    "titleLogoUrl"
  );
}