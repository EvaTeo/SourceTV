export default function SkeletonRail({
  title = "Loading...",
}: {
  title?: string;
}) {
  return (
    <section className="animate-pulse">
      <div className="mb-5">
        <div className="h-3 w-28 rounded-full bg-white/10" />
        <div className="mt-3 h-8 w-56 rounded-full bg-white/10" />
      </div>

      <div className="flex gap-5 overflow-hidden pb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-[42vw] max-w-[170px] shrink-0 md:w-[220px] md:max-w-none"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.04]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-[skeletonSlide_1.8s_linear_infinite]" />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-3 w-16 rounded-full bg-white/10" />

                <div className="mt-3 h-5 w-4/5 rounded-full bg-white/10" />

                <div className="mt-2 h-5 w-2/3 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes skeletonSlide {
          from {
            transform: translateX(-120%);
          }

          to {
            transform: translateX(120%);
          }
        }
      `}</style>
    </section>
  );
}