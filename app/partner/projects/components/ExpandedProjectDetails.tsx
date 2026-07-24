import Link from "next/link";

import type { PartnerProject } from "../types";

import {
  formatDate,
  getRecognition,
  stageLabels,
} from "../utils";

import AssetCard from "./AssetCard";
import DetailItem from "./DetailItem";
import ReviewNote from "./ReviewNote";
import ReviewTimeline from "./ReviewTimeline";
import SideDetail from "./SideDetail";

type ExpandedProjectDetailsProps = {
  project: PartnerProject;
};

export default function ExpandedProjectDetails({
  project,
}: ExpandedProjectDetailsProps) {
  const notes = [
    {
      title: "Metadata",
      description:
        "Title information, descriptions, artwork, and catalog details.",
      value: project.metadataNotes,
      tone: "sky",
    },
    {
      title: "Content",
      description:
        "Video, audio, captions, quality, and content review.",
      value: project.contentNotes,
      tone: "violet",
    },
    {
      title: "Rights",
      description:
        "Licensing, ownership, clearance, and territory requirements.",
      value: project.rightsNotes,
      tone: "yellow",
    },
    {
      title: "General",
      description:
        "Additional feedback from the SourceTV review team.",
      value: project.reviewNotes,
      tone: "neutral",
    },
  ];

  const hasAnyAsset = Boolean(
    project.thumbnailUrl ||
      project.backdropUrl ||
      project.trailerUrl ||
      project.mainVideoUrl ||
      project.videoUrl
  );

  const stageLabel =
    stageLabels[project.workflowStage] ||
    project.workflowStage;

  return (
    <div className="bg-black/20 p-4 sm:p-5 lg:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
            <div className="border-b border-white/[0.07] px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                About This Title
              </p>

              <p className="mt-2 text-sm leading-6 text-white/38">
                The project information currently connected
                to this submission.
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
                  value={
                    project.year?.toString() ||
                    "Not set"
                  }
                />

                <DetailItem
                  label="Runtime"
                  value={project.runtime || "Not set"}
                />

                <DetailItem
                  label="Maturity Rating"
                  value={
                    project.maturityRating ||
                    "Not set"
                  }
                />

                <DetailItem
                  label="Partner / Filmmaker"
                  value={
                    project.creatorName ||
                    "Not set"
                  }
                />

                <DetailItem
                  label="Company"
                  value={
                    project.creatorCompany ||
                    "Not set"
                  }
                />

                <DetailItem
                  label="Recognition"
                  value={getRecognition(project)}
                />
              </div>

              <div className="mt-4 border-t border-white/[0.07] pt-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/28">
                  Description
                </p>

                <p className="mt-3 max-w-4xl text-sm leading-7 text-white/55">
                  {project.description ||
                    "No description has been provided for this project."}
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
            <div className="border-b border-white/[0.07] px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                SourceTV Review
              </p>

              <p className="mt-2 text-sm leading-6 text-white/38">
                Feedback and requested changes from each
                stage of the review process.
              </p>
            </div>

            <div className="grid gap-3 p-5 md:grid-cols-2">
              {notes.map((note) => (
                <ReviewNote
                  key={note.title}
                  title={note.title}
                  description={note.description}
                  value={note.value}
                  tone={note.tone}
                />
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
            <div className="border-b border-white/[0.07] px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                Project Assets
              </p>

              <p className="mt-2 text-sm leading-6 text-white/38">
                Artwork and video files currently attached
                to this title.
              </p>
            </div>

            <div className="p-5">
              {hasAnyAsset ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <AssetCard
                    title="Poster / Thumbnail"
                    url={project.thumbnailUrl}
                    type="image"
                    aspect="poster"
                  />

                  <AssetCard
                    title="Backdrop"
                    url={project.backdropUrl}
                    type="image"
                    aspect="wide"
                  />

                  <AssetCard
                    title="Trailer"
                    url={project.trailerUrl}
                    type="link"
                    aspect="wide"
                  />

                  <AssetCard
                    title="Main Video"
                    url={
                      project.mainVideoUrl ||
                      project.videoUrl
                    }
                    type="link"
                    aspect="wide"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center">
                  <p className="text-sm font-black text-white/60">
                    No project assets available
                  </p>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/30">
                    Artwork and video files will appear here
                    after they are attached to the submission.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-sky-300/20 bg-sky-300/[0.035]">
            <div className="border-b border-sky-300/10 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                Current Workflow
              </p>

              <h3 className="mt-3 text-xl font-black text-white">
                {stageLabel}
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/42">
                This is the title’s current position in
                SourceTV’s review and publishing process.
              </p>
            </div>

            <div className="p-5">
              <ReviewTimeline
                currentStage={project.workflowStage}
                detailed
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
              Release
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

            {project.workflowStage === "published" ? (
              <Link
                href={`/watch/${project.id}`}
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-xs font-black text-black transition hover:bg-sky-100"
              >
                View Live on SourceTV
              </Link>
            ) : null}
          </section>

          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
            <div className="border-b border-white/[0.07] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                Project Tools
              </p>

              <p className="mt-2 text-xs leading-5 text-white/30">
                Access the areas connected to this project.
              </p>
            </div>

            <div className="space-y-2 p-3">
              <Link
                href="/partner/contracts"
                className="group block rounded-xl border border-transparent px-4 py-3 transition hover:border-white/[0.08] hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-white/70 group-hover:text-white">
                      Contracts
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Review rights agreements
                    </p>
                  </div>

                  <span className="text-sky-200 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>

              <Link
                href="/partner/inbox"
                className="group block rounded-xl border border-transparent px-4 py-3 transition hover:border-white/[0.08] hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-white/70 group-hover:text-white">
                      SourceTV Inbox
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      Contact the review team
                    </p>
                  </div>

                  <span className="text-sky-200 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>

              <Link
                href="/partner/revenue"
                className="group block rounded-xl border border-transparent px-4 py-3 transition hover:border-white/[0.08] hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-white/70 group-hover:text-white">
                      Revenue
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      View participation information
                    </p>
                  </div>

                  <span className="text-sky-200 transition group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}