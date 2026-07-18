"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PartnerProject = {
  recognitionLevel?: string | null;
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  workflowStage: string;
  featured?: boolean | null;
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

const reviewStages = [
  "submission",
  "metadata_review",
  "content_review",
  "rights_review",
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

function getAttentionNote(project: PartnerProject) {
  if (project.rightsNotes) {
    return {
      label: "Rights update required",
      note: project.rightsNotes,
    };
  }

  if (project.contentNotes) {
    return {
      label: "Content update required",
      note: project.contentNotes,
    };
  }

  if (project.metadataNotes) {
    return {
      label: "Metadata update required",
      note: project.metadataNotes,
    };
  }

  if (project.reviewNotes) {
    return {
      label: "Review note received",
      note: project.reviewNotes,
    };
  }

  return null;
}

export default function PartnerDashboardClient() {
  const [projects, setProjects] = useState<PartnerProject[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error("PARTNER DASHBOARD LOAD ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const stats = useMemo(() => {
    return {
      total: projects.length,

      inReview: projects.filter((project) =>
        reviewStages.includes(project.workflowStage)
      ).length,

      scheduled: projects.filter(
        (project) => project.workflowStage === "scheduled"
      ).length,

      published: projects.filter(
        (project) => project.workflowStage === "published"
      ).length,
    };
  }, [projects]);

  const recentProjects = projects.slice(0, 5);

  const attentionProjects = projects
    .filter(
      (project) =>
        project.rightsNotes ||
        project.contentNotes ||
        project.metadataNotes ||
        project.reviewNotes
    )
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
            SourceTV Partner Studio
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Manage your submissions, review progress, contracts, and published
            work.
          </p>
        </div>

        <Link
          href="/creator/submit"
          className="w-fit rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black transition hover:bg-sky-200"
        >
          Submit New Work
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Works"
          value={stats.total}
        />

        <StatCard
          label="In Review"
          value={stats.inReview}
        />

        <StatCard
          label="Scheduled"
          value={stats.scheduled}
        />

        <StatCard
          label="Published"
          value={stats.published}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <QuickLink
          title="Projects"
          description="Manage your submitted work"
          href="/partner/projects"
        />

        <QuickLink
          title="Contracts"
          description="Review agreements and updates"
          href="/partner/contracts"
        />

        <QuickLink
          title="Inbox"
          description="Read messages from SourceTV"
          href="/partner/inbox"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_340px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-sky-300">
                My Work
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Recent projects
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Your latest submissions and publishing updates.
              </p>
            </div>

            <Link
              href="/partner/projects"
              className="w-fit rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-black text-white/60 transition hover:border-sky-300/30 hover:text-white"
            >
              View All
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-white/40">
                Loading projects...
              </div>
            ) : recentProjects.length === 0 ? (
              <EmptyProjects />
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-yellow-100">
              Needs Attention
            </p>

            <h2 className="mt-2 text-xl font-black">
              Requested updates
            </h2>
          </div>

          <div className="mt-5">
            {loading ? (
              <p className="text-sm text-white/40">
                Checking your projects...
              </p>
            ) : attentionProjects.length === 0 ? (
              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-4">
                <p className="text-sm font-black text-emerald-200">
                  You’re all caught up
                </p>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  There are no requested changes waiting for you.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attentionProjects.map((project) => {
                  const attention = getAttentionNote(project);

                  return (
                    <Link
                      key={project.id}
                      href={`/partner/projects/${project.id}`}
                      className="block rounded-2xl border border-yellow-300/15 bg-yellow-300/[0.035] p-4 transition hover:border-yellow-300/30"
                    >
                      <p className="line-clamp-1 text-sm font-black">
                        {project.title}
                      </p>

                      <p className="mt-1 text-xs font-black text-yellow-100">
                        {attention?.label}
                      </p>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/40">
                        {attention?.note}
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight">
        {value}
      </p>
    </div>
  );
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-sky-300/30 hover:bg-sky-300/[0.035]"
    >
      <div>
        <p className="text-sm font-black">
          {title}
        </p>

        <p className="mt-1 text-xs text-white/38">
          {description}
        </p>
      </div>

      <span className="text-lg text-white/30 transition group-hover:translate-x-1 group-hover:text-sky-200">
        →
      </span>
    </Link>
  );
}

function ProjectRow({
  project,
}: {
  project: PartnerProject;
}) {
  const releaseDate =
    project.publishedAt || project.scheduledAt;

  return (
    <Link
      href={`/partner/projects/${project.id}`}
      className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-sky-300/25 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:items-center"
    >
      <div
        className="aspect-video rounded-xl bg-zinc-950 bg-cover bg-center"
        style={{
          backgroundImage:
            project.backdropUrl || project.thumbnailUrl
              ? `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1)), url(${
                  project.backdropUrl || project.thumbnailUrl
                })`
              : "linear-gradient(135deg,#07111f,#020617)",
        }}
      />

      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-black">
          {project.title}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${stageClass(
              project.workflowStage
            )}`}
          >
            {stageLabels[project.workflowStage] ||
              project.workflowStage}
          </span>

          {project.type && (
            <span className="text-xs font-semibold text-white/35">
              {project.type}
            </span>
          )}

          {project.genre && (
            <span className="text-xs font-semibold text-white/35">
              {project.genre}
            </span>
          )}
        </div>
      </div>

      <div className="text-left sm:text-right">
        {releaseDate && (
          <p className="text-xs font-semibold text-white/35">
            {formatDate(releaseDate)}
          </p>
        )}

        <p className="mt-1 text-xs font-black text-sky-200">
          Open →
        </p>
      </div>
    </Link>
  );
}

function EmptyProjects() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-7">
      <h3 className="text-lg font-black">
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