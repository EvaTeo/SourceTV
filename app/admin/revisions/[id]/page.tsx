import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import RevisionActions from "./components/RevisionActions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ComparisonRowProps = {
  label: string;
  liveValue: string | number | null;
  proposedValue: string | number | null;
};

function displayValue(value: string | number | null) {
  if (value === null || value === "") {
    return "Not provided";
  }

  return String(value);
}

function ComparisonRow({
  label,
  liveValue,
  proposedValue,
}: ComparisonRowProps) {
  const changed =
    displayValue(liveValue) !== displayValue(proposedValue);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.17em] text-white/40">
          {label}
        </p>

        {changed && (
          <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200">
            Changed
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-white/30">
            Live Project
          </p>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-white/60">
            {displayValue(liveValue)}
          </p>
        </div>

        <div
          className={
            changed
              ? "rounded-xl border border-sky-300/25 bg-sky-300/[0.07] p-4"
              : "rounded-xl border border-white/10 bg-black/10 p-4"
          }
        >
          <p
            className={
              changed
                ? "text-[11px] font-black uppercase tracking-[0.16em] text-sky-200"
                : "text-[11px] font-black uppercase tracking-[0.16em] text-white/30"
            }
          >
            Proposed Revision
          </p>

          <p
            className={
              changed
                ? "mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-white"
                : "mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-white/60"
            }
          >
            {displayValue(proposedValue)}
          </p>
        </div>
      </div>
    </article>
  );
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
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

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 pb-12 sm:px-6 lg:px-8">
      <section>
        <Link
          href="/admin/revisions"
          className="inline-flex items-center text-sm font-bold text-white/50 transition hover:text-white"
        >
          ← Back to revisions
        </Link>

        <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
              Revision Review
            </p>

            <h1 className="mt-3 break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
              {revision.proposedTitle}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50 sm:text-base">
              Compare the partner&apos;s proposed changes with the current
              SourceTV project before making a review decision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white/70">
              {formatStatus(revision.status)}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-white/45">
              Version {revision.versionNumber}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
            Submitted By
          </p>

          <p className="mt-2 break-words text-sm font-bold text-white">
            {revision.submittedByEmail}
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
            Submitted
          </p>

          <p className="mt-2 text-sm font-bold text-white">
            {formatDate(revision.submittedAt)}
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
            Live Project
          </p>

          <p className="mt-2 break-words text-sm font-bold text-white">
            {revision.project.title}
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
            Reviewed By
          </p>

          <p className="mt-2 break-words text-sm font-bold text-white">
            {revision.reviewedByEmail ?? "Awaiting review"}
          </p>
        </article>
      </section>

      {(revision.changeSummary ||
        revision.partnerNotes ||
        revision.adminNotes) && (
        <section className="grid gap-5 lg:grid-cols-2">
          {revision.changeSummary && (
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-sky-300">
                Change Summary
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/65">
                {revision.changeSummary}
              </p>
            </article>
          )}

          {revision.partnerNotes && (
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-white/40">
                Partner Notes
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/65">
                {revision.partnerNotes}
              </p>
            </article>
          )}

          {revision.adminNotes && (
            <article className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-6 lg:col-span-2">
              <p className="text-xs font-black uppercase tracking-[0.17em] text-amber-200">
                Admin Review Notes
              </p>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/70">
                {revision.adminNotes}
              </p>
            </article>
          )}
        </section>
      )}

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-white">
            Project Comparison
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Each field is contained inside the same centered review column.
            Proposed changes are highlighted.
          </p>
        </div>

        <ComparisonRow
          label="Title"
          liveValue={revision.project.title}
          proposedValue={revision.proposedTitle}
        />

        <ComparisonRow
          label="Description"
          liveValue={revision.project.description}
          proposedValue={revision.proposedDescription}
        />

        <ComparisonRow
          label="Content Type"
          liveValue={revision.project.type}
          proposedValue={revision.proposedType}
        />

        <ComparisonRow
          label="Genre"
          liveValue={revision.project.genre}
          proposedValue={revision.proposedGenre}
        />

        <ComparisonRow
          label="Year"
          liveValue={revision.project.year}
          proposedValue={revision.proposedYear}
        />

        <ComparisonRow
          label="Maturity Rating"
          liveValue={revision.project.maturityRating}
          proposedValue={revision.proposedMaturityRating}
        />

        <ComparisonRow
          label="Runtime"
          liveValue={revision.project.runtime}
          proposedValue={revision.proposedRuntime}
        />

        <ComparisonRow
          label="Creator Name"
          liveValue={revision.project.creatorName}
          proposedValue={revision.proposedCreatorName}
        />

        <ComparisonRow
          label="Creator Company"
          liveValue={revision.project.creatorCompany}
          proposedValue={revision.proposedCreatorCompany}
        />

        <ComparisonRow
          label="Main Video"
          liveValue={
            revision.project.mainVideoUrl ??
            revision.project.videoUrl
          }
          proposedValue={
            revision.proposedMainVideoUrl ??
            revision.proposedVideoUrl
          }
        />

        <ComparisonRow
          label="Trailer"
          liveValue={revision.project.trailerUrl}
          proposedValue={revision.proposedTrailerUrl}
        />

        <ComparisonRow
          label="Thumbnail"
          liveValue={revision.project.thumbnailUrl}
          proposedValue={revision.proposedThumbnailUrl}
        />

        <ComparisonRow
          label="Backdrop"
          liveValue={revision.project.backdropUrl}
          proposedValue={revision.proposedBackdropUrl}
        />

        <ComparisonRow
          label="Title Logo"
          liveValue={revision.project.titleLogoUrl}
          proposedValue={revision.proposedTitleLogoUrl}
        />

        <ComparisonRow
          label="Card Artwork"
          liveValue={revision.project.cardArtUrl}
          proposedValue={revision.proposedCardArtUrl}
        />
      </section>

      <RevisionActions
        revisionId={revision.id}
        status={revision.status}
      />
    </main>
  );
}