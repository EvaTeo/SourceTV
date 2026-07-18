type WorkflowBadgeProps = {
  stage?: string | null;
};

function stageLabel(stage?: string | null) {
  if (!stage) {
    return "General";
  }

  const labels: Record<string, string> = {
    submission: "Submission Received",
    metadata_review: "Metadata Review",
    content_review: "Content Review",
    rights_review: "Rights Review",
    approved: "Approved",
    scheduled: "Scheduled",
    published: "Published",
    rejected: "Rejected",
    archived: "Archived",
  };

  return labels[stage] || stage.replaceAll("_", " ");
}

function stageBadgeClass(stage?: string | null) {
  if (stage === "published") {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  }

  if (stage === "approved") {
    return "border-sky-300/20 bg-sky-300/10 text-sky-200";
  }

  if (stage === "scheduled") {
    return "border-violet-300/20 bg-violet-300/10 text-violet-200";
  }

  if (stage === "rejected") {
    return "border-red-300/20 bg-red-300/10 text-red-200";
  }

  if (stage === "rights_review") {
    return "border-yellow-300/20 bg-yellow-300/10 text-yellow-100";
  }

  return "border-white/10 bg-white/[0.04] text-white/55";
}

export default function WorkflowBadge({
  stage,
}: WorkflowBadgeProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${stageBadgeClass(
        stage
      )}`}
    >
      {stageLabel(stage)}
    </span>
  );
}