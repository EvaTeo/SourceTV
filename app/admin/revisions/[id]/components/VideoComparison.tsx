type VideoComparisonItem = {
  label: string;
  live: string |null;
  proposed: string | null;
};

type VideoComparisonProps = {
  videos: VideoComparisonItem[];
};

function VideoCard({
  title,
  url,
  changed,
}: {
  title: string;
  url: string | null;
  changed?: boolean;
}) {
  return (
    <div
      className={
        changed
          ? "rounded-2xl border border-sky-300/20 bg-sky-300/[0.05] p-5"
          : "rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      }
    >
      <p
        className={
          changed
            ? "text-xs font-black uppercase tracking-[0.16em] text-sky-200"
            : "text-xs font-black uppercase tracking-[0.16em] text-white/35"
        }
      >
        {title}
      </p>

      <div className="mt-5 flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-black/30">
        {url ? (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl">
              ▶
            </div>

            <p className="mt-4 text-sm text-white/70">
              Video Attached
            </p>

            <p className="mt-2 break-all text-xs text-white/30">
              {url}
            </p>
          </div>
        ) : (
          <p className="text-sm text-white/30">
            No video uploaded
          </p>
        )}
      </div>
    </div>
  );
}

export default function VideoComparison({
  videos,
}: VideoComparisonProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
          Video Comparison
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Media Review
        </h2>

        <p className="mt-2 text-sm text-white/45">
          Compare the current media with the proposed revision.
        </p>
      </div>

      <div className="space-y-10">
        {videos.map((video) => {
          const changed =
            video.live !== video.proposed;

          return (
            <div key={video.label}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-white">
                  {video.label}
                </h3>

                {changed && (
                  <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-sky-200">
                    Updated
                  </span>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <VideoCard
                  title="Live Project"
                  url={video.live}
                />

                <VideoCard
                  title="Proposed Revision"
                  url={video.proposed}
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