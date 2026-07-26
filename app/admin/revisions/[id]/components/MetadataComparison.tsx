type MetadataField = {
  label: string;
  live: string | number | null;
  proposed: string | number | null;
};

type MetadataComparisonProps = {
  fields: MetadataField[];
};

function value(value: string | number | null) {
  if (value === null || value === "") {
    return "Not provided";
  }

  return String(value);
}

export default function MetadataComparison({
  fields,
}: MetadataComparisonProps) {
  const changedFields = fields.filter(
    (field) => value(field.live) !== value(field.proposed)
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
          Metadata Comparison
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Changed Metadata
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Only fields that changed are shown below.
        </p>
      </div>

      {changedFields.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-white/40">
          No metadata changes were submitted.
        </div>
      ) : (
        <div className="space-y-5">
          {changedFields.map((field) => (
            <article
              key={field.label}
              className="rounded-2xl border border-sky-300/15 bg-sky-300/[0.05] p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white">
                  {field.label}
                </h3>

                <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-sky-200">
                  Updated
                </span>
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
                    Current
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {value(field.live)}
                  </p>
                </div>

                <div className="flex items-center justify-center text-3xl text-sky-300">
                  →
                </div>

                <div className="rounded-xl border border-sky-300/20 bg-sky-300/[0.08] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-sky-200">
                    Proposed
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white">
                    {value(field.proposed)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}