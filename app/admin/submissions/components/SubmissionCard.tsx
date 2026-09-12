import StatusBadge from "@/app/components/admin/StatusBadge";

import type { Submission } from "../types";

import {
  formatStatus,
  formatSubmissionDate,
} from "../utils";

import {
  ApproveIcon,
  ArtworkIcon,
  ChevronIcon,
  DenyIcon,
  ExternalLinkIcon,
  Spinner,
} from "./SubmissionIcons";

type SubmissionCardProps = {
  submission: Submission;
  saving: boolean;
  expanded: boolean;
  normalizedStatus: string;

  onToggle: () => void;
  onApprove: () => void;
  onDeny: () => void;
};

export default function SubmissionCard({
  submission,
  saving,
  expanded,
  normalizedStatus,
  onToggle,
  onApprove,
  onDeny,
}: SubmissionCardProps) {
  const creator =
    submission.creatorCompany ||
    submission.creatorName ||
    "Creator information unavailable";

  const hasArtwork = Boolean(
    submission.backdropUrl ||
      submission.thumbnailUrl
  );

  const metadata = [
    submission.type,
    submission.genre,

    submission.year
      ? String(submission.year)
      : null,

    submission.runtime,

    submission.maturityRating &&
    submission.maturityRating !==
      "Not Rated"
      ? submission.maturityRating
      : null,
  ].filter(Boolean) as string[];

  return (
    <article className="group overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.018] shadow-[0_20px_70px_rgba(0,0,0,0.16)] transition hover:border-white/16">
      <div className="grid md:grid-cols-[190px_minmax(0,1fr)]">
        <SubmissionArtwork
          submission={submission}
          hasArtwork={hasArtwork}
        />

        <div className="min-w-0 p-5 md:p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={
                    submission.status
                  }
                />

                {metadata
                  .slice(0, 3)
                  .map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/[0.08] bg-black/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/38"
                    >
                      {item}
                    </span>
                  ))}
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-white md:text-2xl">
                {submission.title}
              </h2>

              <p className="mt-1.5 text-xs font-semibold text-white/32">
                {creator}
              </p>

              <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-white/48">
                {submission.description ||
                  "No project description was provided."}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <AssetIndicator
                  label="Main Video"
                  ready={Boolean(
                    submission.mainVideoUrl ||
                      submission.videoUrl
                  )}
                  unknown={
                    submission.mainVideoUrl ===
                      undefined &&
                    submission.videoUrl ===
                      undefined
                  }
                />

                <AssetIndicator
                  label="Trailer"
                  ready={Boolean(
                    submission.trailerUrl
                  )}
                  unknown={
                    submission.trailerUrl ===
                    undefined
                  }
                />

                <AssetIndicator
                  label="Poster"
                  ready={Boolean(
                    submission.thumbnailUrl
                  )}
                  unknown={
                    submission.thumbnailUrl ===
                    undefined
                  }
                />

                <AssetIndicator
                  label="Backdrop"
                  ready={Boolean(
                    submission.backdropUrl
                  )}
                  unknown={
                    submission.backdropUrl ===
                    undefined
                  }
                />
              </div>
            </div>

            <SubmissionActions
              saving={saving}
              expanded={expanded}
              normalizedStatus={
                normalizedStatus
              }
              onApprove={onApprove}
              onDeny={onDeny}
              onToggle={onToggle}
            />
          </div>
        </div>
      </div>

      {expanded && (
        <SubmissionDetails
          submission={submission}
        />
      )}
    </article>
  );
}

