import Image from "next/image";

type ArtworkItem = {
  label: string;
  live: string | null;
  proposed: string | null;
};

type ArtworkComparisonProps = {
  artwork: ArtworkItem[];
};

function ArtworkCard({
  title,
  image,
  changed,
}: {
  title: string;
  image: string | null;
  changed?: boolean;
}) {
  return (
    <div
      className={
        changed
          ? "rounded-2xl border border-sky-300/25 bg-sky-300/[0.05] p-4"
          : "rounded-2xl border border-white/10 bg-white/[0.03] p-4"
      }
    >
      <p
        className={
          changed
            ? "text-xs font-black uppercase tracking-[0.15em] text-sky-200"
            : "text-xs font-black uppercase tracking-[0.15em] text-white/35"
        }
      >
        {title}
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/20 aspect-[2/3]">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={500}
            height={750}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-white/30">
            No artwork
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArtworkComparison({
  artwork,
}: ArtworkComparisonProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
          Artwork Comparison
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Visual Changes
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Compare the current SourceTV artwork with the partner's proposed
          revision.
        </p>
      </div>

      <div className="space-y-10">
        {artwork.map((item) => {
          const changed = item.live !== item.proposed;

          return (
            <div key={item.label}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-white">
                  {item.label}
                </h3>

                {changed && (
                  <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-sky-200">
                    Updated
                  </span>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <ArtworkCard
                  title="Live Project"
                  image={item.live}
                />

                <ArtworkCard
                  title="Proposed Revision"
                  image={item.proposed}
                  changed={changed}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}