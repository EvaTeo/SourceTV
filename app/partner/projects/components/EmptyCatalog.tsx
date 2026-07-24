import Link from "next/link";

export default function EmptyCatalog() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 sm:p-10">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
        Your Studio
      </p>

      <h3 className="mt-3 text-2xl font-black text-white">
        Welcome to your project catalog.
      </h3>

      <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
        Every film, series, documentary, episode, and
        animation you submit will appear here with its
        review status and publishing progress.
      </p>

      <Link
        href="/partner/submit"
        className="mt-6 inline-flex rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black transition hover:bg-sky-200"
      >
        Submit Your First Work
      </Link>
    </div>
  );
}