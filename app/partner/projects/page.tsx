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

type ReviewStage =
  | "submission"
  | "metadata_review"
  | "content_review"
  | "rights_review"
  | "approved"
  | "scheduled"
  | "published";

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

const reviewStages: { value: ReviewStage; shortLabel: string }[] = [
  { value: "submission", shortLabel: "Submitted" },
  { value: "metadata_review", shortLabel: "Metadata" },
  { value: "content_review", shortLabel: "Content" },
  { value: "rights_review", shortLabel: "Rights" },
  { value: "approved", shortLabel: "Approved" },
  { value: "scheduled", shortLabel: "Scheduled" },
  { value: "published", shortLabel: "Published" },
];

function stageClass(stage: string) {
  if (stage === "published") return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  if (stage === "scheduled") return "border-violet-300/20 bg-violet-300/10 text-violet-200";
  if (stage === "approved") return "border-sky-300/20 bg-sky-300/10 text-sky-200";
  if (stage === "rejected") return "border-red-300/20 bg-red-300/10 text-red-200";
  if (stage === "rights_review") return "border-yellow-300/20 bg-yellow-300/10 text-yellow-100";
  if (stage === "archived") return "border-white/10 bg-white/[0.03] text-white/35";
  return "border-white/10 bg-white/[0.05] text-white/60";
}

