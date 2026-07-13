"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { useState } from "react";
import HeroEditor from "./HeroEditor";

export type HeroProject = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  featuredRank?: number | null;
  heroBadge?: string | null;
  heroPriority?: number | null;
  heroStartDate?: string | null;
  heroEndDate?: string | null;
};

type HeroDraft = {
  heroBadge: string;
  heroPriority: string;
  heroStartDate: string;
  heroEndDate: string;
};

type Props = {
  project: HeroProject;
  index: number;
  saving: boolean;
  draft: HeroDraft;
  onDraftChange: (
    key: keyof HeroDraft,
    value: string
  ) => void;
  onSave: () => void;
  onRemove: () => void;
};

function formatDate(date?: string | null) {
  if (!date) return "No Schedule";

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HeroCard({
  project,
  index,
  saving,
  draft,
  onDraftChange,
  onSave,
  onRemove,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const image =
    project.backdropUrl || project.thumbnailUrl || "";

  return (
    <article
      ref={setNodeRef}
      style={style}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] transition hover:border-white/20"
    >
      <div className="grid gap-6 p-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="aspect-video overflow-hidden rounded-2xl bg-white/5">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/30">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  {...attributes}
                  {...listeners}
                  className="cursor-grab text-xl text-white/40 transition hover:text-white active:cursor-grabbing"
                >
                  ☰
                </button>

                <span className="rounded-full bg-sky-300/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
                  Position {index + 1}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-semibold text-white">
                {project.title}
              </h3>

              <p className="mt-2 text-sm text-white/40">
                {[project.type, project.genre]
                  .filter(Boolean)
                  .join(" • ")}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
                <span>
                  Badge:{" "}
                  <strong className="text-white">
                    {draft.heroBadge || "None"}
                  </strong>
                </span>

                <span>
                  Priority:{" "}
                  <strong className="text-white">
                    {draft.heroPriority || "-"}
                  </strong>
                </span>

                <span>
                  {formatDate(draft.heroStartDate)} →{" "}
                  {formatDate(draft.heroEndDate)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {expanded ? "Close" : "Edit"}
              </button>

              <button
                type="button"
                onClick={onRemove}
                disabled={saving}
                className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>

          {expanded && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <HeroEditor
                draft={draft}
                saving={saving}
                onDraftChange={onDraftChange}
                onSave={onSave}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}