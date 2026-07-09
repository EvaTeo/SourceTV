type PartnerMessage = {
  id: string;
  senderTeam: string;
  subject: string;
  body: string;
  isRead?: boolean;
  createdAt: string;
};

type ContentWithMessages = {
  partnerMessages?: PartnerMessage[];
};

export function stageBadgeClass(stage: string) {
  if (stage === "published")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (stage === "rejected")
    return "border-red-400/40 bg-red-500/12 text-red-200";
  if (stage === "archived")
    return "border-zinc-400/30 bg-zinc-400/10 text-zinc-200";
  if (stage === "rights_review")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";
  if (stage === "content_review")
    return "border-blue-300/40 bg-blue-400/12 text-blue-200";
  if (stage === "metadata_review")
    return "border-orange-300/40 bg-orange-400/12 text-orange-200";
  if (stage === "scheduled")
    return "border-sky-300/45 bg-sky-300/12 text-sky-200";
  if (stage === "approved")
    return "border-emerald-300/35 bg-emerald-300/10 text-emerald-200";

  return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
}

export function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function getMessageHistory<T extends ContentWithMessages>(item: T) {
  return [...(item.partnerMessages || [])].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}