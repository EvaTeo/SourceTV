import Link from "next/link";

const featuredRows = [
  {
    title: "Featured on SourceTV",
    items: ["Midnight Signal", "Blue Hour", "The Last Frame", "After Static", "Neon Roads"],
  },
  {
    title: "Creator Films",
    items: ["Palm City", "Nocturne", "The Audition", "Dream Relay", "Silver Tape"],
  },
  {
    title: "Short Films",
    items: ["Seven Minutes", "The Elevator", "Moonlight Call", "Soft Crash", "Final Take"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* NAVBAR */}
      <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black">
            Source<span className="text-sky-400">TV</span>
          </Link>

          <nav className="hidden gap-6 text-white/70 md:flex">
            <Link href="/browse">Browse</Link>
            <Link href="/creator/apply">Submit</Link>
            <Link href="/login">Sign In</Link>
          </nav>

          <Link
            href="/signup"
            className="rounded-full bg-sky-400 px-5 py-2 text-black font-bold"
          >
            Watch Free
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="flex min-h-screen items-center px-6 pt-28 bg-gradient-to-r from-black via-black/80 to-black">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-black leading-tight">
            Watch bold new films & creator originals.
          </h1>

          <p className="mt-6 text-lg text-white/70">
            SourceTV is a curated streaming network for independent creators.
            Free to watch. Approved to publish.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/browse"
              className="bg-sky-400 text-black px-6 py-3 rounded-full font-bold"
            >
              Start Watching
            </Link>

            <Link
              href="/creator/apply"
              className="border border-white/30 px-6 py-3 rounded-full"
            >
              Submit Project
            </Link>
          </div>
        </div>
      </section>

      {/* CONTENT ROWS */}
      <section className="px-6 pb-20">
        {featuredRows.map((row) => (
          <div key={row.title} className="mb-10">
            <h2 className="text-2xl font-black mb-4">{row.title}</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {row.items.map((item) => (
                <div
                  key={item}
                  className="aspect-[2/3] bg-zinc-900 rounded-xl p-4 flex items-end hover:scale-105 transition"
                >
                  <h3 className="font-bold">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-white/40">
        © 2026 SourceTV
      </footer>
    </main>
  );
}