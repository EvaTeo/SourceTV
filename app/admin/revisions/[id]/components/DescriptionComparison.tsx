type DescriptionComparisonProps = {
  live: string | null;
  proposed: string | null;
};

function value(text: string | null) {
  if (!text || text.trim() === "") {
    return "No description provided.";
  }

  return text;
}

export default function DescriptionComparison({
  live,
  proposed,
}: DescriptionComparisonProps) {
  const changed = value(live) !== value(proposed);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
            Description Review
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Synopsis Comparison
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Compare the live synopsis with the partner's proposed version.
          </p>
        </div>

        {changed && (
          <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-sky-200">
            Updated
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
            Current Description
          </p>

          <div className="mt-5 max-h-[420px] overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-7 text-white/70">
              {value(live)}
            </p>
          </div>
        </div>

        <div className="hidden xl:flex items-center justify-center text-5xl text-sky-300">
          →
        </div>

        <div
          className={
            changed
              ? "rounded-2xl border border-sky-300/20 bg-sky-300/[0.08] p-6"
              : "rounded-2xl border border-white/10 bg-black/20 p-6"
          }
        >
          <p
            className={
              changed
                ? "text-xs font-black uppercase tracking-[0.15em] text-sky-200"
                : "text-xs font-black uppercase tracking-[0.15em] text-white/35"
            }
          >
            Proposed Description
          </p>

          <div className="mt-5 max-h-[420px] overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-7 text-white">
              {value(proposed)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}