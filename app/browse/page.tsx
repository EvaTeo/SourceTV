"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const genres = ["All", "Movies", "Shows", "Shorts", "Animation", "Drama", "Comedy"];

type ContentItem = {
  id: string;
  title: string;
  type: string;
  genre: string;
  videoUrl: string;
  description: string;
  status: string;
};

function slugify(title: string) {
  return title.toLowerCase().trim().replace(/\s+/g, "-");
}

export default function BrowsePage() {
  const [content, setContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    async function fetchContent() {
      const res = await fetch("/api/content");
      const data = await res.json();
      setContent(data);
    }

    fetchContent();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-black">
            Source<span className="text-sky-400">TV</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <Link href="/browse" className="text-sky-300">
              Browse
            </Link>
            <Link href="/creator/apply" className="hover:text-sky-300">
              Submit Project
            </Link>
            <Link href="/admin/submissions" className="hover:text-sky-300">
              Admin
            </Link>
          </nav>

          <Link
            href="/signup"
            className="rounded-full bg-sky-400 px-5 py-2 text-sm font-bold text-black shadow-[0_0_25px_rgba(56,189,248,0.5)]"
          >
            Watch Free
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(14,165,233,0.35),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
            Now Streaming
          </p>

          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Discover approved films, shows, shorts, and creator originals.
          </h1>

          <p className="mt-5 max-w-2xl text-white/60">
            Browse curated projects approved for SourceTV. Free to watch,
            powered by ads, built for new creative voices.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`rounded-full border px-5 py-2 text-sm font-bold transition ${
                  genre === "All"
                    ? "border-sky-300 bg-sky-400 text-black"
                    : "border-white/15 bg-white/5 text-white/70 hover:border-sky-300/60 hover:text-sky-200"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-sky-300/20 bg-sky-400/10 p-6 shadow-[0_0_35px_rgba(14,165,233,0.15)]">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-sky-300">
            Ad Space
          </p>
          <h2 className="mt-2 text-2xl font-black">Sponsored placement</h2>
          <p className="mt-2 text-sm text-white/55">
            Future banner ads, brand partnerships, and SourceTV promotions will appear here.
          </p>
        </div>
      </section>

      <section className="space-y-12 px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-black">Approved on SourceTV</h2>
            <Link href="/creator/apply" className="text-sm font-bold text-sky-300 hover:text-sky-200">
              Submit yours
            </Link>
          </div>

          {content.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <h3 className="text-2xl font-black">No approved content yet.</h3>
              <p className="mt-3 text-white/55">
                Approve a project in the admin dashboard and it will appear here.
              </p>
              <Link
                href="/admin/submissions"
                className="mt-6 inline-block rounded-full bg-sky-400 px-6 py-3 font-black text-black"
              >
                Go to Admin
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {content.map((item, index) => (
                <Link key={item.id} href={`/watch/${slugify(item.title)}`}>
                  <div className="group relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 transition duration-300 hover:-translate-y-2 hover:border-sky-300/60 hover:shadow-[0_0_35px_rgba(14,165,233,0.3)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.24),transparent_48%)] opacity-70 transition group-hover:opacity-100" />

                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-sky-200">
                          #{index + 1}
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                          Free
                        </span>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-bold text-sky-300">
                          {item.type} • {item.genre}
                        </p>

                        <h3 className="text-xl font-black leading-tight">
                          {item.title}
                        </h3>

                        <p className="mt-2 line-clamp-3 text-xs text-white/50">
                          {item.description}
                        </p>

                        <div className="mt-4 w-full rounded-full bg-white/10 px-4 py-2 text-center text-sm font-bold text-white opacity-0 transition group-hover:bg-sky-400 group-hover:text-black group-hover:opacity-100">
                          Watch
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}