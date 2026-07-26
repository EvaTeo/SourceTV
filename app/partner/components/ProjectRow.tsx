import Link from "next/link";

import type { PartnerProject } from "../types";
import {
  formatDate,
  stageClass,
  stageLabels,
} from "../utils";

type ProjectRowProps = {
  project: PartnerProject;
};

export default function ProjectRow({
  project,
}: ProjectRowProps) {
  const releaseDate =
    project.publishedAt || project.scheduledAt;

  return (
    <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-sky-300/25 sm:grid-cols-[80px_minmax(0,1fr)_auto] sm:items-center">
      <Link
        href={`/partner/projects/${project.id}`}
        aria-label={`Open ${project.title}`}
        className="block"
      >
        <div
          className="aspect-video rounded-xl bg-zinc-950 bg-cover bg-center"
          style={{
            backgroundImage:
              project.backdropUrl ||
              project.thumbnailUrl
                ? `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1)), url(${
                    project.backdropUrl ||
                    project.thumbnailUrl
                  })`
                : "linear-gradient(135deg,#07111f,#020617)",
          }}
        />
      </Link>

      <Link
        href={`/partner/projects/${project.id}`}
        className="min-w-0"
      >
        <p className="line-clamp-1 text-sm font-black transition hover:text-sky-200">
          {project.title}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${stageClass(
              project.workflowStage
            )}`}
          >
            {stageLabels[
              project.workflowStage
            ] ?? project.workflowStage}
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
      </Link>

      <div className="flex flex-col gap-3 text-left sm:items-end sm:text-right">
        {releaseDate && (
          <p className="text-xs font-semibold text-white/35">
            {formatDate(releaseDate)}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Link
            href={`/partner/projects/${project.id}`}
            className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-[11px] font-black text-white/60 transition hover:border-white/20 hover:text-white"
          >
            Open
          </Link>

          <Link
            href={`/partner/projects/${project.id}/edit`}
            className="rounded-lg border border-sky-300/25 bg-sky-300/10 px-3 py-2 text-[11px] font-black text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-300/15"
          >
            Edit Project
          </Link>
        </div>
      </div>
    </div>
  );
}