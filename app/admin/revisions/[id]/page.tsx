import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import ArtworkComparison from "./components/ArtworkComparison";
import DescriptionComparison from "./components/DescriptionComparison";
import MetadataComparison from "./components/MetadataComparison";
import RevisionActions from "./components/RevisionActions";
import RevisionSummaryCard from "./components/RevisionSummaryCard";
import VideoComparison from "./components/VideoComparison";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ComparableValue = string | number | null;

type ChangedField = {
  label: string;
  live: ComparableValue;
  proposed: ComparableValue;
};

function normalizeValue(value: ComparableValue) {
  if (value === null || value === "") {
    return "Not provided";
  }

  return String(value).trim();
}

function hasChanged(
  live: ComparableValue,
  proposed: ComparableValue
) {
  return normalizeValue(live) !== normalizeValue(proposed);
}

export default async function AdminRevisionDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const revision = await prisma.projectRevision.findUnique({
    where: {
      id,
    },
    include: {
      project: true,
    },
  });

  if (!revision) {
    notFound();
  }

  const liveMainVideo =
    revision.project.mainVideoUrl ??
    revision.project.videoUrl;

  const proposedMainVideo =
    revision.proposedMainVideoUrl ??
    revision.proposedVideoUrl;

  const comparableFields: ChangedField[] = [
    {
      label: "Title",
      live: revision.project.title,
      proposed: revision.proposedTitle,
    },
    {
      label: "Description",
      live: revision.project.description,
      proposed: revision.proposedDescription,
    },
    {
      label: "Content Type",
      live: revision.project.type,
      proposed: revision.proposedType,
    },
    {
      label: "Genre",
      live: revision.project.genre,
      proposed: revision.proposedGenre,
    },
    {
      label: "Year",
      live: revision.project.year,
      proposed: revision.proposedYear,
    },
    {
      label: "Maturity Rating",
      live: revision.project.maturityRating,
      proposed: revision.proposedMaturityRating,
    },
    {
      label: "Runtime",
      live: revision.project.runtime,
      proposed: revision.proposedRuntime,
    },
    {
      label: "Creator Name",
      live: revision.project.creatorName,
      proposed: revision.proposedCreatorName,
    },
    {
      label: "Creator Company",
      live: revision.project.creatorCompany,
      proposed: revision.proposedCreatorCompany,
    },
    {
      label: "Main Video",
      live: liveMainVideo,
      proposed: proposedMainVideo,
    },
    {
      label: "Trailer",
      live: revision.project.trailerUrl,
      proposed: revision.proposedTrailerUrl,
    },
    {
      label: "Thumbnail",
      live: revision.project.thumbnailUrl,
      proposed: revision.proposedThumbnailUrl,
    },
    {
      label: "Backdrop",
      live: revision.project.backdropUrl,
      proposed: revision.proposedBackdropUrl,
    },
    {
      label: "Title Logo",
      live: revision.project.titleLogoUrl,
      proposed: revision.proposedTitleLogoUrl,
    },
    {
      label: "Card Artwork",
      live: revision.project.cardArtUrl,
      proposed: revision.proposedCardArtUrl,
    },
  ];

  const changedFields = comparableFields
    .filter((field) =>
      hasChanged(field.live, field.proposed)
    )
    .map((field) => field.label);

  const metadataFields = [
    {
      label: "Title",
      live: revision.project.title,
      proposed: revision.proposedTitle,
    },
    {
      label: "Content Type",
      live: revision.project.type,
      proposed: revision.proposedType,
    },
    {
      label: "Genre",
      live: revision.project.genre,
      proposed: revision.proposedGenre,
    },
    {
      label: "Year",
      live: revision.project.year,
      proposed: revision.proposedYear,
    },
    {
      label: "Maturity Rating",
      live: revision.project.maturityRating,
      proposed: revision.proposedMaturityRating,
    },
    {
      label: "Runtime",
      live: revision.project.runtime,
      proposed: revision.proposedRuntime,
    },
    {
      label: "Creator Name",
      live: revision.project.creatorName,
      proposed: revision.proposedCreatorName,
    },
    {
      label: "Creator Company",
      live: revision.project.creatorCompany,
      proposed: revision.proposedCreatorCompany,
    },
  ];

  const artwork = [
    {
      label: "Thumbnail",
      live: revision.project.thumbnailUrl,
      proposed: revision.proposedThumbnailUrl,
    },
    {
      label: "Backdrop",
      live: revision.project.backdropUrl,
      proposed: revision.proposedBackdropUrl,
    },
    {
      label: "Title Logo",
      live: revision.project.titleLogoUrl,
      proposed: revision.proposedTitleLogoUrl,
    },
    {
      label: "Card Artwork",
      live: revision.project.cardArtUrl,
      proposed: revision.proposedCardArtUrl,
    },
  ];

  const videos = [
    {
      label: "Main Video",
      live: liveMainVideo,
      proposed: proposedMainVideo,
    },
    {
      label: "Trailer",
      live: revision.project.trailerUrl,
      proposed: revision.proposedTrailerUrl,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-12 sm:px-6 lg:px-8">
      <section>
        <Link
          href="/admin/revisions"
          className="inline-flex items-center text-sm font-bold text-white/50 transition hover:text-white"
        >
          ← Back to revisions
        </Link>

        <div className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
            SourceTV Content Review
          </p>

          <h1 className="mt-3 break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
            Review Proposed Revision
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50 sm:text-base">
            Review the partner&apos;s proposed artwork, video,
            metadata, and synopsis before making a final decision.
          </p>
        </div>
      </section>

      <RevisionSummaryCard
        projectTitle={
          revision.proposedTitle ||
          revision.project.title
        }
        partnerEmail={revision.submittedByEmail}
        version={revision.versionNumber}
        status={revision.status}
        submittedAt={revision.submittedAt}
        reviewedAt={revision.reviewedAt}
        changedFields={changedFields}
      />

      {(revision.changeSummary ||
        revision.partnerNotes) && (
        <section className="grid gap-5 lg:grid-cols-2">
          {revision.changeSummary && (
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-sky-300">
                Change Summary
              </p>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/65">
                {revision.changeSummary}
              </p>
            </article>
          )}

          {revision.partnerNotes && (
            <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-white/40">
                Partner Notes
              </p>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/65">
                {revision.partnerNotes}
              </p>
            </article>
          )}
        </section>
      )}

      <ArtworkComparison artwork={artwork} />

      <VideoComparison videos={videos} />

      <MetadataComparison fields={metadataFields} />

      <DescriptionComparison
        live={revision.project.description}
        proposed={revision.proposedDescription}
      />

      {revision.adminNotes && (
        <section className="rounded-3xl border border-amber-300/15 bg-amber-300/[0.04] p-6">
          <p className="text-xs font-black uppercase tracking-[0.17em] text-amber-200">
            Admin Review Notes
          </p>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/70">
            {revision.adminNotes}
          </p>

          {revision.reviewedByEmail && (
            <p className="mt-5 text-xs font-bold text-white/35">
              Reviewed by {revision.reviewedByEmail}
            </p>
          )}
        </section>
      )}

      <RevisionActions
        revisionId={revision.id}
        status={revision.status}
      />
    </main>
  );
}