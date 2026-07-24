import Link from "next/link";

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export default function ProjectHeader() {
  return (
    <header className="relative overflow-hidden border-b border-white/10 pb-8">
      <div className="pointer-events-none absolute -left-32 -top-40 h-72 w-72 rounded-full bg-sky-400/10 blur-[110px]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
            SourceTV Partner Studio
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Projects
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45 sm:text-[15px]">
            Manage every title you have submitted and
            follow each project through review,
            approval, scheduling, and publication.
          </p>
        </div>

        <Link
          href="/partner/submit"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(56,189,248,0.14)] transition hover:bg-sky-200"
        >
          <PlusIcon />
          Submit New Work
        </Link>
      </div>
    </header>
  );
}