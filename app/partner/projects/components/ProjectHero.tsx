import type { PartnerProject } from "../types";

import {
  getRecognition,
  stageClass,
  stageLabels,
} from "../utils";

type ProjectHeroProps = {
  project: PartnerProject;
};

export default function ProjectHero({
  project,
}: ProjectHeroProps) {
  const stageLabel =
    stageLabels[project.workflowStage] ||
    project.workflowStage;

  const recognition = getRecognition(project);

  const metadata = [
    project.type,
    project.genre,
    project.year?.toString(),
    project.runtime,
  ].filter(Boolean);

  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white/[0.09] bg-[#080b12]">
      <div className="absolute inset-0">
        {project.backdropUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${project.backdropUrl}")`,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.16),transparent_38%),linear-gradient(135deg,#101722,#06080d_70%)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-[#06080d] via-[#06080d]/90 to-[#06080d]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-transparent to-black/20" />
      </div>

      <div className="relative flex min-h-[360px] items-end p-5 sm:p-7 lg:min-h-[420px] lg:p-9">
        <div className="grid w-full gap-6 md:grid-cols-[150px_minmax(0,1fr)] md:items-end lg:grid-cols-[180px_minmax(0,1fr)]">
          <div className="hidden overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-[0_25px_70px_rgba(0,0,0,0.5)] md:block">
            {project.thumbnailUrl ? (
              <div
                className="aspect-[2/3] bg-cover bg-center"
                style={{
                  backgroundImage: `url("${project.thumbnailUrl}")`,
                }}
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center bg-white/[0.04] px-5 text-center">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/25">
                  No Poster
                </p>
              </div>
            )}
          </div>

          <div className="min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] ${stageClass(
                  project.workflowStage
                )}`}
              >
                {stageLabel}
              </span>

              {project.featured ? (
                <span className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-sky-100">
                  Featured
                </span>
              ) : null}

              {recognition &&
              recognition !== "None" &&
              recognition !== "Not set" ? (
                <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-white/65 backdrop-blur">
                  {recognition}
                </span>
              ) : null}
            </div>

            <p className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
              SourceTV Project
            </p>

            <h2 className="mt-2 max-w-4xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
              {project.title}
            </h2>

            {metadata.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-white/55 sm:text-sm">
                {metadata.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="flex items-center gap-2"
                  >
                    {index > 0 ? (
                      <span className="text-white/20">
                        •
                      </span>
                    ) : null}

                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <p className="mt-5 line-clamp-3 max-w-3xl text-sm leading-7 text-white/55 sm:text-[15px]">
              {project.description ||
                "No project description has been provided yet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}