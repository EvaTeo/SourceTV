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
  creatorName?: string | null;
  creatorEmail?: string | null;
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

function recognition(project: PartnerProject) {
  if (project.recognitionLevel) return project.recognitionLevel;

  if (project.featured && project.workflowStage === "published") {
    return "Featured Selection";
  }

  if (project.workflowStage === "published") return "SourceTV Selection";
  if (project.workflowStage === "approved") return "Selection Pending";

  return "In Review";
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PartnerDashboardClient() {
  const [projects, setProjects] = useState<PartnerProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/partner/projects", {
          cache: "no-store",
        });

        if (res.status === 401 || res.status === 403) {
          window.location.href = "/login";
          return;
        }

        const data = await res.json();

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
      published: projects.filter((p) => p.workflowStage === "published").length,
      inReview: projects.filter((p) =>
        ["submission", "metadata_review", "content_review", "rights_review"].includes(
          p.workflowStage
        )
      ).length,
      scheduled: projects.filter((p) => p.workflowStage === "scheduled").length,
    };
  }, [projects]);

  return (
    <main className="min-h-screen bg-black px-4 pb-32 pt-28 text-white md:px-10 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              SourceTV Partner Portal
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
              Partner Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
              Track your films, series, and submitted works through SourceTV’s
              review, rights, scheduling, publishing, and selection process.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/partner/revenue"
              className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-6 py-3 text-sm font-black text-emerald-200 transition hover:border-emerald-300/70 hover:bg-emerald-300/15"
            >
              Revenue
            </Link>

            <Link
              href="/partner/contracts"
              className="rounded-full border border-sky-300/35 bg-sky-300/10 px-6 py-3 text-sm font-black text-sky-200 transition hover:border-sky-300/70 hover:bg-sky-300/15"
            >
              Contracts
            </Link>

            <Link
              href="/partner/inbox"
              className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200"
            >
              Partner Inbox
            </Link>

            <Link
              href="/creator/submit"
              className="rounded-full bg-sky-400 px-6 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:bg-sky-300"
            >
              Submit New Work
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Works" value={stats.total} />
          <StatCard label="In Review" value={stats.inReview} />
          <StatCard label="Scheduled" value={stats.scheduled} />
          <StatCard label="Published" value={stats.published} />
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <QuickCard
            title="Revenue"
            body="View estimated earnings, title performance, and future payout information."
            href="/partner/revenue"
            label="Open Revenue"
            highlight
          />

          <QuickCard
            title="Contracts"
            body="Review agreements, sign rights contracts, or request changes."
            href="/partner/contracts"
            label="Open Contracts"
          />

          <QuickCard
            title="Inbox"
            body="Read SourceTV partner messages, review updates, and respond to requests."
            href="/partner/inbox"
            label="Open Inbox"
          />

          <QuickCard
            title="Submit Work"
            body="Submit a new film, series, episode, animation, or documentary for review."
            href="/creator/submit"
            label="Submit New Work"
          />
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
                My Works
              </p>
              <h2 className="mt-2 text-2xl font-black md:text-4xl">
                Project Status
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-black/25 p-8 text-white/45">
              Loading partner projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-black/25 p-8">
              <h3 className="text-2xl font-black">No works submitted yet.</h3>
              <p className="mt-3 text-white/55">
                Submit a film, episode, documentary, animation, or body of work
                to begin the SourceTV review process.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-black/30"
                >
                  <div className="grid md:grid-cols-[220px_1fr]">
                    <div
                      className="min-h-[190px] bg-zinc-950 bg-cover bg-center"
                      style={{
                        backgroundImage:
                          project.backdropUrl || project.thumbnailUrl
                            ? `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.2)), url(${
                                project.backdropUrl || project.thumbnailUrl
                              })`
                            : undefined,
                      }}
                    />

                    <div className="p-5">
                      <div className="flex flex-col justify-between gap-4 md:flex-row">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-sky-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                              {stageLabels[project.workflowStage] ||
                                project.workflowStage}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                              {recognition(project)}
                            </span>
                          </div>

                          <h3 className="mt-4 text-2xl font-black md:text-3xl">
                            {project.title}
                          </h3>

                          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/55">
                            {project.description || "No description provided."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-white/42">
                            {project.type && <span>{project.type}</span>}
                            {project.genre && <span>• {project.genre}</span>}
                            <span>
                              • Scheduled: {formatDate(project.scheduledAt)}
                            </span>
                            <span>
                              • Published: {formatDate(project.publishedAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-row gap-2 md:flex-col">
                          <Link
                            href={`/partner/projects/${project.id}`}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:text-sky-200"
                          >
                            Details
                          </Link>

                          {project.workflowStage === "published" && (
                            <Link
                              href={`/watch/${project.id}`}
                              className="rounded-full bg-sky-400 px-4 py-2 text-center text-xs font-black text-black"
                            >
                              View Live
                            </Link>
                          )}
                        </div>
                      </div>

                      {(project.reviewNotes ||
                        project.metadataNotes ||
                        project.contentNotes ||
                        project.rightsNotes) && (
                        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                            SourceTV Notes
                          </p>

                          <div className="mt-3 space-y-2 text-sm leading-6 text-white/55">
                            {project.metadataNotes && (
                              <p>Metadata: {project.metadataNotes}</p>
                            )}
                            {project.contentNotes && (
                              <p>Content: {project.contentNotes}</p>
                            )}
                            {project.rightsNotes && (
                              <p>Rights: {project.rightsNotes}</p>
                            )}
                            {project.reviewNotes && (
                              <p>General: {project.reviewNotes}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
    </div>
  );
}

function QuickCard({
  title,
  body,
  href,
  label,
  highlight,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-[1.5rem] border p-5 shadow-2xl backdrop-blur-xl transition ${
        highlight
          ? "border-sky-300/30 bg-sky-300/[0.08] hover:border-sky-300/60"
          : "border-white/10 bg-white/[0.045] hover:border-sky-300/35"
      }`}
    >
      <p
        className={`text-[10px] font-black uppercase tracking-[0.25em] ${
          highlight ? "text-sky-300" : "text-white/35"
        }`}
      >
        {title}
      </p>

      <p className="mt-3 text-sm leading-6 text-white/55">{body}</p>

      <p
        className={`mt-5 text-xs font-black ${
          highlight ? "text-sky-200" : "text-white/65"
        }`}
      >
        {label} →
      </p>
    </Link>
  );
}