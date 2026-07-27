export const workflowOrder = [
  "submission",
  "metadata_review",
  "content_review",
  "rights_review",
  "approved",
  "scheduled",
  "published",
] as const;

export const allowedWorkflowStages = [
  ...workflowOrder,
  "rejected",
  "archived",
] as const;

export const allowedStatuses = [
  "draft",
  "pending",
  "approved",
  "rejected",
  "private",
  "unlisted",
  "archived",
] as const;

export const supportedActions = [
  "move_forward",
  "publish",
  "archive",
  "reject",
  "feature",
  "unfeature",
  "send_message",
] as const;

export type WorkflowStage =
  (typeof allowedWorkflowStages)[number];

export type ContentStatus =
  (typeof allowedStatuses)[number];

export type SupportedAction =
  (typeof supportedActions)[number];

export function isWorkflowStage(
  value: unknown
): value is WorkflowStage {
  return (
    typeof value === "string" &&
    allowedWorkflowStages.includes(
      value as WorkflowStage
    )
  );
}

export function isContentStatus(
  value: unknown
): value is ContentStatus {
  return (
    typeof value === "string" &&
    allowedStatuses.includes(
      value as ContentStatus
    )
  );
}

export function isSupportedAction(
  value: unknown
): value is SupportedAction {
  return (
    typeof value === "string" &&
    supportedActions.includes(
      value as SupportedAction
    )
  );
}