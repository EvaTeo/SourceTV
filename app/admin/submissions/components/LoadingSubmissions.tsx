export default function LoadingSubmissions() {
  return (
    <section className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.025]"
        >
          <div className="grid animate-pulse md:grid-cols-[190px_minmax(0,1fr)]">
            <div className="min-h-[190px] bg-white/[0.035]" />

            <div className="p-6">
              <div className="h-5 w-24 rounded bg-white/[0.055]" />

              <div className="mt-5 h-7 w-2/5 rounded bg-white/[0.055]" />

              <div className="mt-3 h-4 w-1/4 rounded bg-white/[0.04]" />

              <div className="mt-5 h-4 w-full rounded bg-white/[0.04]" />

              <div className="mt-2 h-4 w-3/4 rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}