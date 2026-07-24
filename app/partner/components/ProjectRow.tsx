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
            {stageLabels[project.workflowStage] ??
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