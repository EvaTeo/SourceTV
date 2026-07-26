import Link from "next/link";
import RestoreRevisionButton from "./RestoreRevisionButton";

type RevisionTimelineItem = {
  id: string;
  versionNumber: number;
  status: string;
  submittedAt: Date;
  reviewedAt: Date | null;
  submittedByEmail: string;
};

type RevisionTimelineProps = {
  projectTitle: string;
  currentRevisionId: string;
  revisions: RevisionTimelineItem[];
};

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getStatusClasses(status: string) {
  switch (status) {
    case "approved":
      return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";

    case "rejected":
      return "border-red-300/20 bg-red-300/10 text-red-200";

    case "changes_requested":
      return "border-amber-300/20 bg-amber-300/10 text-amber-200";

    case "withdrawn":
      return "border-white/10 bg-white/[0.04] text-white/40";

    case "draft":
      return "border-violet-300/20 bg-violet-300/10 text-violet-200";

    case "pending":
    default:
      return "border-sky-300/20 bg-sky-300/10 text-sky-200";
  }
}

export default function RevisionTimeline({
  projectTitle,
  currentRevisionId,
  revisions,
}: RevisionTimelineProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
            Version History
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Revision Timeline
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Review every submitted version of{" "}
            {projectTitle}. Open a version to inspect its
            full comparison or restore an older version
            into a new pending revision.
          </p>
        </div>

        <span className="w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-black text-white/45">
          {revisions.length}{" "}
          {revisions.length === 1
            ? "version"
            : "versions"}
        </span>
      </div>

      {revisions.length > 0 ? (
        <div className="mt-6">
          {revisions.map((revision, index) => {
            const isCurrent =
              revision.id === currentRevisionId;

            return (
              <div
                key={revision.id}
                className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-4"
              >
                <div className="relative flex justify-center">
                  {index <
                    revisions.length - 1 && (
                    <div className="absolute bottom-0 top-5 w-px bg-white/10" />
                  )}

                  <div
                    className={
                      isCurrent
                        ? "relative z-10 mt-2 h-3 w-3 rounded-full bg-sky-300 ring-4 ring-sky-300/10"
                        : "relative z-10 mt-2 h-3 w-3 rounded-full border border-white/20 bg-[#080b12]"
                    }
                  />
                </div>

                <article
                  className={
                    isCurrent
                      ? "mb-5 rounded-2xl border border-sky-300/25 bg-sky-300/[0.06] p-5"
                      : "mb-5 rounded-2xl border border-white/10 bg-black/20 p-5"
                  }
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-black text-white">
                          Version{" "}
                          {revision.versionNumber}
                        </p>

                        {isCurrent && (
                          <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-sky-200">
                            Viewing
                          </span>
                        )}
                      </div>

                      <p className="mt-2 break-all text-xs font-bold text-white/35">
                        Submitted by{" "}
                        {revision.submittedByEmail}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${getStatusClasses(
                        revision.status
                      )}`}
                    >
                      {formatStatus(revision.status)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs font-bold text-white/35">
                    <span>
                      Submitted{" "}
                      {formatDate(
                        revision.submittedAt
                      )}
                    </span>

                    {revision.reviewedAt && (
                      <span>
                        Reviewed{" "}
                        {formatDate(
                          revision.reviewedAt
                        )}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap">
                    {isCurrent ? (
                      <span className="inline-flex min-h-9 items-center justify-center rounded-lg border border-sky-300/15 bg-sky-300/[0.05] px-3 py-2 text-xs font-black text-sky-200/70">
                        Currently Viewing
                      </span>
                    ) : (
                      <>
                        <Link
                          href={`/admin/revisions/${revision.id}`}
                          className="inline-flex min-h-9 items-center justify-center rounded-lg bg-white px-3 py-2 text-xs font-black text-black transition hover:bg-white/85"
                        >
                          View Version
                        </Link>

                        <RestoreRevisionButton
                          revisionId={revision.id}
                          versionNumber={
                            revision.versionNumber
                          }
                        />
                      </>
                    )}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-10 text-center">
          <p className="text-sm font-bold text-white/40">
            No revision history is available.
          </p>
        </div>
      )}
    </section>
  );
}