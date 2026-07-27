import type { Prisma } from "@/app/generated/prisma";
import {
  isContentStatus,
  isWorkflowStage,
} from "../constants";
import { ContentRouteError } from "../errors";

type RequestBody = Record<string, unknown>;

type ContentUpdate =
  Prisma.ProjectSubmissionUpdateInput;

export function applyWorkflowFields(
  data: ContentUpdate,
  body: RequestBody
) {
  if (body.workflowStage !== undefined) {
    if (!isWorkflowStage(body.workflowStage)) {
      throw new ContentRouteError({
        error: "Invalid workflow stage",
        message: `"${String(
          body.workflowStage
        )}" is not a valid workflow stage.`,
      });
    }

    data.workflowStage = body.workflowStage;
  }

  if (body.status !== undefined) {
    if (!isContentStatus(body.status)) {
      throw new ContentRouteError({
        error: "Invalid content status",
        message: `"${String(
          body.status
        )}" is not a valid content status.`,
      });
    }

    data.status = body.status;
  }
}