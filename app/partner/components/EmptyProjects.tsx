import Link from "next/link";

export default function EmptyProjects() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-7">
      <h3 className="text-lg font-black">
        No projects submitted
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
        Submit a film, series, episode, documentary, or animation to begin the
        SourceTV review process.
      </p>

      <Link
        href="/partner/submit"
        className="mt-5 inline-flex rounded-xl bg-sky-300 px-4 py-2.5 text-xs font-black text-black transition hover:bg-sky-200"
      >
        Submit Your First Work
      </Link>
    </div>
  );
}