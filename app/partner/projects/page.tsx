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
  trailerUrl?: string | null;
  videoUrl?: string | null;
  mainVideoUrl?: string | null;
  workflowStage: string;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  reviewNotes?: string | null;
  metadataNotes?: string | null;
  contentNotes?: string | null;
  rightsNotes?: string | null;
  recognitionLevel?: string | null;
  featured?: boolean | null;
  year?: number | null;
  runtime?: string | null;
  maturityRating?: string | null;
  creatorName?: string | null;
  creatorCompany?: string | null;
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
  {
    label: "All Statuses",
    value: "all",
  },
  {
    label: "Submission Received",
    value: "submission",
  },
  {
    label: "Metadata Review",
    value: "metadata_review",
  },
  {
    label: "Content Review",
    value: "content_review",
  },
  {
    label: "Rights Review",
    value: "rights_review",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Scheduled",
    value: "scheduled",
  },
  {
    label: "Published",
    value: "published",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Archived",
    value: "archived",
  },
];

const reviewStages: {
  value: ReviewStage;
  shortLabel: string;
}[] = [
  {
    value: "submission",
    shortLabel: "Submitted",
  },
  {
    value: "metadata_review",
    shortLabel: "Metadata",
  },
  {
    value: "content_review",
    shortLabel: "Content",
  },
  {
    value: "rights_review",
    shortLabel: "Rights",
  },
  {
    value: "approved",
    shortLabel: "Approved",
  },
  {
    value: "scheduled",
    shortLabel: "Scheduled",
  },
  {
    value: "published",
    shortLabel: "Published",
  },
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

  if (stage === "archived") {
    return "border-white/10 bg-white/[0.03] text-white/35";
  }

  return "border-white/10 bg-white/[0.05] text-white/60";
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

function getStageIndex(stage: string) {
  if (stage === "rejected" || stage === "archived") {
    return -1;
  }

  return reviewStages.findIndex((item) => item.value === stage);
}

function getRecognition(project: PartnerProject) {
  if (project.recognitionLevel) {
    return project.recognitionLevel;
  }

  if (project.featured && project.workflowStage === "published") {
    return "Featured Selection";
  }

  if (project.workflowStage === "published") {
    return "SourceTV Selection";
  }

  if (project.workflowStage === "approved") {
    return "Selection Pending";
  }

  return "In Review";
}

export default function PartnerProjectsPage() {
  const [projects, setProjects] = useState<PartnerProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    null
  );

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
          throw new Error(
            `Failed to load projects: ${response.status}`
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (error) {
        console.error(
          "PARTNER PROJECTS LOAD ERROR:",
          error
        );
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
          .filter(
            (type): type is string => Boolean(type)
          )
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

      reviewing: projects.filter((project) =>
        inReviewStages.has(project.workflowStage)
      ).length,

      published: projects.filter(
        (project) =>
          project.workflowStage === "published"
      ).length,

      attention: projects.filter(hasAttention).length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.title.toLowerCase().includes(query) ||
        project.description
          ?.toLowerCase()
          .includes(query) ||
        project.genre?.toLowerCase().includes(query) ||
        project.type?.toLowerCase().includes(query) ||
        project.creatorName
          ?.toLowerCase()
          .includes(query) ||
        project.creatorCompany
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        project.workflowStage === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        project.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortOrder === "status") {
        return (
          getStageIndex(b.workflowStage) -
          getStageIndex(a.workflowStage)
        );
      }

      const aDate = new Date(
        a.publishedAt || a.scheduledAt || 0
      ).getTime();

      const bDate = new Date(
        b.publishedAt || b.scheduledAt || 0
      ).getTime();

      return bDate - aDate;
    });
  }, [
    projects,
    search,
    statusFilter,
    typeFilter,
    sortOrder,
  ]);

  useEffect(() => {
    if (!expandedProjectId) {
      return;
    }

    const isStillVisible = filteredProjects.some(
      (project) => project.id === expandedProjectId
    );

    if (!isStillVisible) {
      setExpandedProjectId(null);
    }
  }, [expandedProjectId, filteredProjects]);

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
    setExpandedProjectId(null);
  }

  function toggleProject(projectId: string) {
    setExpandedProjectId((currentId) =>
      currentId === projectId ? null : projectId
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-16">
      <header className="relative overflow-hidden border-b border-white/10 pb-8">
        <div className="pointer-events-none absolute -left-32 -top-40 h-72 w-72 rounded-full bg-sky-400/10 blur-[110px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
              SourceTV Partner Studio
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Projects
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/45 sm:text-[15px]">
              Manage every title you have submitted and
              follow each project through review,
              approval, scheduling, and publication.
            </p>
          </div>

          <Link
            href="/partner/submit"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(56,189,248,0.14)] transition hover:bg-sky-200"
          >
            <PlusIcon />
            Submit New Work
          </Link>
        </div>
      </header>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Projects"
          value={loading ? "—" : stats.total}
          detail="All submitted titles"
          icon={<CatalogIcon />}
        />

        <MetricCard
          label="In Review"
          value={loading ? "—" : stats.reviewing}
          detail="Currently moving through review"
          icon={<ReviewIcon />}
        />

        <MetricCard
          label="Published"
          value={loading ? "—" : stats.published}
          detail="Live on SourceTV"
          icon={<PublishedIcon />}
        />

        <MetricCard
          label="Needs Attention"
          value={loading ? "—" : stats.attention}
          detail="Updates or notes requested"
          attention={stats.attention > 0}
          icon={<AttentionIcon />}
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
        <div className="border-b border-white/[0.07] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
            Find a Project
          </p>

          <p className="mt-2 text-sm text-white/40">
            Search your catalog or narrow the list by
            workflow stage, project type, or sort order.
          </p>
        </div>

        <div className="p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_170px_160px]">
            <label className="relative block">
              <span className="sr-only">
                Search projects
              </span>

              <SearchIcon />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search projects"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/25 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 hover:border-white/15 focus:border-sky-300/40"
              />
            </label>

            <FilterSelect
              label="Filter by status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={stageOptions}
            />

            <FilterSelect
              label="Filter by type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                {
                  label: "All Types",
                  value: "all",
                },
                ...projectTypes.map((type) => ({
                  label: type,
                  value: type,
                })),
              ]}
            />

            <FilterSelect
              label="Sort projects"
              value={sortOrder}
              onChange={setSortOrder}
              options={[
                {
                  label: "Most Recent",
                  value: "recent",
                },
                {
                  label: "Title A–Z",
                  value: "title",
                },
                {
                  label: "Review Stage",
                  value: "status",
                },
              ]}
            />
          </div>

          {filtersActive ? (
            <div className="mt-4 flex justify-end">
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

      <section className="mt-7">
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Catalog
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              My Projects
            </h2>

            <p className="mt-2 text-sm text-white/38">
              {loading
                ? "Loading your catalog..."
                : `${filteredProjects.length} ${
                    filteredProjects.length === 1
                      ? "project"
                      : "projects"
                  } shown`}
            </p>
          </div>

          {!loading && filteredProjects.length > 0 ? (
            <p className="text-xs font-semibold text-white/25">
              Select a project to view its full details
            </p>
          ) : null}
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
                <ProjectCard
                  key={project.id}
                  project={project}
                  expanded={
                    expandedProjectId === project.id
                  }
                  onToggle={() =>
                    toggleProject(project.id)
                  }
                />
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
  icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  attention?: boolean;
icon: React.ReactNode;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        attention
          ? "border-yellow-300/15 bg-yellow-300/[0.04]"
          : "border-white/10 bg-white/[0.035]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full blur-3xl ${
          attention
            ? "bg-yellow-300/10"
            : "bg-sky-300/[0.06]"
        }`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              attention
                ? "text-yellow-100"
                : "text-white/35"
            }`}
          >
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-white/30">
            {detail}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            attention
              ? "border-yellow-300/15 bg-yellow-300/[0.06] text-yellow-100"
              : "border-white/10 bg-black/20 text-sky-200"
          }`}
        >
          {icon}
        </div>
      </div>
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
  options: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-xl border border-white/10 bg-[#090c13] px-4 text-sm font-semibold text-white/70 outline-none transition hover:border-white/15 focus:border-sky-300/40"
      >
        {options.map((option) => (
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
  );
}

function ProjectCard({
  project,
  expanded,
  onToggle,
}: {
  project: PartnerProject;
  expanded: boolean;
  onToggle: () => void;
}) {
  const displayDate =
    project.publishedAt || project.scheduledAt;

  return (
    <article
      className={`overflow-hidden rounded-3xl border transition duration-300 ${
        expanded
          ? "border-sky-300/30 bg-white/[0.045] shadow-[0_30px_90px_rgba(0,0,0,0.32)]"
          : "border-white/10 bg-white/[0.025] hover:border-sky-300/20 hover:bg-white/[0.035]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="group block w-full p-4 text-left sm:p-5"
      >
        <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
          <ProjectArtwork project={project} />

          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="line-clamp-1 text-xl font-black text-white">
                    {project.title}
                  </h3>

                  {hasAttention(project) ? (
                    <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-yellow-100">
                      Update Requested
                    </span>
                  ) : null}

                  {project.featured ? (
                    <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-sky-200">
                      Featured
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {project.type ? (
                    <span className="text-xs font-semibold text-white/38">
                      {project.type}
                    </span>
                  ) : null}

                  {project.type && project.genre ? (
                    <span className="text-white/15">
                      •
                    </span>
                  ) : null}

                  {project.genre ? (
                    <span className="text-xs font-semibold text-white/38">
                      {project.genre}
                    </span>
                  ) : null}

                  {(project.type || project.genre) &&
                  project.year ? (
                    <span className="text-white/15">
                      •
                    </span>
                  ) : null}

                  {project.year ? (
                    <span className="text-xs font-semibold text-white/38">
                      {project.year}
                    </span>
                  ) : null}
                </div>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] ${stageClass(
                  project.workflowStage
                )}`}
              >
                {stageLabels[project.workflowStage] ||
                  project.workflowStage}
              </span>
            </div>

            <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-white/42">
              {project.description ||
                "No description provided."}
            </p>

            <ReviewTimeline
              currentStage={project.workflowStage}
            />

            <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              {displayDate ? (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                    {project.publishedAt
                      ? "Published"
                      : "Scheduled"}
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white/45">
                    {formatDate(displayDate)}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-white/25">
                  No release date assigned
                </p>
              )}

              <span className="inline-flex items-center gap-2 text-xs font-black text-sky-200">
                {expanded
                  ? "Hide Project Details"
                  : "View Project Details"}

                <ChevronIcon expanded={expanded} />
              </span>
            </div>
          </div>
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ExpandedProjectDetails project={project} />
        </div>
      </div>
    </article>
  );
}

function ExpandedProjectDetails({
  project,
}: {
  project: PartnerProject;
}) {
  const notes = [
    {
      title: "Metadata Notes",
      description:
        "Title information, descriptions, artwork, and catalog details.",
      value: project.metadataNotes,
      tone: "sky",
    },
    {
      title: "Content Notes",
      description:
        "Video, audio, captions, quality, and content review.",
      value: project.contentNotes,
      tone: "violet",
    },
    {
      title: "Rights Notes",
      description:
        "Licensing, ownership, clearance, and territory requirements.",
      value: project.rightsNotes,
      tone: "yellow",
    },
    {
      title: "General Review Notes",
      description:
        "Additional feedback from the SourceTV review team.",
      value: project.reviewNotes,
      tone: "neutral",
    },
  ];

  const hasAnyAsset = Boolean(
    project.thumbnailUrl ||
      project.backdropUrl ||
      project.trailerUrl ||
      project.mainVideoUrl ||
      project.videoUrl
  );

  return (
    <div className="border-t border-white/10 bg-black/20 p-4 sm:p-5 lg:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <SectionHeader
              eyebrow="Project Overview"
              title="Project information"
              description="The core details currently connected to this submission."
            />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DetailItem
                label="Title"
                value={project.title}
              />

              <DetailItem
                label="Type"
                value={project.type || "Not set"}
              />

              <DetailItem
                label="Genre"
                value={project.genre || "Not set"}
              />

              <DetailItem
                label="Year"
                value={
                  project.year?.toString() || "Not set"
                }
              />

              <DetailItem
                label="Runtime"
                value={project.runtime || "Not set"}
              />

              <DetailItem
                label="Maturity Rating"
                value={
                  project.maturityRating || "Not set"
                }
              />

              <DetailItem
                label="Partner / Filmmaker"
                value={
                  project.creatorName || "Not set"
                }
              />

              <DetailItem
                label="Company"
                value={
                  project.creatorCompany || "Not set"
                }
              />

              <DetailItem
                label="Recognition"
                value={getRecognition(project)}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                Description
              </p>

              <p className="mt-3 text-sm leading-7 text-white/55">
                {project.description ||
                  "No description has been provided for this project."}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <SectionHeader
              eyebrow="Review Team"
              title="Notes and requested updates"
              description="Feedback connected to each stage of the SourceTV review process."
            />

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {notes.map((note) => (
                <ReviewNote
                  key={note.title}
                  title={note.title}
                  description={note.description}
                  value={note.value}
                  tone={note.tone}
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <SectionHeader
              eyebrow="Media Library"
              title="Project assets"
              description="Artwork and video files currently attached to this title."
            />

            {hasAnyAsset ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <AssetCard
                  title="Poster / Thumbnail"
                  url={project.thumbnailUrl}
                  type="image"
                  aspect="poster"
                />

                <AssetCard
                  title="Backdrop"
                  url={project.backdropUrl}
                  type="image"
                  aspect="wide"
                />

                <AssetCard
                  title="Trailer"
                  url={project.trailerUrl}
                  type="link"
                  aspect="wide"
                />

                <AssetCard
                  title="Main Video"
                  url={
                    project.mainVideoUrl ||
                    project.videoUrl
                  }
                  type="link"
                  aspect="wide"
                />
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-7 text-center">
                <p className="text-sm font-black text-white/60">
                  No project assets available
                </p>

                <p className="mt-2 text-xs leading-5 text-white/30">
                  Artwork and video files will appear
                  here when they are attached to the
                  submission.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-sky-300/15 bg-sky-300/[0.035] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
              Current Status
            </p>

            <h3 className="mt-3 text-xl font-black text-white">
              {stageLabels[project.workflowStage] ||
                project.workflowStage}
            </h3>

            <p className="mt-3 text-sm leading-6 text-white/42">
              Your title is currently in this stage of
              the SourceTV publishing workflow.
            </p>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
              <ReviewTimeline
                currentStage={project.workflowStage}
                detailed
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Release
            </p>

            <div className="mt-4 space-y-3">
              <SideDetail
                label="Scheduled Date"
                value={
                  formatDate(project.scheduledAt) ||
                  "Not scheduled"
                }
              />

              <SideDetail
                label="Published Date"
                value={
                  formatDate(project.publishedAt) ||
                  "Not published"
                }
              />

              <SideDetail
                label="Recognition"
                value={getRecognition(project)}
              />
            </div>

            {project.workflowStage === "published" ? (
              <Link
                href={`/watch/${project.id}`}
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-xs font-black text-black transition hover:bg-sky-100"
              >
                View Live on SourceTV
              </Link>
            ) : null}
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Partner Actions
            </p>

            <div className="mt-4 space-y-3">
              <Link
                href="/partner/contracts"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-black text-white/65 transition hover:border-sky-300/25 hover:text-white"
              >
                View Contracts

                <span className="text-sky-200 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/partner/inbox"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-black text-white/65 transition hover:border-sky-300/25 hover:text-white"
              >
                Contact SourceTV

                <span className="text-sky-200 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
            <div className="border-b border-white/[0.07] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                Participation
              </p>

              <h3 className="mt-3 text-xl font-black text-white">
                Performance tools are coming
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Participation earnings and payout
                information will appear here when
                SourceTV activates partner payout cycles.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-white/[0.06]">
              <ComingSoonMetric label="Earnings" />
              <ComingSoonMetric label="Payouts" />
              <ComingSoonMetric label="Watch Time" />
              <ComingSoonMetric label="Engagement" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ProjectArtwork({
  project,
}: {
  project: PartnerProject;
}) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 lg:block">
      <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-[#070a10] lg:hidden">
        {project.thumbnailUrl ? (
          <img
            src={project.thumbnailUrl}
            alt={`${project.title} poster`}
            className="h-full w-full object-cover"
          />
        ) : (
          <ArtworkPlaceholder label="Poster" />
        )}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-[#070a10]">
        {project.backdropUrl ||
        project.thumbnailUrl ? (
          <img
            src={
              project.backdropUrl ||
              project.thumbnailUrl ||
              ""
            }
            alt={`${project.title} artwork`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <ArtworkPlaceholder label="Project Artwork" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        <div className="absolute bottom-3 left-3 hidden lg:block">
          <div className="w-14 overflow-hidden rounded-lg border border-white/10 bg-black/50 shadow-2xl">
            <div className="aspect-[2/3]">
              {project.thumbnailUrl ? (
                <img
                  src={project.thumbnailUrl}
                  alt={`${project.title} poster thumbnail`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ArtworkPlaceholder
                  label="Poster"
                  compact
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewTimeline({
  currentStage,
  detailed = false,
}: {
  currentStage: string;
  detailed?: boolean;
}) {
  const currentIndex = getStageIndex(currentStage);
  const isRejected = currentStage === "rejected";
  const isArchived = currentStage === "archived";

  return (
    <div className={detailed ? "" : "mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4"}>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
        Review Progress
      </p>

      <p className="mt-1 text-xs text-white/30">
        {isRejected
          ? "This submission was not approved."
          : isArchived
            ? "This project is archived."
            : stageLabels[currentStage] ||
              currentStage}
      </p>

      {!isRejected && !isArchived ? (
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {reviewStages.map((stage, index) => {
            const complete = index < currentIndex;
            const active = index === currentIndex;

            return (
              <div
                key={stage.value}
                className="min-w-0"
              >
                <div
                  className={`h-1.5 rounded-full ${
                    complete
                      ? "bg-emerald-300/75"
                      : active
                        ? "bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.55)]"
                        : "bg-white/10"
                  }`}
                />

                <p
                  className={`mt-2 truncate text-[9px] font-black uppercase tracking-[0.08em] ${
                    active
                      ? "text-sky-200"
                      : complete
                        ? "text-white/40"
                        : "text-white/20"
                  }`}
                >
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

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-lg font-black text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {description}
      </p>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white/70">
        {value}
      </p>
    </div>
  );
}

function ReviewNote({
  title,
  description,
  value,
  tone,
}: {
  title: string;
  description: string;
  value?: string | null;
  tone: string;
}) {
  const hasNote = Boolean(value);

  const toneClass =
    tone === "yellow"
      ? "border-yellow-300/15 bg-yellow-300/[0.035]"
      : tone === "violet"
        ? "border-violet-300/15 bg-violet-300/[0.035]"
        : tone === "sky"
          ? "border-sky-300/15 bg-sky-300/[0.035]"
          : "border-white/[0.08] bg-black/20";

  return (
    <div
      className={`rounded-2xl border p-4 ${toneClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-white/80">
            {title}
          </p>

          <p className="mt-1 text-[11px] leading-5 text-white/30">
            {description}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] ${
            hasNote
              ? "border-yellow-300/15 bg-yellow-300/[0.06] text-yellow-100"
              : "border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-200"
          }`}
        >
          {hasNote ? "Review" : "Clear"}
        </span>
      </div>

      <div className="mt-4 border-t border-white/[0.07] pt-4">
        <p
          className={`text-sm leading-6 ${
            hasNote
              ? "text-white/60"
              : "text-white/30"
          }`}
        >
          {value || "No notes have been added."}
        </p>
      </div>
    </div>
  );
}

function AssetCard({
  title,
  url,
  type,
  aspect,
}: {
  title: string;
  url?: string | null;
  type: "image" | "link";
  aspect: "poster" | "wide";
}) {
  const aspectClass =
    aspect === "poster"
      ? "aspect-[2/3]"
      : "aspect-video";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/20">
      <div
        className={`${aspectClass} relative overflow-hidden bg-[#070a10]`}
      >
        {type === "image" && url ? (
          <img
            src={url}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_55%)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/35">
              <PlayIcon />
            </div>
          </div>
        )}

        {!url ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
            <span className="text-xs font-semibold text-white/25">
              Not uploaded
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <p className="text-sm font-black text-white/75">
          {title}
        </p>

        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 text-xs font-black text-sky-300 transition hover:text-sky-200"
          >
            Open Asset
            <span>↗</span>
          </a>
        ) : (
          <p className="mt-2 text-xs text-white/30">
            No file attached
          </p>
        )}
      </div>
    </div>
  );
}

function SideDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs font-semibold text-white/30">
        {label}
      </p>

      <p className="max-w-[180px] text-right text-xs font-black text-white/65">
        {value}
      </p>
    </div>
  );
}

function ComingSoonMetric({
  label,
}: {
  label: string;
}) {
  return (
    <div className="bg-[#090c13] p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-white/45">
        Coming Soon
      </p>
    </div>
  );
}

function ArtworkPlaceholder({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(255,255,255,0.025),rgba(255,255,255,0.005))]">
      <span
        className={`text-center font-semibold text-white/20 ${
          compact
            ? "px-1 text-[8px]"
            : "px-3 text-xs"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/[0.025]"
        />
      ))}
    </div>
  );
}

function EmptyCatalog() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 sm:p-10">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
        Your Studio
      </p>

      <h3 className="mt-3 text-2xl font-black text-white">
        Welcome to your project catalog.
      </h3>

      <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
        Every film, series, documentary, episode, and
        animation you submit will appear here with its
        review status and publishing progress.
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

function EmptySearch({
  onClear,
}: {
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">
      <h3 className="text-xl font-black text-white">
        No matching projects
      </h3>

      <p className="mt-2 text-sm text-white/40">
        Try changing your search, status, type, or sort
        order.
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

function SearchIcon() {
  return (
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
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function ChevronIcon({
  expanded,
}: {
  expanded: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 transition duration-300 ${
        expanded ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CatalogIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function PublishedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12 2.25 2.25L15.75 9" />
    </svg>
  );
}

function AttentionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 4 3.8 19h16.4L12 4Z" />
      <path d="M12 9v4" />
      <path d="M12 16.5h.01" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="ml-0.5 h-5 w-5"
      aria-hidden="true"
    >
      <path d="M8 5.5v13l10-6.5L8 5.5Z" />
    </svg>
  );
}