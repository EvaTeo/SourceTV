"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  type?: string | null;
  genre?: string | null;
};

type PosterItem = {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  type?: string | null;
  genre?: string | null;
};

const fallbackPosters: PosterItem[] = [
  {
    id: "fallback-1",
    title: "Midnight Frames",
    type: "Film",
    genre: "Drama",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "fallback-2",
    title: "Original Stories",
    type: "Series",
    genre: "Drama",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "fallback-3",
    title: "Premiere Night",
    type: "Film",
    genre: "Thriller",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "fallback-4",
    title: "Cinema Vault",
    type: "Documentary",
    genre: "Documentary",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "fallback-5",
    title: "Animated Worlds",
    type: "Animation",
    genre: "Animation",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1600&auto=format&fit=crop",
  },
];

const partnerFaqs = [
  {
    question: "Who can become a SourceTV partner?",
    answer:
      "Filmmakers, producers, studios, documentarians, animators, distributors, and creators with finished or near-finished entertainment projects can apply.",
  },
  {
    question: "Does every submission go live?",
    answer:
      "No. SourceTV is curated. Projects go through review before they are approved, scheduled, published, or rejected.",
  },
  {
    question: "Is SourceTV only for indie creators?",
    answer:
      "No. SourceTV is becoming a wider entertainment platform for creators, studios, distributors, and audiences.",
  },
];

