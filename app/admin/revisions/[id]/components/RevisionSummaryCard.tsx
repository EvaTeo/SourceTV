type RevisionSummaryCardProps = {
  projectTitle: string;
  partnerEmail: string;
  version: number;
  status: string;
  submittedAt: Date;
  reviewedAt: Date | null;
  changedFields: string[];
};

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Awaiting review";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function RevisionSummaryCard({
  projectTitle,
  partnerEmail,
  version,
  status,
  submittedAt,
  reviewedAt,
  changedFields,
}: RevisionSummaryCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7">
      <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
            Revision Summary
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {projectTitle}
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Submitted by {partnerEmail}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white">
            Version {version}
          </span>

          <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-sky-200">
            {formatStatus(status)}
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white/35">
            Submitted
          </p>

          <p className="mt-2 text-sm text-white">
            {formatDate(submittedAt)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white/35">
            Reviewed
          </p>

          <p className="mt-2 text-sm text-white">
            {formatDate(reviewedAt)}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white/35">
            Fields Changed
          </p>

          <p className="mt-2 text-2xl font-black text-sky-300">
            {changedFields.length}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white/35">
            Changed
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {changedFields.map((field) => (
              <span
                key={field}
                className="rounded-full border border-sky-300/15 bg-sky-300/10 px-3 py-1 text-[11px] font-bold text-sky-200"
              >
                {field}
              </span>
            ))}

            {changedFields.length === 0 && (
              <span className="text-sm text-white/40">
                No changes detected
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}