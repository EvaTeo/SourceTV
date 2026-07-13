import type { CollectionForm } from "./types";

export const placementOptions = [
  {
    label: "Browse",
    value: "browse",
  },
  {
    label: "Landing",
    value: "landing",
  },
  {
    label: "Films",
    value: "films",
  },
  {
    label: "Shows",
    value: "shows",
  },
  {
    label: "Animation",
    value: "animation",
  },
  {
    label: "Documentaries",
    value: "documentaries",
  },
];

export const statusOptions = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Hidden",
    value: "hidden",
  },
];

export const emptyCollectionForm: CollectionForm = {
  title: "",
  description: "",
  placement: "browse",
  status: "active",
  sortOrder: 0,
  startsAt: "",
  endsAt: "",
};

export const editorialInputClassName =
  "w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/45 focus:bg-black/35 disabled:cursor-not-allowed disabled:opacity-50";