export default function HomePage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [email, setEmail] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch("/api/content", { cache: "no-store" });
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setContent(data);
        }
      } catch (error) {
        console.error("Landing content load error:", error);
      }
    }

    loadContent();
  }, []);

  const posters = useMemo<PosterItem[]>(() => {
    const livePosters = content.map((item) => ({
      id: item.id,
      title: item.title,
      thumbnailUrl: item.thumbnailUrl,
      backdropUrl: item.backdropUrl,
      type: item.type,
      genre: item.genre,
    }));

    return livePosters.length > 0 ? livePosters : fallbackPosters;
  }, [content]);

  const movingPosters = useMemo(() => {
    const repeated = [...posters, ...fallbackPosters, ...posters];
    return repeated.slice(0, 22);
  }, [posters]);

  const trendingToday = useMemo(() => {
    return posters.slice(0, 10);
  }, [posters]);

  function handleEmailSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) return;

    setSignedUp(true);
    setEmail("");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative min-h-[82vh] overflow-hidden px-5 pb-6 pt-28 md:px-12 md:pb-8 md:pt-32">
        <div className="absolute inset-0 opacity-95">
          <div className="poster-marquee absolute left-0 top-16 flex gap-5">
            {movingPosters.map((item, index) => (
              <div
                key={`${item.id}-top-${index}`}
                className="h-64 w-44 shrink-0 rounded-3xl border border-white/10 bg-zinc-900 bg-cover bg-center shadow-2xl shadow-black/70 md:h-80 md:w-56"
                style={{
                  backgroundImage: item.thumbnailUrl
                    ? `url(${item.thumbnailUrl})`
                    : undefined,
                }}
              />
            ))}
          </div>

          <div className="poster-marquee-reverse absolute bottom-6 left-0 flex gap-5">
            {movingPosters.map((item, index) => (
              <div
                key={`${item.id}-bottom-${index}`}
                className="h-56 w-40 shrink-0 rounded-3xl border border-white/10 bg-zinc-900 bg-cover bg-center shadow-2xl shadow-black/70 md:h-72 md:w-52"
                style={{
                  backgroundImage:
                    item.backdropUrl || item.thumbnailUrl
                      ? `url(${item.backdropUrl || item.thumbnailUrl})`
                      : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/28 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/5 to-black/35" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(56,189,248,0.08),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(82vh-7rem)] max-w-7xl items-center">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-sky-300 md:text-sm">
              Watch Free
            </p>

            <h1 className="mt-5 max-w-5xl text-[3.4rem] font-black leading-[0.86] tracking-tight md:text-8xl">
              The Next Generation of Entertainment.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76 md:text-2xl md:leading-10">
              A new home for films, series, documentaries, animation, and
              creators.
            </p>

            <p className="mt-3 text-base font-bold text-white/60 md:text-lg">
              Watch free. Discover what&apos;s next.
            </p>

            <form
              onSubmit={handleEmailSubmit}
              className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[2rem] border border-white/12 bg-black/50 p-2 shadow-2xl backdrop-blur-2xl sm:flex-row"
            >
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSignedUp(false);
                }}
                type="email"
                placeholder="Enter your email to get updates"
                className="min-h-14 flex-1 rounded-full bg-white/[0.07] px-5 text-sm font-semibold text-white outline-none placeholder:text-white/38 focus:bg-white/[0.1]"
              />

              <button className="rounded-full bg-white px-7 py-4 text-sm font-black text-black transition hover:bg-sky-200">
                Sign Up
              </button>
            </form>

            {signedUp && (
              <p className="mt-3 text-sm font-bold text-sky-300">
                You&apos;re on the list.
              </p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/browse"
                className="rounded-full bg-white px-8 py-4 text-center text-base font-black text-black transition hover:bg-sky-200"
              >
                ▶ Play
              </Link>

              <Link
                href="/partner/apply"
                className="rounded-full border border-white/15 bg-white/[0.08] px-8 py-4 text-center text-base font-black text-white backdrop-blur-xl transition hover:border-sky-300/50 hover:text-sky-200"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ContentRail
        eyebrow="Now Streaming"
        title="Today's Trending"
        items={trendingToday}
      />

      <section className="relative px-5 py-20 md:px-12 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(185,28,28,0.2),transparent_32%),radial-gradient(circle_at_80%_45%,rgba(56,189,248,0.12),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:grid-cols-[1fr_0.9fr] md:p-12">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
              Partner Program
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.95] md:text-7xl">
              A new home for creators and entertainment companies.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 md:text-lg">
              SourceTV gives filmmakers, producers, studios, documentarians,
              animators, and creators a curated path to submit work, get
              reviewed, and reach audiences inside a premium streaming
              experience.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/partner/apply"
                className="rounded-full bg-sky-400 px-8 py-4 text-center text-base font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.35)] transition hover:bg-sky-300"
              >
                Apply to Partner
              </Link>

              <Link
                href="/creator/submit"
                className="rounded-full border border-white/15 bg-black/30 px-8 py-4 text-center text-base font-black text-white transition hover:border-sky-300/50 hover:text-sky-200"
              >
                Submit a Project
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <PartnerPoint
              title="Curated Review"
              text="Every project is reviewed before it reaches viewers."
            />
            <PartnerPoint
              title="Premium Presentation"
              text="Titles are displayed in a real streaming-service layout."
            />
            <PartnerPoint
              title="Audience Discovery"
              text="SourceTV is built around discovery, recommendations, and watch behavior."
            />
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-32 md:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            Partner FAQ
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-6xl">
            Before you submit.
          </h2>

          <div className="mt-8 grid gap-3">
            {partnerFaqs.map((faq, index) => (
              <div
                key={faq.question}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] backdrop-blur-xl"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <span className="text-lg font-black">{faq.question}</span>

                  <span className="text-2xl text-sky-300">
                    {openFaq === index ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    openFaq === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-7 text-white/60">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-red-950/45 via-black to-sky-950/35 p-6 text-center md:p-10">
            <h3 className="text-3xl font-black md:text-5xl">
              Bring your work to SourceTV.
            </h3>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/60">
              Apply to become a partner and help shape the next generation of
              free entertainment.
            </p>

            <Link
              href="/partner/apply"
              className="mt-7 inline-flex rounded-full bg-white px-8 py-4 text-base font-black text-black transition hover:bg-sky-200"
            >
              Become a Partner
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes poster-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes poster-marquee-reverse {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        .poster-marquee {
          width: max-content;
          animation: poster-marquee 55s linear infinite;
        }

        .poster-marquee-reverse {
          width: max-content;
          animation: poster-marquee-reverse 65s linear infinite;
        }
      `}</style>
    </main>
  );
}

function ContentRail({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: PosterItem[];
}) {
  return (
    <section className="relative z-10 -mt-12 overflow-visible px-5 py-8 md:-mt-16 md:px-12 md:py-10">
      <div className="mx-auto max-w-7xl overflow-visible">
        <div className="mb-3 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
              {eyebrow}
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">{title}</h2>
          </div>

          <Link
            href="/browse"
            className="hidden text-sm font-black text-white/45 transition hover:text-sky-300 md:block"
          >
            View All
          </Link>
        </div>

        <div className="-mx-6 flex gap-4 overflow-x-auto overflow-y-visible px-6 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={
                item.id.startsWith("fallback") ? "/browse" : `/watch/${item.id}`
              }
              className="group w-[155px] shrink-0 overflow-visible md:w-[210px]"
            >
              <div
                className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 bg-cover bg-center shadow-2xl shadow-black/50 transition duration-300 group-hover:scale-[1.045] group-hover:border-sky-300/40"
                style={{
                  backgroundImage: item.thumbnailUrl
                    ? `url(${item.thumbnailUrl})`
                    : undefined,
                }}
              />

              <h3 className="mt-3 line-clamp-1 text-sm font-black text-white/82">
                {item.title}
              </h3>

              <p className="mt-1 line-clamp-1 text-xs font-bold text-white/38">
                {[item.type, item.genre].filter(Boolean).join(" • ") ||
                  "SourceTV"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnerPoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
      <p className="text-lg font-black text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}