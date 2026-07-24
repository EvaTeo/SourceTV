import type {
  PartnerProject,
  ReviewStage,
} from "./types";

export const stageLabels: Record<string, string> = {
  submission: "Submission Received",
  metadata_review: "Metadata Review",
  content_review: "Content Review",
  rights_review: "Rights Review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
  rejected: "Rejected",
};

export const stageOptions = [
  {
    label: "All Statuses",
    value: "all",
  },
  {
    label: "Submission Received",
    value: "submission",
  },
  {
    label: "Metadata Review",
    value: "metadata_review",
  },
  {
    label: "Content Review",
    value: "content_review",
  },
  {
    label: "Rights Review",
    value: "rights_review",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Archived",
    value: "archived",
  },
];

export const reviewStages: {
  value: ReviewStage;
  shortLabel: string;
}[] = [
  {
    value: "submission",
    shortLabel: "Submitted",
  },
  {
    value: "metadata_review",
    shortLabel: "Metadata",
  },
  {
    value: "content_review",
    shortLabel: "Content",
  },
  {
    value: "rights_review",
    shortLabel: "Rights",
  },
  {
    value: "approved",
    shortLabel: "Approved",
  },
  {
    value: "scheduled",
    shortLabel: "Scheduled",
  },
  {
    value: "published",
    shortLabel: "Published",
  },
];

export function stageClass(stage: string) {
  if (stage === "published") {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  }

  if (stage === "scheduled") {
    return "border-violet-300/20 bg-violet-300/10 text-violet-200";
  }

  if (stage === "approved") {
    return "border-sky-300/20 bg-sky-300/10 text-sky-200";
  }

  if (stage === "rejected") {
    return "border-red-300/20 bg-red-300/10 text-red-200";
  }

  if (stage === "rights_review") {
    return "border-yellow-300/20 bg-yellow-300/10 text-yellow-100";
  }

  if (stage === "archived") {
    return "border-white/10 bg-white/[0.03] text-white/35";
  }

  return "border-white/10 bg-white/[0.05] text-white/60";
}

export function formatDate(date?: string | null) {
  if (!date) {
    return null;
  }

  return new Date(date).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function hasAttention(
  project: PartnerProject
) {
  return Boolean(
    project.reviewNotes ||
      project.metadataNotes ||
      project.contentNotes ||
      project.rightsNotes
  );
}

export function getStageIndex(stage: string) {
  if (stage === "rejected" || stage === "archived") {
    return -1;
  }

  return reviewStages.findIndex(
    (item) => item.value === stage
  );
}

export function getRecognition(
  project: PartnerProject
) {
  if (project.recognitionLevel) {
    return project.recognitionLevel;
  }

  if (
    project.featured &&
    project.workflowStage === "published"
  ) {
    return "Featured Selection";
  }

  if (project.workflowStage === "published") {
    return "SourceTV Selection";
  }

  if (project.workflowStage === "approved") {
    return "Selection Pending";
  }

  return "In Review";
}