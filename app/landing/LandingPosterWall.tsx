import type { LandingPosterItem } from "./landingTypes";

function PosterRow({
  items,
  direction,
  duration,
  offset = false,
  rowIndex,
}: {
  items: LandingPosterItem[];
  direction: "forward" | "reverse";
  duration: number;
  offset?: boolean;
  rowIndex: number;
}) {
  return (
    <div
      className={`landing-poster-row flex w-max gap-3 md:gap-4 ${
        direction === "reverse"
          ? "landing-poster-row-reverse"
          : ""
      } ${offset ? "-translate-x-24 md:-translate-x-40" : ""}`}
      style={{
        animationDuration: `${duration}s`,
      }}
    >
      {[...items, ...items].map((item, index) => (
        <div
          key={`${item.id}-${rowIndex}-${index}`}
          className="relative h-[178px] w-[118px] shrink-0 overflow-hidden rounded-[0.8rem] border border-white/[0.07] bg-zinc-950 shadow-[0_20px_45px_rgba(0,0,0,0.64)] md:h-[244px] md:w-[163px] md:rounded-[1rem]"
        >
          {item.thumbnailUrl ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${item.thumbnailUrl})`,
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(56,189,248,0.22),transparent_34%),linear-gradient(to_bottom,#111827,#020617)]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
        </div>
      ))}
    </div>
  );
}

export default function LandingPosterWall({
  posters,
}: {
  posters: LandingPosterItem[];
}) {
  const repeated =
    posters.length >= 10
      ? posters
      : [
          ...posters,
          ...posters,
          ...posters,
          ...posters,
        ].slice(0, 14);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute left-[-14%] top-[-9%] flex rotate-[-5deg] flex-col gap-3 opacity-[0.66] md:left-[-8%] md:top-[-24%] md:gap-4">
        <PosterRow
          items={repeated}
          direction="forward"
          duration={76}
          rowIndex={0}
        />

        <PosterRow
          items={repeated}
          direction="reverse"
          duration={88}
          offset
          rowIndex={1}
        />

        <PosterRow
          items={repeated}
          direction="forward"
          duration={82}
          rowIndex={2}
        />

        <PosterRow
          items={repeated}
          direction="reverse"
          duration={94}
          offset
          rowIndex={3}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/28" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/58" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_40%,rgba(56,189,248,0.2),transparent_34%),radial-gradient(circle_at_76%_20%,rgba(56,189,248,0.07),transparent_31%)]" />

      <div className="absolute inset-y-0 left-[33%] w-[28%] bg-black/20 blur-3xl" />

      <style jsx global>{`
        @keyframes landingPosterForward {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes landingPosterReverse {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        .landing-poster-row {
          animation-name: landingPosterForward;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .landing-poster-row-reverse {
          animation-name: landingPosterReverse;
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-poster-row {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
}