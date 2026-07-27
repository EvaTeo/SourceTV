import type { Prisma } from "@/app/generated/prisma";
import { optionalCleanString } from "../parsers";

type RequestBody = Record<string, unknown>;

type ContentUpdate =
  Prisma.ProjectSubmissionUpdateInput;

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

export function applyRightsFields(
  data: ContentUpdate,
  body: RequestBody
) {
  assignOptionalCleanString(
    data,
    body,
    "rightsOwner"
  );

  assignOptionalCleanString(
    data,
    body,
    "rightsContact"
  );

  assignOptionalCleanString(
    data,
    body,
    "licenseType"
  );

  assignOptionalCleanString(
    data,
    body,
    "territories"
  );

  assignOptionalCleanString(
    data,
    body,
    "exclusivity"
  );
}