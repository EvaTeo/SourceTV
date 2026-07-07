"use client";

import PremiereRail from "@/app/components/PremiereRail";
import FeaturedCarousel from "@/app/components/FeaturedCarousel";
import ContinueWatching from "@/app/components/ContinueWatching";
import ContentCard from "@/app/components/ContentCard";
import ContentRail from "@/app/components/ContentRail";
import TopTenRail from "@/app/components/TopTenRail";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  type: string;
  genre: string;
  videoUrl: string;
  mainVideoUrl?: string | null;
  trailerUrl?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;
  description: string;
  status: string;
  views?: number;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  scheduledAt?: string | null;
};

type RecommendationMemoryItem = {
  slug: string;
  title: string;
  type?: string | null;
  genre?: string | null;
  creatorName?: string | null;
  watchedAt: number;
};

function getActiveProfile() {
  try {
    return JSON.parse(
      localStorage.getItem("sourcetv_active_profile") ||
        '{"id":"main","name":"Adan"}'
    );
  } catch {
    return { id: "main", name: "Adan" };
  }
}

function normalize(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

async function fetchRail(url: string) {
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load ${url}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default function BrowseClient() {
  const searchParams = useSearchParams();

  const [content, setContent] = useState<ContentItem[]>([]);
  const [trending, setTrending] = useState<ContentItem[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<ContentItem[]>([]);
  const [editorPicks, setEditorPicks] = useState<ContentItem[]>([]);
  const [recommended, setRecommended] = useState<ContentItem[]>([]);
  const [hiddenGems, setHiddenGems] = useState<ContentItem[]>([]);
  const [drama, setDrama] = useState<ContentItem[]>([]);
  const [documentaries, setDocumentaries] = useState<ContentItem[]>([]);
  const [animation, setAnimation] = useState<ContentItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [memory, setMemory] = useState<RecommendationMemoryItem[]>([]);
  const [profileName, setProfileName] = useState("Your");

  const urlType = searchParams.get("type") || "";
  const urlGenre = searchParams.get("genre") || "";

  useEffect(() => {
    const activeProfile = getActiveProfile();

    setProfileName(activeProfile.name || "Your");

    const memoryKey = `sourcetv_recommendation_memory_${activeProfile.id}`;
    const savedMemory = JSON.parse(localStorage.getItem(memoryKey) || "[]");
    setMemory(savedMemory);

    async function fetchContent() {
      try {
        const [
          allContent,
          trendingContent,
          newContent,
          editorPickContent,
          recommendedContent,
          hiddenGemContent,
          dramaContent,
          documentaryContent,
          animationContent,
        ] = await Promise.all([
          fetchRail("/api/content?mode=all&limit=80"),
          fetchRail("/api/content?mode=trending&limit=12"),
          fetchRail("/api/content?mode=new&limit=12"),
          fetchRail("/api/content?mode=editor_picks&limit=12"),
          fetchRail("/api/content?mode=recommended&limit=12"),
          fetchRail("/api/content?mode=hidden_gems&limit=12"),
          fetchRail("/api/content?mode=genre&genre=Drama&limit=12"),
          fetchRail("/api/content?mode=genre&genre=Documentary&limit=12"),
          fetchRail("/api/content?mode=genre&genre=Animation&limit=12"),
        ]);

        setContent(allContent);
        setTrending(trendingContent);
        setRecentlyAdded(newContent);
        setEditorPicks(editorPickContent);
        setRecommended(recommendedContent);
        setHiddenGems(hiddenGemContent);
        setDrama(dramaContent);
        setDocumentaries(documentaryContent);
        setAnimation(animationContent);
      } catch (error) {
        console.error("BROWSE CONTENT LOAD ERROR:", error);
        setContent([]);
        setTrending([]);
        setRecentlyAdded([]);
        setEditorPicks([]);
        setRecommended([]);
        setHiddenGems([]);
        setDrama([]);
        setDocumentaries([]);
        setAnimation([]);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const cleanType = normalize(urlType);
      const cleanGenre = normalize(urlGenre);

      const itemType = normalize(item.type);
      const itemGenre = normalize(item.genre);

      const matchesType = cleanType
        ? itemType.includes(cleanType) || cleanType.includes(itemType)
        : true;

      const matchesGenre = cleanGenre
        ? itemGenre.includes(cleanGenre) || cleanGenre.includes(itemGenre)
        : true;

      return matchesType && matchesGenre;
    });
  }, [content, urlType, urlGenre]);

  const topTen = useMemo(() => {
    return trending.slice(0, 10);
  }, [trending]);

  const todayTrending = useMemo(() => {
    return trending.slice(0, 12);
  }, [trending]);

  const personalized = useMemo(() => {
    if (!memory.length) return [];

    const watchedSlugs = new Set(memory.map((item) => item.slug));

    const genreScore = new Map<string, number>();
    const typeScore = new Map<string, number>();
    const creatorScore = new Map<string, number>();

    memory.forEach((item, index) => {
      const weight = Math.max(1, 10 - index);

      if (item.genre) {
        genreScore.set(item.genre, (genreScore.get(item.genre) || 0) + weight);
      }

      if (item.type) {
        typeScore.set(item.type, (typeScore.get(item.type) || 0) + weight);
      }

      if (item.creatorName) {
        creatorScore.set(
          item.creatorName,
          (creatorScore.get(item.creatorName) || 0) + weight
        );
      }
    });

    return [...content]
      .filter((item) => !watchedSlugs.has(item.id))
      .map((item) => {
        const score =
          (genreScore.get(item.genre) || 0) * 3 +
          (typeScore.get(item.type) || 0) * 2 +
          (item.creatorName ? creatorScore.get(item.creatorName) || 0 : 0) +
          (item.views || 0) * 0.01;

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
      .slice(0, 12);
  }, [content, memory]);

  const favoriteGenre = useMemo(() => {
    if (!memory.length) return null;

    const counts = new Map<string, number>();

    memory.forEach((item) => {
      if (!item.genre) return;
      counts.set(item.genre, (counts.get(item.genre) || 0) + 1);
    });

    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  }, [memory]);

  const favoriteGenreTitles = useMemo(() => {
    if (!favoriteGenre) return [];

    return content
      .filter((item) => item.genre === favoriteGenre)
      .filter((item) => !memory.some((watched) => watched.slug === item.id))
      .slice(0, 12);
  }, [content, favoriteGenre, memory]);

  const filteredTitle = useMemo(() => {
    if (urlType) return urlType === "Film" ? "Films" : urlType;
    if (urlGenre) return urlGenre;
    return "";
  }, [urlType, urlGenre]);

  if (loading) {
    return (
      <main className="min-h-screen overflow-hidden bg-black px-4 pb-24 pt-24 text-white md:px-10">
        <div className="animate-pulse">
          <div className="h-[56vh] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] md:h-[82vh]">
            <div className="relative z-10 flex h-full items-end p-8 md:p-14">
              <div className="w-full max-w-3xl">
                <div className="h-3 w-36 rounded-full bg-white/10" />
                <div className="mt-5 h-14 w-4/5 rounded-full bg-white/10 md:h-24" />
                <div className="mt-6 h-5 w-full max-w-xl rounded-full bg-white/10" />
                <div className="mt-3 h-5 w-4/5 max-w-lg rounded-full bg-white/10" />
                <div className="mt-8 flex gap-3">
                  <div className="h-12 w-36 rounded-full bg-white/10" />
                  <div className="h-12 w-32 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-5 h-8 w-52 rounded-full bg-white/10" />

            <div className="flex gap-5 overflow-hidden pb-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="w-[42vw] max-w-[170px] shrink-0 md:w-[220px] md:max-w-none"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.04]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
      <FeaturedCarousel items={content} />

      <section className="relative z-30 -mt-52 overflow-visible px-0 pb-28 pt-0 md:-mt-[24rem] md:px-0 md:pb-32">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-20 z-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.92)_7rem,#000_15rem,#000_100%)]" />

        <div className="relative z-10 space-y-1 md:space-y-2">
          {urlType || urlGenre ? (
            <FilteredResultsRail title={filteredTitle} items={filteredContent} />
          ) : (
            <>
              <ContinueWatching />

              <TopTenRail items={topTen} />

              <ContentRail title="Today's Trending" items={todayTrending} />

              {personalized.length > 0 && (
                <ContentRail
                  title={`Recommended for ${profileName}`}
                  items={personalized}
                />
              )}

              {recommended.length > 0 && (
                <ContentRail title="Recommended on SourceTV" items={recommended} />
              )}

              {favoriteGenreTitles.length > 0 && (
                <ContentRail
                  title={`Because You Watch ${favoriteGenre}`}
                  items={favoriteGenreTitles}
                />
              )}

              <PremiereRail items={content} />

              {editorPicks.length > 0 && (
                <ContentRail title="Editor's Picks" items={editorPicks} />
              )}

              <ContentRail title="Recently Added" items={recentlyAdded} />

              <ContentRail title="Hidden Gems" items={hiddenGems} />

              <ContentRail title="Drama" items={drama} />

              <ContentRail title="Documentaries" items={documentaries} />

              <ContentRail title="Animation" items={animation} />

              <ContentRail title="All SourceTV Titles" items={content} />
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function FilteredResultsRail({
  title,
  items,
}: {
  title: string;
  items: ContentItem[];
}) {
  if (items.length === 0) {
    return (
      <section className="relative z-20 px-4 pt-10 md:px-12 md:pt-20">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Home
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-6xl">
            {title || "Filtered Titles"}
          </h1>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white/50">
          No titles found.
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-20 overflow-visible px-4 pt-10 md:px-12 md:pt-20">
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            Home
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-6xl">{title}</h1>
        </div>
      </div>

      <div className="flex gap-5 overflow-x-auto overflow-y-visible pb-8 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <ContentCard
            key={`filtered-${item.id}`}
            id={item.id}
            title={item.title}
            description={item.description}
            type={item.type}
            genre={item.genre}
            maturityRating={item.maturityRating}
            runtime={item.runtime}
            thumbnailUrl={item.thumbnailUrl}
            backdropUrl={item.backdropUrl}
            trailerUrl={item.trailerUrl}
            views={item.views}
            scheduledAt={item.scheduledAt}
            status={item.status}
          />
        ))}
      </div>
    </section>
  );
}