function SubmissionArtwork({
  submission,
  hasArtwork,
}: {
  submission: Submission;
  hasArtwork: boolean;
}) {
  return (
    <div
      className="relative min-h-[190px] overflow-hidden border-b border-white/10 bg-[#090c12] bg-cover bg-center md:min-h-full md:border-b-0 md:border-r"
      style={{
        backgroundImage:
          submission.backdropUrl
            ? `url("${submission.backdropUrl}")`
            : submission.thumbnailUrl
              ? `url("${submission.thumbnailUrl}")`
              : "radial-gradient(circle at 70% 20%, rgba(56,189,248,0.14), transparent 35%), linear-gradient(145deg, #111827, #07090e)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/15 to-black/55 md:bg-gradient-to-t md:from-black/75 md:via-black/15 md:to-black/20" />

      {!hasArtwork && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <ArtworkIcon />

            <p className="mt-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/22">
              Artwork unavailable
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4">
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
          Submitted
        </p>

        <p className="mt-1 text-xs font-semibold text-white/76">
          {formatSubmissionDate(
            submission.createdAt
          )}
        </p>
      </div>
    </div>
  );
}

function SubmissionActions({
  saving,
  expanded,
  normalizedStatus,
  onApprove,
  onDeny,
  onToggle,
}: {
  saving: boolean;
  expanded: boolean;
  normalizedStatus: string;
  onApprove: () => void;
  onDeny: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-wrap content-start gap-2 xl:w-[158px] xl:flex-col">
      {normalizedStatus !==
        "approved" && (
        <button
          type="button"
          disabled={saving}
          onClick={onApprove}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-2 text-xs font-black text-[#05070d] shadow-[0_12px_30px_rgba(56,189,248,0.14)] transition hover:-translate-y-0.5 hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 xl:w-full"
        >
          {saving ? (
            <>
              <Spinner dark />
              Saving...
            </>
          ) : (
            <>
              <ApproveIcon />
              Approve
            </>
          )}
        </button>
      )}

      {normalizedStatus !==
        "denied" && (
        <button
          type="button"
          disabled={saving}
          onClick={onDeny}
          className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-300/20 bg-red-300/[0.065] px-4 py-2 text-xs font-bold text-red-200 transition hover:border-red-300/35 hover:bg-red-300/[0.1] disabled:cursor-not-allowed disabled:opacity-45 xl:w-full"
        >
          <DenyIcon />
          Deny
        </button>
      )}

      <button
        type="button"
        onClick={onToggle}
        className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2 text-xs font-bold text-white/48 transition hover:border-white/18 hover:bg-white/[0.045] hover:text-white/75 xl:w-full"
      >
        {expanded
          ? "Hide Details"
          : "Review Details"}

        <ChevronIcon
          expanded={expanded}
        />
      </button>
    </div>
  );
}

function SubmissionDetails({
  submission,
}: {
  submission: Submission;
}) {
  return (
    <div className="border-t border-white/10 bg-black/15 p-5 md:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
              Full Description
            </p>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/52">
              {submission.description ||
                "No project description was provided."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Project Type"
              value={
                submission.type ||
                "Not provided"
              }
            />

            <DetailItem
              label="Genre"
              value={
                submission.genre ||
                "Not provided"
              }
            />

            <DetailItem
              label="Release Year"
              value={
                submission.year
                  ? String(
                      submission.year
                    )
                  : "Not provided"
              }
            />

            <DetailItem
              label="Runtime"
              value={
                submission.runtime ||
                "Not provided"
              }
            />

            <DetailItem
              label="Maturity Rating"
              value={
                submission.maturityRating ||
                "Not rated"
              }
            />

            <DetailItem
              label="Current Status"
              value={formatStatus(
                submission.status
              )}
            />

            <DetailItem
              label="Creator"
              value={
                submission.creatorName ||
                "Not provided"
              }
            />

            <DetailItem
              label="Company"
              value={
                submission.creatorCompany ||
                "Not provided"
              }
            />

            <DetailItem
              label="Submission ID"
              value={submission.id}
              mono
            />
          </div>
        </div>

        <SubmissionAssets
          submission={submission}
        />
      </div>
    </div>
  );
}

function SubmissionAssets({
  submission,
}: {
  submission: Submission;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
        Submitted Assets
      </p>

      <div className="mt-4 space-y-2">
        <AssetLink
          label="Main Project Video"
          url={
            submission.mainVideoUrl ||
            submission.videoUrl
          }
          unknown={
            submission.mainVideoUrl ===
              undefined &&
            submission.videoUrl ===
              undefined
          }
        />

        <AssetLink
          label="Trailer"
          url={submission.trailerUrl}
          unknown={
            submission.trailerUrl ===
            undefined
          }
        />

        <AssetLink
          label="Poster"
          url={
            submission.thumbnailUrl
          }
          unknown={
            submission.thumbnailUrl ===
            undefined
          }
        />

        <AssetLink
          label="Backdrop"
          url={
            submission.backdropUrl
          }
          unknown={
            submission.backdropUrl ===
            undefined
          }
        />

        <AssetLink
          label="Title Logo"
          url={
            submission.titleLogoUrl
          }
          unknown={
            submission.titleLogoUrl ===
            undefined
          }
        />
      </div>
    </div>
  );
}

function AssetIndicator({
  label,
  ready,
  unknown,
}: {
  label: string;
  ready: boolean;
  unknown: boolean;
}) {
  const status = unknown
    ? "Unknown"
    : ready
      ? "Ready"
      : "Missing";

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/15 px-2.5 py-2">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          unknown
            ? "bg-white/18"
            : ready
              ? "bg-emerald-300"
              : "bg-amber-300"
        }`}
      />

      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-white/28">
        {label}
      </span>

      <span
        className={`text-[9px] font-bold ${
          unknown
            ? "text-white/22"
            : ready
              ? "text-emerald-300/75"
              : "text-amber-200/65"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function AssetLink({
  label,
  url,
  unknown,
}: {
  label: string;
  url?: string | null;
  unknown: boolean;
}) {
  if (unknown) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-black/15 px-3 py-3">
        <span className="text-xs font-semibold text-white/43">
          {label}
        </span>

        <span className="text-[9px] font-black uppercase tracking-[0.13em] text-white/20">
          Not returned
        </span>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-black/15 px-3 py-3">
        <span className="text-xs font-semibold text-white/43">
          {label}
        </span>

        <span className="text-[9px] font-black uppercase tracking-[0.13em] text-amber-200/50">
          Missing
        </span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.025] px-3 py-3 transition hover:border-emerald-300/22 hover:bg-emerald-300/[0.05]"
    >
      <span className="text-xs font-semibold text-white/55">
        {label}
      </span>

      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.13em] text-emerald-300/70">
        Open
        <ExternalLinkIcon />
      </span>
    </a>
  );
}

function DetailItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/24">
        {label}
      </p>

      <p
        className={`mt-1.5 break-words text-xs font-semibold text-white/54 ${
          mono
            ? "font-mono text-[10px]"
            : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}