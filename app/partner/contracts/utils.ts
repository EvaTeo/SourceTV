import type { PartnerContract } from "./types";

export function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function statusClass(status: string) {
  if (status === "signed") {
    return "border-emerald-300/35 bg-emerald-300/10 text-emerald-200";
  }

  if (status === "sent") {
    return "border-sky-300/35 bg-sky-300/10 text-sky-200";
  }

  if (status === "viewed") {
    return "border-purple-300/35 bg-purple-300/10 text-purple-200";
  }

  if (status === "changes_requested") {
    return "border-yellow-300/35 bg-yellow-300/10 text-yellow-100";
  }

  if (status === "cancelled" || status === "expired") {
    return "border-red-300/35 bg-red-300/10 text-red-200";
  }

  return "border-white/10 bg-white/[0.035] text-white/60";
}

export function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export function needsAction(contract: PartnerContract) {
  return (
    contract.status === "sent" ||
    contract.status === "viewed"
  );
}