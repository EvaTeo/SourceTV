import type { PartnerProject } from "../types";

import ReviewNote from "./ReviewNote";

type ProjectReviewNotesProps = {
  project: PartnerProject;
};

export default function ProjectReviewNotes({
  project,
}: ProjectReviewNotesProps) {
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

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.07] px-5 py-4">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
          SourceTV Review Notes
        </p>

        <p className="mt-2 text-sm leading-6 text-white/38">
          Feedback and requested changes from each stage of
          the review process.
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
  );
}