import type { Prisma } from "@/app/generated/prisma";
import { optionalString } from "../parsers";

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

export function applyNotesFields(
  data: ContentUpdate,
  body: RequestBody
) {
  assignOptionalString(
    data,
    body,
    "metadataNotes"
  );

  assignOptionalString(
    data,
    body,
    "contentNotes"
  );

  assignOptionalString(
    data,
    body,
    "rightsNotes"
  );

  assignOptionalString(
    data,
    body,
    "reviewNotes"
  );
}