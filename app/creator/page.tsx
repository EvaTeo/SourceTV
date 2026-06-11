import Link from "next/link";

const cards = [
  {
    title: "Submit a Project",
    desc: "Upload a film, short, pilot, episode, trailer, poster, and metadata for review.",
    href: "/admin/upload",
    label: "Start Upload",
  },
  {
    title: "Submission Status",
    desc: "Track pending, approved, rejected, private, and scheduled titles.",
    href: "/admin/content",
    label: "View Library",
  },
  {
    title: "Creator Analytics",
    desc: "Coming soon: views, watch time, audience signals, and revenue share estimates.",
    href: "/creator/analytics",
    label: "Coming Soon",
  },
];

export default function CreatorPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#14365f_0%,#05070d_42%,#000_100%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← Back to SourceTV
        </Link>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            Creator Studio
          </p>

          <h1 className="mt-4 text-5xl font-black md:text-7xl">
            Publish on SourceTV
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/60">
            Submit premium films, shows, shorts, and creator projects for
            review. Approved titles can be published immediately or scheduled
            as premieres.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-300/60 hover:bg-sky-300/10"
            >
              <div className="mb-5 h-11 w-11 rounded-2xl border border-sky-300/30 bg-sky-300/10" />

              <h2 className="text-2xl font-black">{card.title}</h2>

              <p className="mt-3 leading-7 text-white/55">{card.desc}</p>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-sky-300">
                {card.label} →
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}