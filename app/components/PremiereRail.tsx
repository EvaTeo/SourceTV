"use client";

import Link from "next/link";

type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  scheduledAt?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
};

function formatPremiere(dateString?: string | null) {
  if (!dateString) return "Coming soon";

  const date = new Date(dateString);

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PremiereRail({ items }: { items: ContentItem[] }) {
  const upcoming = items
    .filter((item) => item.scheduledAt && new Date(item.scheduledAt) > new Date())
    .sort(
      (a, b) =>
        new Date(a.scheduledAt || "").getTime() -
        new Date(b.scheduledAt || "").getTime()
    )
    .slice(0, 10);

  if (!upcoming.length) return null;

  return (
    <section>
      <div className="mb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
          Live Schedule
        </p>

        <h2 className="mt-1 text-2xl font-black md:text-3xl">
          Premiering Soon
        </h2>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {upcoming.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}?preview=admin`}
className="group w-[72vw] max-w-[300px] shrink-0 md:w-[360px] md:max-w-none"
          >
            <div
              className="relative aspect-video overflow-hidden rounded-[1.25rem] border border-sky-300/20 bg-zinc-950 p-5 shadow-2xl transition duration-300 group-hover:-translate-y-2 group-hover:border-sky-300/60 group-hover:shadow-[0_0_50px_rgba(14,165,233,0.32)]"
              style={{
                backgroundImage:
                  item.backdropUrl || item.thumbnailUrl
                    ? `linear-gradient(to top, rgba(0,0,0,0.96), rgba(0,0,0,0.3)), url(${
                        item.backdropUrl || item.thumbnailUrl
                      })`
                    : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute left-4 top-4 rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-200 backdrop-blur-xl">
                Premiere
              </div>

              <div className="relative z-10 flex h-full flex-col justify-end">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                  {formatPremiere(item.scheduledAt)}
                </p>

                <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight">
                  {item.title}
                </h3>

<p className="mt-2 line-clamp-2 text-sm leading-6 text-white/48">
                  {item.description}
                </p>

                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-sky-400 px-4 py-2 text-xs font-black text-black">
                    Notify Me
                  </span>

                  <span className="rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs font-bold text-white/70 backdrop-blur-xl">
                    {item.type || "Title"} {item.genre ? `• ${item.genre}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}