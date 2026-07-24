import type { PartnerProject } from "../types";

import ProjectActions from "./ProjectActions";
import ProjectAssets from "./ProjectAssets";
import ProjectHero from "./ProjectHero";
import ProjectOverview from "./ProjectOverview";
import ProjectProgress from "./ProjectProgress";
import ProjectReleaseCard from "./ProjectReleaseCard";
import ProjectReviewNotes from "./ProjectReviewNotes";

type ExpandedProjectDetailsProps = {
  project: PartnerProject;
};

export default function ExpandedProjectDetails({
  project,
}: ExpandedProjectDetailsProps) {
  return (
    <div className="bg-black/20 p-4 sm:p-5 lg:p-6">
      <div className="space-y-5">
        <ProjectHero project={project} />

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <ProjectOverview project={project} />

            <ProjectReviewNotes project={project} />

            <ProjectAssets project={project} />
          </div>

          <aside className="space-y-4">
            <ProjectProgress
              currentStage={project.workflowStage}
            />

            <ProjectActions project={project} />

            <ProjectReleaseCard project={project} />
          </aside>
        </div>
      </div>
    </div>
  );
}