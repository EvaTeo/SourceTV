import Link from "next/link";

import type { PartnerProject } from "../types";
import { getAttentionNote } from "../utils";

type AttentionPanelProps = {
  loading: boolean;
  projects: PartnerProject[];
};

export default function AttentionPanel({
  loading,
  projects,
}: AttentionPanelProps) {
  return (
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
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.04] p-4">
            <p className="text-sm font-black text-emerald-200">
              You're all caught up
            </p>

            <p className="mt-1 text-xs leading-5 text-white/40">
              There are no requested changes waiting for you.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => {
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
  );
}