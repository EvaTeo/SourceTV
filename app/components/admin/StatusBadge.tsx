type StatusType =
  | "published"
  | "scheduled"
  | "review"
  | "draft"
  | "archived"
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"
  | string;

export default function StatusBadge({
  status,
}: {
  status: StatusType;
}) {
  const value = status.toLowerCase();

  let classes =
    "bg-white/10 text-white/70";

  if (
    value.includes("published") ||
    value.includes("approved") ||
    value.includes("active")
  ) {
    classes = "bg-emerald-500/15 text-emerald-300";
  }

  if (
    value.includes("review") ||
    value.includes("pending") ||
    value.includes("scheduled")
  ) {
    classes = "bg-amber-500/15 text-amber-300";
  }

  if (
    value.includes("reject") ||
    value.includes("archive") ||
    value.includes("inactive")
  ) {
    classes = "bg-red-500/15 text-red-300";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${classes}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}