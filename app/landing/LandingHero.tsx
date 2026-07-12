import Link from "next/link";
import LandingPosterWall from "./LandingPosterWall";
import type { LandingPosterItem } from "./landingTypes";

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M8 5.8v12.4c0 .9 1 1.4 1.7.9l9.5-6.2c.7-.4.7-1.4 0-1.8L9.7 4.9C9 4.4 8 4.9 8 5.8Z" />
    </svg>
  );
}

export default function LandingHero({
  posters,
}: {
  posters: LandingPosterItem[];
}) {
  return (
    <section className="relative min-h-screen overflow-hidden px-5 pb-24 pt-28 text-white md:px-12 md:pb-28 md:pt-32">
      <LandingPosterWall posters={posters} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] max-w-[1500px] items-center">
        <div className="max-w-[900px]">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-300 md:text-xs">
            Watch Free
          </p>

          <h1 className="mt-5 max-w-5xl text-[3.15rem] font-black leading-[0.86] tracking-[-0.055em] drop-shadow-[0_16px_48px_rgba(0,0,0,0.75)] md:text-[6.4rem]">
            The Next Generation of Entertainment.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/74 md:text-xl md:leading-9">
            Watch films, series, documentaries, and animation
            from fresh voices and remarkable storytellers.
          </p>

          <p className="mt-3 text-sm font-bold text-white/46 md:text-base">
            Start free. No credit card required.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/browse"
              className="inline-flex min-w-[180px] items-center justify-center gap-3 rounded-md bg-white px-8 py-4 text-base font-black text-black shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition hover:scale-[1.025] hover:bg-sky-200"
            >
              <PlayIcon />
              Watch Free
            </Link>

            <Link
              href="/login"
              className="inline-flex min-w-[150px] items-center justify-center rounded-md border border-white/16 bg-black/38 px-8 py-4 text-base font-black text-white/82 shadow-[0_16px_40px_rgba(0,0,0,0.32)] backdrop-blur-xl transition hover:scale-[1.025] hover:border-white/28 hover:bg-white/[0.1] hover:text-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}