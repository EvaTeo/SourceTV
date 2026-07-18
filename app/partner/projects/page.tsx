"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PartnerProject = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  workflowStage: string;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  reviewNotes?: string | null;
  metadataNotes?: string | null;
  contentNotes?: string | null;
  rightsNotes?: string | null;
};

const stageLabels: Record<string, string> = {
  submission: "Submission Received",
  metadata_review: "Metadata Review",
  content_review: "Content Review",
  rights_review: "Rights Review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
  rejected: "Rejected",
};

const stageOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Submission Received", value: "submission" },
  { label: "Metadata Review", value: "metadata_review" },
  { label: "Content Review", value: "content_review" },
  { label: "Rights Review", value: "rights_review" },
  { label: "Approved", value: "approved" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
  { label: "Archived", value: "archived" },
];

function stageClass(stage: string) {
  if (stage === "published") {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  }

  if (stage === "scheduled") {
    return "border-violet-300/20 bg-violet-300/10 text-violet-200";
  }

  if (stage === "approved") {
    return "border-sky-300/20 bg-sky-300/10 text-sky-200";
  }

  if (stage === "rejected") {
    return "border-red-300/20 bg-red-300/10 text-red-200";
  }

  if (stage === "rights_review") {
    return "border-yellow-300/20 bg-yellow-300/10 text-yellow-100";
  }

  return "border-white/10 bg-white/[0.04] text-white/60";
}

function formatDate(date?: string | null) {
  if (!date) {
    return null;
  }

  return new Date(date).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function hasAttention(project: PartnerProject) {
  return Boolean(
    project.reviewNotes ||
      project.metadataNotes ||
      project.contentNotes ||
      project.rightsNotes
  );
}

export default function PartnerProjectsPage() {
  const [projects, setProjects] = useState<PartnerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/partner/projects", {
          cache: "no-store",
        });

        if (response.status === 401 || response.status === 403) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load projects: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (error) {
        console.error("PARTNER PROJECTS LOAD ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const projectTypes = useMemo(() => {
    return Array.from(
      new Set(
        projects
          .map((project) => project.type?.trim())
          .filter((type): type is string => Boolean(type))
      )
    ).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.genre?.toLowerCase().includes(query) ||
        project.type?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        project.workflowStage === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        project.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [projects, search, statusFilter, typeFilter]);

  const filtersActive =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    typeFilter !== "all";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
            SourceTV Partner Studio
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Projects
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Review your submitted work and follow each title through the
            SourceTV publishing process.
          </p>
        </div>

        <Link
          href="/creator/submit"
          className="w-fit rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black transition hover:bg-sky-200"
        >
          Submit New Work
        </Link>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="relative block">
            <span className="sr-only">Search projects</span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects"
              className="h-12 w-full rounded-xl border border-white/10 bg-black/25 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/40"
            />
          </label>

          <label>
            <span className="sr-only">Filter by status</span>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white/70 outline-none transition focus:border-sky-300/40"
            >
              {stageOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#080b12] text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Filter by type</span>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white/70 outline-none transition focus:border-sky-300/40"
            >
              <option
                value="all"
                className="bg-[#080b12] text-white"
              >
                All Types
              </option>

              {projectTypes.map((type) => (
                <option
                  key={type}
                  value={type}
                  className="bg-[#080b12] text-white"
                >
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-black">
              My projects
            </h2>

            <p className="mt-1 text-sm text-white/38">
              {loading
                ? "Loading your catalog..."
                : `${filteredProjects.length} ${
                    filteredProjects.length === 1
                      ? "project"
                      : "projects"
                  }`}
            </p>
          </div>

          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="w-fit text-xs font-black text-sky-200 transition hover:text-sky-100"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="mt-5">
          {loading ? (
            <LoadingState />
          ) : projects.length === 0 ? (
            <EmptyCatalog />
          ) : filteredProjects.length === 0 ? (
            <EmptySearch onClear={clearFilters} />
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProjectRow({
  project,
}: {
  project: PartnerProject;
}) {
  const displayDate =
    project.publishedAt || project.scheduledAt;

  return (
    <Link
      href={`/partner/projects/${project.id}`}
      className="group grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-sky-300/25 hover:bg-white/[0.025] md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-center"
    >
      <div
        className="aspect-video overflow-hidden rounded-xl bg-zinc-950 bg-cover bg-center"
        style={{
          backgroundImage:
            project.backdropUrl || project.thumbnailUrl
              ? `linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.08)), url(${
                  project.backdropUrl || project.thumbnailUrl
                })`
              : "linear-gradient(135deg,#07111f,#020617)",
        }}
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="line-clamp-1 text-base font-black text-white">
            {project.title}
          </h3>

          {hasAttention(project) && (
            <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-yellow-100">
              Update Requested
            </span>
          )}
        </div>

        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/40">
          {project.description || "No description provided."}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${stageClass(
              project.workflowStage
            )}`}
          >
            {stageLabels[project.workflowStage] ||
              project.workflowStage}
          </span>

          {project.type && (
            <span className="text-xs font-semibold text-white/32">
              {project.type}
            </span>
          )}

          {project.genre && (
            <span className="text-xs font-semibold text-white/32">
              {project.genre}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-5 md:block md:min-w-[110px] md:text-right">
        {displayDate ? (
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
              {project.publishedAt ? "Published" : "Scheduled"}
            </p>

            <p className="mt-1 text-xs font-semibold text-white/45">
              {formatDate(displayDate)}
            </p>
          </div>
        ) : (
          <span className="text-xs text-white/25">
            No release date
          </span>
        )}

        <p className="mt-0 text-xs font-black text-sky-200 transition group-hover:translate-x-1 md:mt-4">
          Open →
        </p>
      </div>
    </Link>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-36 animate-pulse rounded-2xl border border-white/10 bg-black/20"
        />
      ))}
    </div>
  );
}

function EmptyCatalog() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-8">
      <h3 className="text-xl font-black">
        No projects submitted
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
        Submit a film, series, episode, documentary, or animation to begin the
        SourceTV review process.
      </p>

      <Link
        href="/creator/submit"
        className="mt-5 inline-flex rounded-xl bg-sky-300 px-4 py-2.5 text-xs font-black text-black transition hover:bg-sky-200"
      >
        Submit Your First Work
      </Link>
    </div>
  );
}

function EmptySearch({
  onClear,
}: {
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center">
      <h3 className="text-lg font-black">
        No matching projects
      </h3>

      <p className="mt-2 text-sm text-white/40">
        Try changing your search or filters.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 transition hover:border-sky-300/30 hover:text-white"
      >
        Clear Filters
      </button>
    </div>
  );
}