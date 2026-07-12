export default function SearchSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="relative aspect-[2/3] overflow-hidden rounded-[1rem] border border-white/[0.05] bg-white/[0.035]"
          >
            <div className="absolute inset-0 animate-[skeletonSlide_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 pt-16">
              <div className="h-4 w-4/5 rounded-full bg-white/[0.08]" />
              <div className="mt-3 h-3 w-2/5 rounded-full bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes skeletonSlide {
          from {
            transform: translateX(-130%);
          }

          to {
            transform: translateX(130%);
          }
        }
      `}</style>
    </div>
  );
}