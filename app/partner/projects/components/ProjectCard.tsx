import Link from "next/link";

import type { PartnerProject } from "../types";

import {
  formatDate,
  hasAttention,
  stageClass,
  stageLabels,
} from "../utils";

import ExpandedProjectDetails from "./ExpandedProjectDetails";
import ProjectArtwork from "./ProjectArtwork";
import ReviewTimeline from "./ReviewTimeline";

import ChevronIcon from "./icons/ChevronIcon";

type ProjectCardProps = {
  project: PartnerProject;
  expanded: boolean;
  onToggle: () => void;
};

export default function ProjectCard({
  project,
  expanded,
  onToggle,
}: ProjectCardProps) {
  const displayDate =
    project.publishedAt || project.scheduledAt;

  const stageLabel =
    stageLabels[project.workflowStage] ||
    project.workflowStage;

  const attentionRequired = hasAttention(project);

  return (
    <article
      className={`group relative overflow-hidden rounded-[28px] border transition duration-300 ${
        expanded
          ? "border-sky-300/30 bg-white/[0.05] shadow-[0_28px_90px_rgba(0,0,0,0.34)]"
          : "border-white/[0.08] bg-white/[0.025] hover:border-white/[0.14] hover:bg-white/[0.04]"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent transition-opacity duration-300 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="p-4 sm:p-5 lg:p-6">
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="block overflow-hidden rounded-2xl text-left"
          >
            <ProjectArtwork project={project} />
          </button>

          <div className="flex min-w-0 flex-col">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="min-w-0 text-left"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-300/70">
                  SourceTV Project
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <h3 className="min-w-0 text-xl font-black tracking-[-0.02em] text-white sm:text-2xl">
                    <span className="line-clamp-1">
                      {project.title}
                    </span>
                  </h3>

                  {project.featured ? (
                    <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-sky-200">
                      Featured
                    </span>
                  ) : null}

                  {attentionRequired ? (
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-amber-100">
                      Update Requested
                    </span>
                  ) : null}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-white/38">
                  {project.type ? (
                    <span>{project.type}</span>
                  ) : null}

                  {project.type && project.genre ? (
                    <span className="text-white/15">
                      •
                    </span>
                  ) : null}

                  {project.genre ? (
                    <span>{project.genre}</span>
                  ) : null}

                  {(project.type || project.genre) &&
                  project.year ? (
                    <span className="text-white/15">
                      •
                    </span>
                  ) : null}

                  {project.year ? (
                    <span>{project.year}</span>
                  ) : null}
                </div>
              </button>

             <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
  <div className="flex flex-col items-start gap-2 sm:items-end">
    <span
      className={`w-fit rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] ${stageClass(
        project.workflowStage
      )}`}
    >
      {stageLabel}
    </span>

    <span className="text-[10px] font-semibold text-white/25">
      Current review stage
    </span>

    {project.latestRevision ? (
      <>
        <span
          className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em]
          ${
            project.latestRevision.status === "approved"
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
              : project.latestRevision.status === "rejected"
              ? "border-red-400/30 bg-red-500/10 text-red-300"
              : project.latestRevision.status === "changes_requested"
              ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
              : "border-sky-400/30 bg-sky-500/10 text-sky-200"
          }`}
        >
          Revision {project.latestRevision.status.replace("_", " ")}
        </span>

        {project.latestRevision.adminNotes ? (
          <div className="max-w-xs rounded-xl border border-white/10 bg-black/20 p-3 text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/30">
              Admin Review
            </p>

            <p className="mt-2 text-xs leading-5 text-white/65">
              {project.latestRevision.adminNotes}
            </p>

            {project.latestRevision.reviewedAt && (
              <p className="mt-2 text-[10px] text-white/25">
                Reviewed{" "}
                {formatDate(
                  project.latestRevision.reviewedAt
                )}
              </p>
            )}
          </div>
        ) : null}
      </>
    ) : null}
  </div>

  <Link
    href={`/partner/projects/${project.id}/edit`}
    className="inline-flex items-center justify-center rounded-xl border border-sky-300/25 bg-sky-300/10 px-4 py-2.5 text-xs font-black text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-300/15"
  >
    {project.latestRevision?.status === "rejected" ||
    project.latestRevision?.status === "changes_requested"
      ? "Continue Editing"
      : "Edit Project"}
  </Link>
</div>
            </div>

            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              className="text-left"
            >
              <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-white/45">
                {project.description ||
                  "No project description has been provided yet."}
              </p>

              <div className="mt-5">
                <ReviewTimeline
                  currentStage={
                    project.workflowStage
                  }
                />
              </div>

              <div className="mt-5 grid gap-3 border-t border-white/[0.08] pt-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="flex flex-wrap items-center gap-5">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                      Release
                    </p>

                    <p className="mt-1 text-xs font-semibold text-white/50">
                      {displayDate
                        ? formatDate(displayDate)
                        : "Not scheduled"}
                    </p>
                  </div>

                  <div className="h-8 w-px bg-white/[0.08]" />

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                      Status
                    </p>

                    <p className="mt-1 text-xs font-semibold text-white/50">
                      {project.publishedAt
                        ? "Published"
                        : project.scheduledAt
                        ? "Scheduled"
                        : "In progress"}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-2 text-xs font-black transition ${
                    expanded
                      ? "text-white"
                      : "text-sky-200 group-hover:text-sky-100"
                  }`}
                >
                  {expanded
                    ? "Close Details"
                    : "Open Project"}

                  <span
                    className={`transition-transform duration-300 ${
                      expanded
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  >
                    <ChevronIcon
                      expanded={expanded}
                    />
                  </span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/[0.08]">
            <ExpandedProjectDetails
              project={project}
            />
          </div>
        </div>
      </div>
    </article>
  );
}