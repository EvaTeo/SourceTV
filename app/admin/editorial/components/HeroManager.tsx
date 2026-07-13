"use client";

import { useEffect, useMemo, useState } from "react";
import HeroAddModal from "./hero/HeroAddModal";
import HeroList from "./hero/HeroList";
import HeroToolbar from "./hero/HeroToolbar";
import type { HeroProject } from "./hero/HeroCard";

type ContentProject = HeroProject & {
  titleLogoUrl?: string | null;
  trailerUrl?: string | null;
  status?: string | null;
  workflowStage?: string | null;
  featured?: boolean;
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

async function readResponse(response: Response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "The requested update could not be completed."
    );
  }

  return data;
}

export default function HeroManager() {
  const [projects, setProjects] = useState<ContentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<
    Record<string, HeroDraft>
  >({});

  async function loadProjects(showLoading = true) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await fetch("/api/admin/content", {
        cache: "no-store",
      });

      const data = await readResponse(response);
      const nextProjects: ContentProject[] = Array.isArray(data)
        ? data
        : [];

      setProjects(nextProjects);

      setDrafts((current) => {
        const nextDrafts: Record<string, HeroDraft> = {};

        nextProjects.forEach((project) => {
          nextDrafts[project.id] =
            current[project.id] || createDraft(project);
        });

        return nextDrafts;
      });
    } catch (error) {
      console.error("HERO MANAGER LOAD ERROR:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not load hero titles."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    void loadProjects();
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

      await readResponse(response);
      await loadProjects(false);
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
    const confirmed = window.confirm(
      `Remove "${project.title}" from the hero lineup?`
    );

    if (!confirmed) return;

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

    const priority =
      draft.heroPriority.trim() === ""
        ? project.heroPriority ??
          project.featuredRank ??
          null
        : Number(draft.heroPriority);

    if (
      priority !== null &&
      (!Number.isFinite(priority) || priority < 1)
    ) {
      window.alert("Hero priority must be 1 or higher.");
      return;
    }

    if (
      draft.heroStartDate &&
      draft.heroEndDate &&
      draft.heroStartDate > draft.heroEndDate
    ) {
      window.alert("The hero end date must be after its start date.");
      return;
    }

    await updateProject(project.id, {
      heroBadge: draft.heroBadge.trim() || null,
      heroPriority: priority,
      featuredRank: priority,
      heroStartDate: draft.heroStartDate || null,
      heroEndDate: draft.heroEndDate || null,
    });
  }

  async function reorderHeroes(reordered: HeroProject[]) {
    const previousProjects = projects;

    const priorityById = new Map(
      reordered.map((project, index) => [
        project.id,
        index + 1,
      ])
    );

    setProjects((current) =>
      current.map((project) => {
        const priority = priorityById.get(project.id);

        if (priority === undefined) {
          return project;
        }

        return {
          ...project,
          heroPriority: priority,
          featuredRank: priority,
        };
      })
    );

    setDrafts((current) => {
      const next = { ...current };

      reordered.forEach((project, index) => {
        next[project.id] = {
          ...(next[project.id] || createDraft(project)),
          heroPriority: String(index + 1),
        };
      });

      return next;
    });

    try {
      setReordering(true);

      const responses = await Promise.all(
        reordered.map((project, index) =>
          fetch(`/api/admin/content/${project.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              heroPriority: index + 1,
              featuredRank: index + 1,
            }),
          })
        )
      );

      await Promise.all(responses.map(readResponse));
      await loadProjects(false);
    } catch (error) {
      console.error("HERO REORDER ERROR:", error);

      setProjects(previousProjects);
      await loadProjects(false);

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not save the new hero order."
      );
    } finally {
      setReordering(false);
    }
  }

  function closeAddModal() {
    setAddModalOpen(false);
    setSearch("");
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-10 text-white/45">
        Loading hero programming...
      </section>
    );
  }

  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 md:p-6">
        <HeroToolbar
          totalHeroes={featuredProjects.length}
          onAddHero={() => setAddModalOpen(true)}
        />

        <div className="mt-6">
          {reordering && (
            <div className="mb-4 rounded-xl border border-sky-300/15 bg-sky-300/[0.06] px-4 py-3 text-sm text-sky-200">
              Saving hero order...
            </div>
          )}

          {featuredProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl text-white/45">
                +
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                No hero titles selected
              </h3>

              <p className="mt-2 text-sm text-white/40">
                Add your first title to begin programming the
                SourceTV homepage.
              </p>

              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="mt-6 rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
              >
                Add First Hero
              </button>
            </div>
          ) : (
            <HeroList
              heroes={featuredProjects}
              drafts={drafts}
              savingId={savingId}
              onDraftChange={updateDraft}
              onSave={saveHeroSettings}
              onRemove={removeFromHero}
              onReorder={reorderHeroes}
            />
          )}
        </div>
      </section>

      <HeroAddModal
        open={addModalOpen}
        projects={availableProjects}
        search={search}
        savingId={savingId}
        onSearchChange={setSearch}
        onAdd={addToHero}
        onClose={closeAddModal}
      />
    </>
  );
}