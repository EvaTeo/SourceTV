"use client";

import Link from "next/link";
import WorkflowBadge from "./WorkflowBadge";

type RelatedProjectCardProps = {
  project: {
    id: string;
    title: string;
    workflowStage?: string | null;
    recognitionLevel?: string | null;
  };
  href: string;
  label?: string;
  actionLabel?: string;
};

export default function RelatedProjectCard({
  project,
  href,
  label = "Related Project",
  actionLabel = "Open Project",
}: RelatedProjectCardProps) {
  return (
    <Link
      href={href}
      className="group mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4 transition hover:border-sky-300/25 sm:flex-row sm:items-center"
    >
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
          {label}
        </p>

        <p className="mt-2 font-black text-white">
          {project.title}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <WorkflowBadge stage={project.workflowStage} />

          {project.recognitionLevel && (
            <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-sky-200">
              {project.recognitionLevel}
            </span>
          )}
        </div>
      </div>

      <span className="text-xs font-black text-sky-200 transition group-hover:translate-x-1">
        {actionLabel} →
      </span>
    </Link>
  );
}