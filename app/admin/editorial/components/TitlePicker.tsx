"use client";

import SearchInput from "@/app/components/admin/SearchInput";
import type { Project } from "../types";
import EmptyState from "./EmptyState";

export default function TitlePicker({
  projects,
  search,
  saving,
  onSearchChange,
  onAdd,
}: {
  projects: Project[];
  search: string;
  saving: boolean;
  onSearchChange: (value: string) => void;
  onAdd: (projectId: string) => void;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="Search the content library..."
      />

      <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
        {projects.length === 0 ? (
          <EmptyState
            compact
            title="No available titles"
            description="Every matching title may already be assigned to this collection."
          />
        ) : (
          projects.map((project) => {
            const imageUrl =
              project.thumbnailUrl ||
              project.backdropUrl ||
              "";

            return (
              <div
                key={project.id}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"
              >
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-white/[0.05]">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {project.title}
                  </p>

                  <p className="mt-1 text-xs text-white/35">
                    {[project.type, project.genre]
                      .filter(Boolean)
                      .join(" • ") || "SourceTV title"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => onAdd(project.id)}
                  className="rounded-xl bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/65 transition hover:bg-sky-300 hover:text-[#05070d] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}