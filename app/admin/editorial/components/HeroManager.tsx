"use client";

import SearchInput from "@/app/components/admin/SearchInput";
import { useEffect, useMemo, useState } from "react";

type HeroProject = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;
  trailerUrl?: string | null;
  status?: string | null;
  workflowStage?: string | null;
  featured?: boolean;
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

function toDateInput(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function createDraft(project: HeroProject): HeroDraft {
  return {
    heroBadge: project.heroBadge || "",
    heroPriority:
      project.heroPriority !== null &&
      project.heroPriority !== undefined
        ? String(project.heroPriority)
        : "",
    heroStartDate: toDateInput(project.heroStartDate),
    heroEndDate: toDateInput(project.heroEndDate),
  };
}

export default function HeroManager() {
  const [projects, setProjects] = useState<HeroProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Record<string, HeroDraft>>({});

  async function loadProjects() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/content", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to load hero titles."
        );
      }

      const nextProjects = Array.isArray(data) ? data : [];

      setProjects(nextProjects);

      const nextDrafts: Record<string, HeroDraft> = {};

      nextProjects.forEach((project: HeroProject) => {
        nextDrafts[project.id] = createDraft(project);
      });

      setDrafts(nextDrafts);
    } catch (error) {
      console.error("HERO MANAGER LOAD ERROR:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Could not load hero titles."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const featuredProjects = useMemo(() => {
    return projects
      .filter((project) => project.featured)
      .sort((a, b) => {
        const aPriority =
          a.heroPriority ?? a.featuredRank ?? 999;

        const bPriority =
          b.heroPriority ?? b.featuredRank ?? 999;

        return aPriority - bPriority;
      });
  }, [projects]);

  const availableProjects = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return projects
      .filter((project) => !project.featured)
      .filter((project) => {
        if (!cleanSearch) return true;

        return [
          project.title,
          project.description,
          project.type,
          project.genre,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(cleanSearch)
          );
      });
  }, [projects, search]);

  function updateDraft(
    projectId: string,
    key: keyof HeroDraft,
    value: string
  ) {
    setDrafts((current) => ({
      ...current,
      [projectId]: {
        ...(current[projectId] || {
          heroBadge: "",
          heroPriority: "",
          heroStartDate: "",
          heroEndDate: "",
        }),
        [key]: value,
      },
    }));
  }

  async function updateProject(
    projectId: string,
    body: Record<string, unknown>
  ) {
    try {
      setSavingId(projectId);

      const response = await fetch(
        `/api/admin/content/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Failed to update hero title."
        );
      }

      await loadProjects();
    } catch (error) {
      console.error("HERO MANAGER UPDATE ERROR:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not update this hero title."
      );
    } finally {
      setSavingId(null);
    }
  }

  async function addToHero(project: HeroProject) {
    const nextPriority =
      featuredProjects.length > 0
        ? Math.max(
            ...featuredProjects.map(
              (item) =>
                item.heroPriority ??
                item.featuredRank ??
                0
            )
          ) + 1
        : 1;

    await updateProject(project.id, {
      featured: true,
      featuredRank: nextPriority,
      heroPriority: nextPriority,
    });
  }

  async function removeFromHero(project: HeroProject) {
    await updateProject(project.id, {
      featured: false,
      featuredRank: null,
      heroPriority: null,
      heroBadge: null,
      heroStartDate: null,
      heroEndDate: null,
    });
  }

  async function saveHeroSettings(project: HeroProject) {
    const draft = drafts[project.id] || createDraft(project);

    await updateProject(project.id, {
      heroBadge: draft.heroBadge || null,
      heroPriority:
        draft.heroPriority === ""
          ? null
          : Number(draft.heroPriority),
      featuredRank:
        draft.heroPriority === ""
          ? project.featuredRank
          : Number(draft.heroPriority),
      heroStartDate: draft.heroStartDate || null,
      heroEndDate: draft.heroEndDate || null,
    });
  }

  async function moveHero(
    project: HeroProject,
    direction: "up" | "down"
  ) {
    const currentIndex = featuredProjects.findIndex(
      (item) => item.id === project.id
    );

    if (currentIndex === -1) return;

    const nextIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      nextIndex < 0 ||
      nextIndex >= featuredProjects.length
    ) {
      return;
    }

    const currentProject = featuredProjects[currentIndex];
    const nextProject = featuredProjects[nextIndex];

    const currentPriority =
      currentProject.heroPriority ??
      currentProject.featuredRank ??
      currentIndex + 1;

    const nextPriority =
      nextProject.heroPriority ??
      nextProject.featuredRank ??
      nextIndex + 1;

    try {
      setSavingId(project.id);

      await Promise.all([
        fetch(`/api/admin/content/${currentProject.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            heroPriority: nextPriority,
            featuredRank: nextPriority,
          }),
        }),
        fetch(`/api/admin/content/${nextProject.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            heroPriority: currentPriority,
            featuredRank: currentPriority,
          }),
        }),
      ]);

      await loadProjects();
    } catch (error) {
      console.error("HERO REORDER ERROR:", error);
      window.alert("Could not reorder hero titles.");
    } finally {
      setSavingId(null);
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-white/45">
        Loading hero programming...
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <div className="border-b border-white/[0.08] pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
            Homepage Programming
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Hero Management
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">
            Choose featured titles, control their order, assign
            badges, and schedule when each hero appears.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {featuredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <h3 className="text-lg font-semibold text-white">
                No hero titles selected
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Add a title from the content library below.
              </p>
            </div>
          ) : (
            featuredProjects.map((project, index) => {
              const draft =
                drafts[project.id] || createDraft(project);

              const imageUrl =
                project.backdropUrl ||
                project.thumbnailUrl ||
                "";

              const saving = savingId === project.id;

              return (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"
                >
                  <div className="grid gap-5 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="aspect-video overflow-hidden rounded-xl bg-white/[0.04]">
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-300">
                            Position {index + 1}
                          </p>

                          <h3 className="mt-2 text-lg font-semibold text-white">
                            {project.title}
                          </h3>

                          <p className="mt-1 text-sm text-white/35">
                            {[project.type, project.genre]
                              .filter(Boolean)
                              .join(" • ") || "SourceTV title"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={saving || index === 0}
                            onClick={() =>
                              moveHero(project, "up")
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/55 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-20"
                            aria-label={`Move ${project.title} up`}
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            disabled={
                              saving ||
                              index ===
                                featuredProjects.length - 1
                            }
                            onClick={() =>
                              moveHero(project, "down")
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/55 transition hover:bg-white/[0.07] hover:text-white disabled:opacity-20"
                            aria-label={`Move ${project.title} down`}
                          >
                            ↓
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              removeFromHero(project)
                            }
                            className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/15 disabled:opacity-40"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                            Hero Badge
                          </span>

                          <input
                            value={draft.heroBadge}
                            disabled={saving}
                            onChange={(event) =>
                              updateDraft(
                                project.id,
                                "heroBadge",
                                event.target.value
                              )
                            }
                            className={inputClassName}
                            placeholder="Trending Now"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                            Priority
                          </span>

                          <input
                            type="number"
                            min={1}
                            value={draft.heroPriority}
                            disabled={saving}
                            onChange={(event) =>
                              updateDraft(
                                project.id,
                                "heroPriority",
                                event.target.value
                              )
                            }
                            className={inputClassName}
                            placeholder="1"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                            Start Date
                          </span>

                          <input
                            type="date"
                            value={draft.heroStartDate}
                            disabled={saving}
                            onChange={(event) =>
                              updateDraft(
                                project.id,
                                "heroStartDate",
                                event.target.value
                              )
                            }
                            className={inputClassName}
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                            End Date
                          </span>

                          <input
                            type="date"
                            value={draft.heroEndDate}
                            disabled={saving}
                            onChange={(event) =>
                              updateDraft(
                                project.id,
                                "heroEndDate",
                                event.target.value
                              )
                            }
                            className={inputClassName}
                          />
                        </label>
                      </div>

                      <div className="mt-5 flex justify-end">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            saveHeroSettings(project)
                          }
                          className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:opacity-40"
                        >
                          {saving
                            ? "Saving..."
                            : "Save Hero Settings"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Add Hero Title
          </h3>

          <p className="mt-1 text-sm text-white/40">
            Choose an approved title from the SourceTV content
            library.
          </p>
        </div>

        <div className="mt-5">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search the content library..."
          />
        </div>

        <div className="mt-5 max-h-[520px] space-y-3 overflow-y-auto pr-1">
          {availableProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
              No available titles match this search.
            </div>
          ) : (
            availableProjects.map((project) => {
              const imageUrl =
                project.thumbnailUrl ||
                project.backdropUrl ||
                "";

              const saving = savingId === project.id;

              return (
                <div
                  key={project.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"
                >
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.05]">
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
                    onClick={() => addToHero(project)}
                    className="rounded-xl border border-sky-300/25 bg-sky-300/10 px-4 py-2.5 text-sm font-semibold text-sky-200 transition hover:border-sky-300/45 hover:bg-sky-300/15 disabled:opacity-40"
                  >
                    {saving ? "Adding..." : "Add to Hero"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

const inputClassName =
  "w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/45 focus:bg-black/35 disabled:cursor-not-allowed disabled:opacity-50";