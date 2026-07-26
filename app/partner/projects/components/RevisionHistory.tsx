"use client";

import { useEffect, useState } from "react";

import type {
  ProjectRevision,
  RevisionStatus,
} from "../types";

type RevisionHistoryProps = {
  projectId: string;
};

type ProjectHistoryResponse = {
  revisionHistory?: ProjectRevision[];
  latestRevision?: ProjectRevision | null;
};

type RevisionStatusConfig = {
  label: string;
  badgeClass: string;
  dotClass: string;
};

const revisionStatusConfig: Record<
  RevisionStatus,
  RevisionStatusConfig
> = {
  draft: {
    label: "Draft",
    badgeClass:
      "border-white/15 bg-white/[0.06] text-white/55",
    dotClass: "bg-white/35",
  },
  pending: {
    label: "Awaiting Review",
    badgeClass:
      "border-sky-300/25 bg-sky-300/10 text-sky-100",
    dotClass: "bg-sky-300",
  },
  changes_requested: {
    label: "Changes Requested",
    badgeClass:
      "border-amber-300/25 bg-amber-300/10 text-amber-100",
    dotClass: "bg-amber-300",
  },
  approved: {
    label: "Approved",
    badgeClass:
      "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
    dotClass: "bg-emerald-300",
  },
  rejected: {
    label: "Rejected",
    badgeClass:
      "border-red-300/25 bg-red-300/10 text-red-100",
    dotClass: "bg-red-300",
  },
  withdrawn: {
    label: "Withdrawn",
    badgeClass:
      "border-white/15 bg-white/[0.05] text-white/45",
    dotClass: "bg-white/30",
  },
};

export default function RevisionHistory({
  projectId,
}: RevisionHistoryProps) {
  const [revisions, setRevisions] = useState<
    ProjectRevision[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRevisionHistory() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/partner/projects/${projectId}`,
          {
            cache: "no-store",
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          window.location.href = "/login";
          return;
        }

        const data =
          (await response.json()) as ProjectHistoryResponse & {
            error?: string;
          };

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load revision history."
          );
        }

        if (!cancelled) {
          setRevisions(
            Array.isArray(data.revisionHistory)
              ? data.revisionHistory
              : []
          );
        }
      } catch (loadError) {
        console.error(
          "REVISION HISTORY LOAD ERROR:",
          loadError
        );

        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load revision history."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRevisionHistory();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025]">
      <div className="border-b border-white/[0.08] px-5 py-5 sm:px-6">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-300/70">
          Project Activity
        </p>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-black text-white">
              Revision History
            </h3>

            <p className="mt-1 text-sm leading-6 text-white/38">
              Review every submitted project update and
              the decision made by SourceTV.
            </p>
          </div>

          {!loading && !error ? (
            <p className="text-xs font-semibold text-white/25">
              {revisions.length}{" "}
              {revisions.length === 1
                ? "revision"
                : "revisions"}
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {loading ? (
          <RevisionHistoryLoading />
        ) : error ? (
          <RevisionHistoryError message={error} />
        ) : revisions.length === 0 ? (
          <EmptyRevisionHistory />
        ) : (
          <div className="space-y-0">
            {revisions.map((revision, index) => (
              <RevisionHistoryItem
                key={revision.id}
                revision={revision}
                latest={index === 0}
                finalItem={
                  index === revisions.length - 1
                }
              />
            ))}

            <OriginalSubmissionItem />
          </div>
        )}
      </div>
    </section>
  );
}

function RevisionHistoryItem({
  revision,
  latest,
  finalItem,
}: {
  revision: ProjectRevision;
  latest: boolean;
  finalItem: boolean;
}) {
  const config =
    revisionStatusConfig[revision.status] ??
    revisionStatusConfig.pending;

  const decisionDate =
    revision.reviewedAt ||
    revision.approvedAt ||
    revision.rejectedAt ||
    revision.changesRequestedAt ||
    null;

  return (
    <article className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-3">
      <div className="relative flex justify-center">
        <span
          className={`relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[#101116] ${config.dotClass}`}
        />

        {!finalItem || true ? (
          <span className="absolute bottom-0 top-4 w-px bg-white/[0.09]" />
        ) : null}
      </div>

      <div className="pb-7">
        <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-black text-white">
                  Version {revision.versionNumber}
                </h4>

                {latest ? (
                  <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-sky-200">
                    Latest
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-xs font-semibold text-white/30">
                Submitted{" "}
                {formatRevisionDate(
                  revision.submittedAt
                )}
              </p>
            </div>

            <span
              className={`w-fit rounded-full border px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[0.14em] ${config.badgeClass}`}
            >
              {config.label}
            </span>
          </div>

          {revision.changeSummary ? (
            <div className="mt-4">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                Change Summary
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                {revision.changeSummary}
              </p>
            </div>
          ) : null}

          {revision.partnerNotes ? (
            <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                Your Notes
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                {revision.partnerNotes}
              </p>
            </div>
          ) : null}

          {revision.adminNotes ? (
            <div
              className={`mt-4 rounded-xl border p-3.5 ${
                revision.status === "rejected"
                  ? "border-red-300/15 bg-red-300/[0.055]"
                  : revision.status ===
                    "changes_requested"
                  ? "border-amber-300/15 bg-amber-300/[0.055]"
                  : "border-white/[0.08] bg-white/[0.025]"
              }`}
            >
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                SourceTV Review
              </p>

              <p className="mt-2 text-sm leading-6 text-white/65">
                {revision.adminNotes}
              </p>
            </div>
          ) : null}

          {decisionDate ? (
            <p className="mt-4 text-[10px] font-semibold text-white/25">
              Reviewed{" "}
              {formatRevisionDate(decisionDate)}
              {revision.reviewedByEmail
                ? ` by ${revision.reviewedByEmail}`
                : ""}
            </p>
          ) : revision.status === "pending" ? (
            <p className="mt-4 text-[10px] font-semibold text-sky-200/55">
              Waiting for SourceTV review
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function OriginalSubmissionItem() {
  return (
    <article className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-3">
      <div className="relative flex justify-center">
        <span className="relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full bg-white/25 ring-4 ring-[#101116]" />
      </div>

      <div>
        <div className="rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] p-4 sm:p-5">
          <p className="text-sm font-black text-white/55">
            Original Project Submission
          </p>

          <p className="mt-2 text-xs leading-5 text-white/28">
            This is the original project record before
            any partner revisions were submitted.
          </p>
        </div>
      </div>
    </article>
  );
}

function RevisionHistoryLoading() {
  return (
    <div className="space-y-4">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
        >
          <div className="h-3 w-28 rounded bg-white/[0.07]" />
          <div className="mt-4 h-2.5 w-44 rounded bg-white/[0.05]" />
          <div className="mt-5 h-14 rounded-xl bg-white/[0.035]" />
        </div>
      ))}
    </div>
  );
}

function RevisionHistoryError({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-2xl border border-red-300/15 bg-red-300/[0.055] p-5">
      <p className="text-sm font-black text-red-100">
        Revision history unavailable
      </p>

      <p className="mt-2 text-sm leading-6 text-red-100/55">
        {message}
      </p>
    </div>
  );
}

function EmptyRevisionHistory() {
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] p-6 text-center">
      <p className="text-sm font-black text-white/65">
        No revisions submitted
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/32">
        Project revisions and SourceTV review decisions
        will appear here after the first update is
        submitted.
      </p>
    </div>
  );
}

function formatRevisionDate(
  value: string | null | undefined
) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}