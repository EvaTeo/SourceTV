import type {
  CollectionForm,
  EditorialCollection,
} from "./types";

export function toDateInput(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function collectionToForm(
  collection: EditorialCollection
): CollectionForm {
  return {
    title: collection.title,
    description: collection.description || "",
    placement: collection.placement || "browse",
    status: collection.status || "draft",
    sortOrder: collection.sortOrder || 0,
    startsAt: toDateInput(collection.startsAt),
    endsAt: toDateInput(collection.endsAt),
  };
}

export function formatCollectionDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getCollectionSchedule(
  collection: EditorialCollection
) {
  const start = formatCollectionDate(collection.startsAt);
  const end = formatCollectionDate(collection.endsAt);

  if (start && end) {
    return `${start} – ${end}`;
  }

  if (start) {
    return `Starts ${start}`;
  }

  if (end) {
    return `Ends ${end}`;
  }

  return null;
}

export function getStatusClassName(status: string) {
  if (status === "active") {
    return "bg-emerald-400/10 text-emerald-300";
  }

  if (status === "draft") {
    return "bg-amber-400/10 text-amber-300";
  }

  return "bg-white/[0.06] text-white/40";
}