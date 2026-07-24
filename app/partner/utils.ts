import type {
  PartnerAttentionNote,
  PartnerProject,
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

export const reviewStages = [
  "submission",
  "metadata_review",
  "content_review",
  "rights_review",
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

  return "border-white/10 bg-white/[0.04] text-white/60";
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

export function getAttentionNote(
  project: PartnerProject
): PartnerAttentionNote | null {
  if (project.rightsNotes) {
    return {
      label: "Rights update required",
      note: project.rightsNotes,
    };
  }

  if (project.contentNotes) {
    return {
      label: "Content update required",
      note: project.contentNotes,
    };
  }

  if (project.metadataNotes) {
    return {
      label: "Metadata update required",
      note: project.metadataNotes,
    };
  }

  if (project.reviewNotes) {
    return {
      label: "Review note received",
      note: project.reviewNotes,
    };
  }

  return null;
}