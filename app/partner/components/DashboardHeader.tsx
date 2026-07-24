import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <h1 className="text-4xl font-black tracking-tight">
          Overview
        </h1>

        <p className="mt-2 text-sm text-white/45">
          Welcome back. Manage your projects, contracts, publishing, and
          revenue from one place.
        </p>
      </div>

      <Link
        href="/partner/submit"
        className="w-fit rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black transition hover:bg-sky-200"
      >
        Submit New Work
      </Link>
    </header>
  );
}