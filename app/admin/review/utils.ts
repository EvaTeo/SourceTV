export function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function statusBadgeClass(status: string) {
  if (status === "approved")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (status === "rejected")
    return "border-red-400/40 bg-red-500/12 text-red-200";
  if (status === "private")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";
  if (status === "unlisted")
    return "border-blue-300/40 bg-blue-400/12 text-blue-200";
  if (status === "archived")
    return "border-zinc-400/30 bg-zinc-400/10 text-zinc-200";

  return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
}