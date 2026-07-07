"use client";

import BannerAd from "@/app/components/BannerAd";
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
    const repeated = [...posters, ...fallbackPosters, ...posters, ...posters];
    return repeated.slice(0, 28);
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
      <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-28 md:px-12 md:pb-28 md:pt-32">
        <div className="absolute inset-0 opacity-70">
          <div className="poster-marquee absolute left-0 top-20 flex gap-4 md:gap-5">
            {movingPosters.map((item, index) => (
              <div
                key={`${item.id}-top-${index}`}
                className="h-56 w-40 shrink-0 rounded-2xl border border-white/8 bg-zinc-900 bg-cover bg-center shadow-2xl shadow-black/70 md:h-80 md:w-56 md:rounded-3xl"
                style={{
                  backgroundImage: item.thumbnailUrl
                    ? `url(${item.thumbnailUrl})`
                    : undefined,
                }}
              />
            ))}
          </div>

          <div className="poster-marquee-reverse absolute bottom-20 left-0 flex gap-4 md:bottom-8 md:gap-5">
            {movingPosters.map((item, index) => (
              <div
                key={`${item.id}-bottom-${index}`}
                className="h-52 w-40 shrink-0 rounded-2xl border border-white/8 bg-zinc-900 bg-cover bg-center shadow-2xl shadow-black/70 md:h-72 md:w-52 md:rounded-3xl"
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

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_38%,rgba(56,189,248,0.15),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.08),transparent_30%)]" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-sky-300 md:text-sm">
              Watch Free
            </p>

            <h1 className="mt-5 max-w-5xl text-[3.2rem] font-black leading-[0.86] tracking-tight md:text-8xl">
              The Next Generation of Entertainment.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/74 md:text-2xl md:leading-10">
              A new home for films, series, documentaries, animation, and
              creators.
            </p>

            <p className="mt-3 text-sm font-bold text-white/55 md:text-lg">
              Watch free. Discover what&apos;s next.
            </p>

            <form
              onSubmit={handleEmailSubmit}
              className="mt-8 flex max-w-2xl flex-col gap-3 rounded-[1.4rem] border border-white/12 bg-black/46 p-2 shadow-[0_22px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:flex-row sm:rounded-full"
            >
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSignedUp(false);
                }}
                type="email"
                placeholder="Enter your email to get updates"
                className="min-h-14 flex-1 rounded-full bg-white/[0.06] px-5 text-sm font-semibold text-white outline-none placeholder:text-white/35 focus:bg-white/[0.1]"
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
                className="rounded-md bg-white px-8 py-4 text-center text-base font-black text-black shadow-[0_14px_34px_rgba(0,0,0,0.35)] transition hover:scale-[1.025] hover:bg-sky-200"
              >
                Watch Free
              </Link>

              <Link
                href="/partner/apply"
                className="rounded-md border border-white/15 bg-white/[0.075] px-8 py-4 text-center text-base font-black text-white backdrop-blur-xl transition hover:scale-[1.025] hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-200"
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

      <div className="relative z-30 pb-8">
        <BannerAd />
      </div>

      <section className="relative px-5 py-14 md:px-12 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.08),transparent_32%),radial-gradient(circle_at_80%_45%,rgba(56,189,248,0.1),transparent_35%)]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:grid-cols-[1fr_0.9fr] md:p-12">
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
                className="rounded-md bg-sky-400 px-8 py-4 text-center text-base font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.35)] transition hover:bg-sky-300"
              >
                Apply to Partner
              </Link>

              <Link
                href="/creator/submit"
                className="rounded-md border border-white/15 bg-black/30 px-8 py-4 text-center text-base font-black text-white transition hover:border-sky-300/50 hover:text-sky-200"
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

      <section className="relative z-10 px-5 pb-24 md:px-12">
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
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
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

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-950/35 via-black to-sky-950/20 p-6 text-center md:p-10">
            <h3 className="text-3xl font-black md:text-5xl">
              Bring your work to SourceTV.
            </h3>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/60">
              Apply to become a partner and help shape the next generation of
              free entertainment.
            </p>

            <Link
              href="/partner/apply"
              className="mt-7 inline-flex rounded-md bg-white px-8 py-4 text-base font-black text-black transition hover:bg-sky-200"
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
          animation: poster-marquee 58s linear infinite;
          will-change: transform;
        }

        .poster-marquee-reverse {
          width: max-content;
          animation: poster-marquee-reverse 68s linear infinite;
          will-change: transform;
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
    <section className="relative z-30 -mt-24 overflow-visible px-5 pb-10 pt-0 md:-mt-32 md:px-12 md:pb-12">
      <div className="mx-auto max-w-7xl overflow-visible">
        <div className="mb-3 flex items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300 md:text-xs">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight md:text-xl">
              {title}
            </h2>
          </div>

          <Link
            href="/browse"
            className="hidden text-xs font-bold text-white/45 transition hover:text-sky-300 md:block"
          >
            View All
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto overflow-y-visible pb-8 pt-4 [scrollbar-width:none] md:gap-4 md:pb-9 md:pt-5 [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={
                item.id.startsWith("fallback") ? "/browse" : `/watch/${item.id}`
              }
              className="group w-[132px] shrink-0 overflow-visible md:w-[185px]"
              aria-label={item.title}
            >
              <div
                className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-zinc-900 bg-cover bg-center shadow-2xl shadow-black/50 transition duration-300 group-hover:scale-[1.045] group-hover:border-sky-300/40 md:rounded-2xl"
                style={{
                  backgroundImage: item.thumbnailUrl
                    ? `url(${item.thumbnailUrl})`
                    : undefined,
                }}
              />
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
