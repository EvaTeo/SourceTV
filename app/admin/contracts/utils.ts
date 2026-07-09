export function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function statusClass(status: string) {
  if (status === "signed")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";

  if (status === "sent")
    return "border-sky-300/40 bg-sky-300/12 text-sky-200";

  if (status === "viewed")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";

  if (status === "changes_requested")
    return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";

  if (status === "cancelled" || status === "expired")
    return "border-red-400/40 bg-red-500/12 text-red-200";

  return "border-white/15 bg-white/[0.05] text-white/65";
}

export function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function needsAction(status: string) {
  return (
    status === "draft" ||
    status === "changes_requested"
  );
}