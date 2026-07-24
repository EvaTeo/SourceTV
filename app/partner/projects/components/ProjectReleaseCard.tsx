import type { PartnerProject } from "../types";

import {
  formatDate,
  getRecognition,
} from "../utils";

import SideDetail from "./SideDetail";

type ProjectReleaseCardProps = {
  project: PartnerProject;
};

export default function ProjectReleaseCard({
  project,
}: ProjectReleaseCardProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        Release Information
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
    </section>
  );
}