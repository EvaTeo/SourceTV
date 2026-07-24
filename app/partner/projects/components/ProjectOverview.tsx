import type { PartnerProject } from "../types";

import { getRecognition } from "../utils";

import DetailItem from "./DetailItem";

type ProjectOverviewProps = {
  project: PartnerProject;
};

export default function ProjectOverview({
  project,
}: ProjectOverviewProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.07] px-5 py-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
          Project Overview
        </p>

        <p className="mt-2 text-sm leading-6 text-white/38">
          The catalog information currently connected to
          this submission.
        </p>
      </div>

      <div className="p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            value={project.year?.toString() || "Not set"}
          />

          <DetailItem
            label="Runtime"
            value={project.runtime || "Not set"}
          />

          <DetailItem
            label="Maturity Rating"
            value={project.maturityRating || "Not set"}
          />

          <DetailItem
            label="Partner / Filmmaker"
            value={project.creatorName || "Not set"}
          />

          <DetailItem
            label="Company"
            value={project.creatorCompany || "Not set"}
          />

          <DetailItem
            label="Recognition"
            value={getRecognition(project)}
          />
        </div>

        <div className="mt-5 border-t border-white/[0.07] pt-5">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/28">
            Full Description
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-white/55">
            {project.description ||
              "No description has been provided for this project."}
          </p>
        </div>
      </div>
    </section>
  );
}