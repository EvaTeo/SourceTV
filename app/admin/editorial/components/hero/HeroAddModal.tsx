"use client";

import SearchInput from "@/app/components/admin/SearchInput";
import type { HeroProject } from "./HeroCard";

type Props = {
  open: boolean;
  projects: HeroProject[];
  search: string;
  savingId: string | null;
  onSearchChange: (value: string) => void;
  onAdd: (project: HeroProject) => void;
  onClose: () => void;
};

export default function HeroAddModal({
  open,
  projects,
  search,
  savingId,
  onSearchChange,
  onAdd,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#090c14] shadow-2xl">
        <header className="flex items-start justify-between gap-5 border-b border-white/10 p-5 md:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              Content Library
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Add Hero Title
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Select a title to add to the homepage hero lineup.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Close add hero modal"
          >
            ×
          </button>
        </header>

        <div className="border-b border-white/10 p-5 md:p-6">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search the content library..."
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
          {projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-sm text-white/40">
                No available titles match this search.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => {
                const image =
                  project.thumbnailUrl ||
                  project.backdropUrl ||
                  "";

                const saving = savingId === project.id;

                return (
                  <article
                    key={project.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 transition hover:border-white/15 hover:bg-white/[0.04]"
                  >
                    <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
                      {image ? (
                        <img
                          src={image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/25">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-white">
                        {project.title}
                      </h3>

                      <p className="mt-1 text-xs text-white/35">
                        {[project.type, project.genre]
                          .filter(Boolean)
                          .join(" • ") || "SourceTV title"}
                      </p>

                      {project.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/30">
                          {project.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => onAdd(project)}
                      className="shrink-0 rounded-xl border border-sky-300/25 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:border-sky-300/45 hover:bg-sky-300/15 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving ? "Adding..." : "Add"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}