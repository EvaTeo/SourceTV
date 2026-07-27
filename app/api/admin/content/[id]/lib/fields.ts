import type {
  Prisma,
  ProjectSubmission,
} from "@/app/generated/prisma";
import { applyBasicFields } from "./field-groups/basic";
import { applyDateFields } from "./field-groups/dates";
import { applyFeaturedFields } from "./field-groups/featured";
import { applyNotesFields } from "./field-groups/notes";
import { applyNumberFields } from "./field-groups/numbers";
import { applyRightsFields } from "./field-groups/rights";
import { applyWorkflowFields } from "./field-groups/workflow";

type RequestBody = Record<string, unknown>;

type ContentUpdate =
  Prisma.ProjectSubmissionUpdateInput;

export function buildFieldUpdate(
  existing: ProjectSubmission,
  body: RequestBody
): ContentUpdate {
  const data: ContentUpdate = {};

  applyBasicFields(data, body);
  applyRightsFields(data, body);
  applyNotesFields(data, body);
  applyWorkflowFields(data, body);
  applyNumberFields(data, body);
  applyFeaturedFields(data, body);
  applyDateFields(
    data,
    existing,
    body
  );

  return data;
}