function formatDate(date?: string | null) {
  if (!date) return null;
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

function getStageIndex(stage: string) {
  if (stage === "rejected" || stage === "archived") return -1;
  return reviewStages.findIndex((item) => item.value === stage);
}

export default function PartnerProjectsPage() {
  const [projects, setProjects] = useState<PartnerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/partner/projects", { cache: "no-store" });

        if (response.status === 401 || response.status === 403) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load projects: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) setProjects(data);
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

  const stats = useMemo(() => {
    const inReviewStages = new Set([
      "submission",
      "metadata_review",
      "content_review",
      "rights_review",
    ]);

    return {
      total: projects.length,
      reviewing: projects.filter((project) => inReviewStages.has(project.workflowStage)).length,
      published: projects.filter((project) => project.workflowStage === "published").length,
      attention: projects.filter(hasAttention).length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.genre?.toLowerCase().includes(query) ||
        project.type?.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "all" || project.workflowStage === statusFilter;
      const matchesType = typeFilter === "all" || project.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "title") return a.title.localeCompare(b.title);
      if (sortOrder === "status") {
        return getStageIndex(b.workflowStage) - getStageIndex(a.workflowStage);
      }

      const aDate = new Date(a.publishedAt || a.scheduledAt || 0).getTime();
      const bDate = new Date(b.publishedAt || b.scheduledAt || 0).getTime();
      return bDate - aDate;
    });
  }, [projects, search, statusFilter, typeFilter, sortOrder]);

  const filtersActive =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    sortOrder !== "recent";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortOrder("recent");
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-16">
      <header className="border-b border-white/10 pb-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
              SourceTV Partner Studio
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Projects
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/45 sm:text-[15px]">
              Manage every title you have submitted and follow each project through review,
              approval, scheduling, and publication.
            </p>
          </div>

          <Link
            href="/partner/submit"
            className="inline-flex w-fit justify-center rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black transition hover:bg-sky-200"
          >
            Submit New Work
          </Link>
        </div>
      </header>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Projects" value={loading ? "—" : stats.total} detail="All submitted titles" />
        <MetricCard label="In Review" value={loading ? "—" : stats.reviewing} detail="Currently moving through review" />
        <MetricCard label="Published" value={loading ? "—" : stats.published} detail="Live on SourceTV" />
        <MetricCard
          label="Needs Attention"
          value={loading ? "—" : stats.attention}
          detail="Updates or notes requested"
          attention={stats.attention > 0}
        />
      </section>

      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Find a Project
            </p>
            <p className="mt-2 text-sm text-white/40">
              Search your catalog or narrow the list by workflow stage, project type, or sort order.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_170px_160px]">
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
                className="h-12 w-full rounded-xl border border-white/10 bg-black/25 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-sky-300/40"
              />
            </label>

            <FilterSelect label="Filter by status" value={statusFilter} onChange={setStatusFilter} options={stageOptions} />
            <FilterSelect
              label="Filter by type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[{ label: "All Types", value: "all" }, ...projectTypes.map((type) => ({ label: type, value: type }))]}
            />
            <FilterSelect
              label="Sort projects"
              value={sortOrder}
              onChange={setSortOrder}
              options={[
                { label: "Most Recent", value: "recent" },
                { label: "Title A–Z", value: "title" },
                { label: "Review Stage", value: "status" },
              ]}
            />
          </div>

          {filtersActive ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-black text-sky-200 transition hover:text-sky-100"
              >
                Clear Filters
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-6">
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">Catalog</p>
            <h2 className="mt-2 text-2xl font-black text-white">My Projects</h2>
            <p className="mt-2 text-sm text-white/38">
              {loading
                ? "Loading your catalog..."
                : `${filteredProjects.length} ${filteredProjects.length === 1 ? "project" : "projects"} shown`}
            </p>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <LoadingState />
          ) : projects.length === 0 ? (
            <EmptyCatalog />
          ) : filteredProjects.length === 0 ? (
            <EmptySearch onClear={clearFilters} />
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  attention = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  attention?: boolean;
}) {
  return (
    <article className={`rounded-2xl border p-5 ${attention ? "border-yellow-300/15 bg-yellow-300/[0.04]" : "border-white/10 bg-white/[0.035]"}`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${attention ? "text-yellow-100" : "text-white/35"}`}>
        {label}
      </p>
      <p className="mt-3 text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-white/30">{detail}</p>
    </article>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-[#090c13] px-4 text-sm font-semibold text-white/70 outline-none transition hover:border-white/15 focus:border-sky-300/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#080b12] text-white">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProjectCard({ project }: { project: PartnerProject }) {
  const displayDate = project.publishedAt || project.scheduledAt;

  return (
    <Link
      href={`/partner/projects/${project.id}`}
      className="group block rounded-3xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-sky-300/25 hover:bg-white/[0.04] sm:p-5"
    >
      <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <ProjectArtwork project={project} />

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="line-clamp-1 text-xl font-black text-white">{project.title}</h3>
                {hasAttention(project) ? (
                  <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-yellow-100">
                    Update Requested
                  </span>
                ) : null}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {project.type ? <span className="text-xs font-semibold text-white/38">{project.type}</span> : null}
                {project.type && project.genre ? <span className="text-white/15">•</span> : null}
                {project.genre ? <span className="text-xs font-semibold text-white/38">{project.genre}</span> : null}
              </div>
            </div>

            <span className={`w-fit rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] ${stageClass(project.workflowStage)}`}>
              {stageLabels[project.workflowStage] || project.workflowStage}
            </span>
          </div>

          <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-white/42">
            {project.description || "No description provided."}
          </p>

          <ReviewTimeline currentStage={project.workflowStage} />

          <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            {displayDate ? (
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                  {project.publishedAt ? "Published" : "Scheduled"}
                </p>
                <p className="mt-1 text-xs font-semibold text-white/45">{formatDate(displayDate)}</p>
              </div>
            ) : (
              <p className="text-xs text-white/25">No release date assigned</p>
            )}

            <span className="text-xs font-black text-sky-200 transition group-hover:translate-x-1">Open Project →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProjectArtwork({ project }: { project: PartnerProject }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 lg:block">
      <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#070a10] lg:hidden">
        {project.thumbnailUrl ? (
          <img src={project.thumbnailUrl} alt={`${project.title} poster`} className="h-full w-full object-cover" />
        ) : (
          <ArtworkPlaceholder label="Poster" />
        )}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#070a10]">
        {project.backdropUrl || project.thumbnailUrl ? (
          <img
            src={project.backdropUrl || project.thumbnailUrl || ""}
            alt={`${project.title} artwork`}
            className="h-full w-full object-cover"
          />
        ) : (
          <ArtworkPlaceholder label="Project Artwork" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 hidden lg:block">
          <div className="w-14 overflow-hidden rounded-lg border border-white/10 bg-black/50">
            <div className="aspect-[2/3]">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={`${project.title} poster thumbnail`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ArtworkPlaceholder label="Poster" compact />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewTimeline({ currentStage }: { currentStage: string }) {
  const currentIndex = getStageIndex(currentStage);
  const isRejected = currentStage === "rejected";
  const isArchived = currentStage === "archived";

  return (
    <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Review Progress</p>
      <p className="mt-1 text-xs text-white/30">
        {isRejected
          ? "This submission was not approved."
          : isArchived
            ? "This project is archived."
            : stageLabels[currentStage] || currentStage}
      </p>

      {!isRejected && !isArchived ? (
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {reviewStages.map((stage, index) => {
            const complete = index < currentIndex;
            const active = index === currentIndex;

            return (
              <div key={stage.value} className="min-w-0">
                <div className={`h-1.5 rounded-full ${complete ? "bg-emerald-300/75" : active ? "bg-sky-300" : "bg-white/10"}`} />
                <p className={`mt-2 truncate text-[9px] font-black uppercase tracking-[0.08em] ${active ? "text-sky-200" : complete ? "text-white/40" : "text-white/20"}`}>
                  {stage.shortLabel}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ArtworkPlaceholder({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.025),rgba(255,255,255,0.005))]">
      <span className={`text-center font-semibold text-white/20 ${compact ? "px-1 text-[8px]" : "px-3 text-xs"}`}>
        {label}
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]" />
      ))}
    </div>
  );
}

function EmptyCatalog() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 sm:p-10">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">Your Studio</p>
      <h3 className="mt-3 text-2xl font-black text-white">Welcome to your project catalog.</h3>
      <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
        Every film, series, documentary, episode, and animation you submit will appear here with its review status and publishing progress.
      </p>
      <Link
        href="/partner/submit"
        className="mt-6 inline-flex rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black transition hover:bg-sky-200"
      >
        Submit Your First Work
      </Link>
    </div>
  );
}

function EmptySearch({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">
      <h3 className="text-xl font-black text-white">No matching projects</h3>
      <p className="mt-2 text-sm text-white/40">Try changing your search, status, type, or sort order.</p>
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