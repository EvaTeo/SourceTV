import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // get all approved content
  const content = await prisma.projectSubmission.findMany({
    where: { status: "approved" },
  });

  // match slug to title
  const item = content.find(
    (c) =>
      c.title.toLowerCase().replace(/\s+/g, "-") === slug
  );

  if (!item) return notFound();

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/browse" className="text-sm font-bold text-sky-300">
          ← Back to Browse
        </Link>

        {item.videoUrl && item.videoUrl.startsWith("http") ? (
  <div className="mt-8 aspect-video w-full overflow-hidden rounded-[2rem] border border-sky-300/20 bg-black shadow-[0_0_55px_rgba(14,165,233,0.25)]">
    <iframe
      src={item.videoUrl}
      className="h-full w-full"
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  </div>
) : (
  <div className="mt-8 aspect-video w-full flex items-center justify-center rounded-[2rem] border border-sky-300/20 bg-black text-white/40">
    No video available
  </div>
)}

        <section className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
              {item.type} • {item.genre}
            </p>

            <h1 className="mt-3 text-5xl font-black">
              {item.title}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
              {item.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <button className="rounded-full bg-sky-400 px-7 py-3 font-black text-black">
                Watch Now
              </button>

              <button className="rounded-full border border-white/20 bg-white/5 px-7 py-3 font-bold">
                Add to Watchlist
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              Ad Space
            </p>
            <h2 className="mt-3 text-2xl font-black">
              Pre-roll sponsor
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              This is where future video ads and sponsor placements will live.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}