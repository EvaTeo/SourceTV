export function formatDate(date?: string | null) {
  if (!date) return "Not reviewed";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}