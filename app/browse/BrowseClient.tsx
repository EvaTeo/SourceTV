"use client";

import ContinueWatching from "@/app/components/ContinueWatching";
import ContentCard from "@/app/components/ContentCard";
import ContentRail from "@/app/components/ContentRail";
import FeaturedCarousel from "@/app/components/FeaturedCarousel";
import PremiereRail from "@/app/components/PremiereRail";
import TopTenRail from "@/app/components/TopTenRail";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
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
  year?: number | null;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  scheduledAt?: string | null;
  createdAt?: string | null;
  publishedAt?: string | null;
  editorPick?: boolean;
};

type RecommendationMemoryItem = {
  slug: string;
  title: string;
  type?: string | null;
  genre?: string | null;
  creatorName?: string | null;
  watchedAt: number;
};

type EditorialCollection = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  placement: string;
  sortOrder: number;
  items: ContentItem[];
};

function getActiveProfile() {
  try {
    return JSON.parse(
      localStorage.getItem("sourcetv_active_profile") ||
        '{"id":"main","name":"Adan"}'
    );
  } catch {
    return {
      id: "main",
      name: "Adan",
    };
  }
}

function normalize(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

async function fetchRail(url: string): Promise<ContentItem[]> {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}

async function fetchCollections(): Promise<EditorialCollection[]> {
  const response = await fetch("/api/collections", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load editorial collections.");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}

export default function BrowseClient() {
  const searchParams = useSearchParams();

  const [content, setContent] = useState<ContentItem[]>([]);
  const [trending, setTrending] = useState<ContentItem[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<ContentItem[]>([]);
  const [editorPicks, setEditorPicks] = useState<ContentItem[]>([]);
  const [featured, setFeatured] = useState<ContentItem[]>([]);
  const [editorialCollections, setEditorialCollections] = useState<EditorialCollection[]>([]);

  const [loading, setLoading] = useState(true);
  const [memory, setMemory] = useState<RecommendationMemoryItem[]>([]);
  const [profileName, setProfileName] = useState("Your");
  const [homepageRows, setHomepageRows] = useState(12);

  const [aiRecommendations, setAiRecommendations] =
  useState(true);

  const urlType = searchParams.get("type") || "";
  const urlGenre = searchParams.get("genre") || "";

  useEffect(() => {
    const activeProfile = getActiveProfile();

    setProfileName(activeProfile.name || "Your");

    const memoryKey = `sourcetv_recommendation_memory_${activeProfile.id}`;

    try {
      const savedMemory = JSON.parse(
        localStorage.getItem(memoryKey) || "[]"
      );

      setMemory(Array.isArray(savedMemory) ? savedMemory : []);
    } catch {
      setMemory([]);
    }

    async function fetchContent() {
      try {
        const [
          allContent,
          featuredContent,
          trendingContent,
          newContent,
          editorPickContent,
          editorialCollectionContent,
        ] = await Promise.all([
          fetchRail("/api/content?mode=all&limit=100"),
          fetchRail("/api/content?mode=featured&limit=6"),
          fetchRail("/api/content?mode=trending&limit=12"),
          fetchRail("/api/content?mode=new&limit=12"),
          fetchRail("/api/content?mode=editor_picks&limit=12"),
          fetchCollections(),
        ]);

        setContent(allContent);
        setFeatured(featuredContent);
        setTrending(trendingContent);
        setRecentlyAdded(newContent);
        setEditorPicks(editorPickContent);
        setEditorialCollections(editorialCollectionContent);
      } catch (error) {
        console.error("BROWSE CONTENT LOAD ERROR:", error);

        setContent([]);
        setFeatured([]);
        setTrending([]);
        setRecentlyAdded([]);
        setEditorPicks([]);
        setEditorialCollections([]);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadHomepageSettings() {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data: unknown = await response.json();

        if (
          cancelled ||
          !data ||
          typeof data !== "object"
        ) {
          return;
        }

        const result = data as {
  homepageRows?: unknown;
  aiRecommendations?: unknown;
};

        if (
          typeof result.homepageRows === "number" &&
          Number.isFinite(result.homepageRows)
        ) {
          setHomepageRows(
            Math.max(
              1,
              Math.min(
                30,
                Math.round(result.homepageRows)
              )
            )
          );

        }

        if (
  typeof result.aiRecommendations === "boolean"
) {
  setAiRecommendations(
    result.aiRecommendations
  );
}

      } catch (error) {
        console.error(
          "HOMEPAGE SETTINGS LOAD ERROR:",
          error
        );
      }
    }

    void loadHomepageSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const heroItems = useMemo(() => {
    if (featured.length > 0) {
      return featured;
    }

    return content.slice(0, 6);
  }, [featured, content]);

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
        genreScore.set(
          normalize(item.genre),
          (genreScore.get(normalize(item.genre)) || 0) + weight
        );
      }

      if (item.type) {
        typeScore.set(
          normalize(item.type),
          (typeScore.get(normalize(item.type)) || 0) + weight
        );
      }

      if (item.creatorName) {
        creatorScore.set(
          normalize(item.creatorName),
          (creatorScore.get(normalize(item.creatorName)) || 0) + weight
        );
      }
    });

    return [...content]
      .filter((item) => !watchedSlugs.has(item.id))
      .map((item) => {
        const genrePoints =
          genreScore.get(normalize(item.genre)) || 0;

        const typePoints =
          typeScore.get(normalize(item.type)) || 0;

        const creatorPoints = item.creatorName
          ? creatorScore.get(normalize(item.creatorName)) || 0
          : 0;

        const score =
          genrePoints * 3 +
          typePoints * 2 +
          creatorPoints +
          (item.views || 0) * 0.01;

        return {
          item,
          score,
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
      .slice(0, 12);
  }, [content, memory]);

  const becauseYouWatched = useMemo(() => {
    if (!memory.length) return [];

    const mostRecentWatch = memory[0];

    if (!mostRecentWatch) return [];

    return content
      .filter((item) => item.id !== mostRecentWatch.slug)
      .map((item) => {
        let score = 0;

        if (
          mostRecentWatch.genre &&
          normalize(item.genre) === normalize(mostRecentWatch.genre)
        ) {
          score += 6;
        }

        if (
          mostRecentWatch.type &&
          normalize(item.type) === normalize(mostRecentWatch.type)
        ) {
          score += 3;
        }

        if (
          mostRecentWatch.creatorName &&
          item.creatorName &&
          normalize(item.creatorName) ===
            normalize(mostRecentWatch.creatorName)
        ) {
          score += 5;
        }

        score += (item.views || 0) * 0.001;

        return {
          item,
          score,
        };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item)
      .slice(0, 12);
  }, [content, memory]);

  const becauseYouWatchedTitle = useMemo(() => {
    const mostRecentWatch = memory[0];

    if (!mostRecentWatch?.title) {
      return "Because You Watched";
    }

    return `Because You Watched ${mostRecentWatch.title}`;
  }, [memory]);


  const filteredTitle = useMemo(() => {
    if (urlType) {
      return urlType === "Film" ? "Films" : urlType;
    }

    if (urlGenre) {
      return urlGenre;
    }

    return "";
  }, [urlType, urlGenre]);

  const homeRows = useMemo(() => {
    const rows: Array<{
      key: string;
      node: ReactNode;
    }> = [];

    rows.push({
      key: "continue-watching",
      node: (
        <div className="pt-14 md:pt-24">
          <ContinueWatching />
        </div>
      ),
    });

    if (topTen.length > 0) {
      rows.push({
        key: "top-ten",
        node: <TopTenRail items={topTen} />,
      });
    }

    if (todayTrending.length > 0) {
      rows.push({
        key: "trending",
        node: (
          <ContentRail
            title="Today’s Trending"
            items={todayTrending}
          />
        ),
      });
    }

if (
  aiRecommendations &&
  personalized.length > 0
) {
        rows.push({
        key: "personalized",
        node: (
          <ContentRail
            title={`Recommended for ${profileName}`}
            items={personalized}
          />
        ),
      });
    }

if (
  aiRecommendations &&
  becauseYouWatched.length > 0
) {
        rows.push({
        key: "because-you-watched",
        node: (
          <ContentRail
            title={becauseYouWatchedTitle}
            items={becauseYouWatched}
          />
        ),
      });
    }

    rows.push({
      key: "premieres",
      node: <PremiereRail items={content} />,
    });

    if (recentlyAdded.length > 0) {
      rows.push({
        key: "new-releases",
        node: (
          <ContentRail
            title="New Releases"
            items={recentlyAdded}
          />
        ),
      });
    }

    if (editorPicks.length > 0) {
      rows.push({
        key: "staff-picks",
        node: (
          <ContentRail
            title="Staff Picks"
            items={editorPicks}
          />
        ),
      });
    }

    editorialCollections.forEach((collection) => {
      rows.push({
        key: `collection-${collection.id}`,
        node: (
          <ContentRail
            title={collection.title}
            items={collection.items}
          />
        ),
      });
    });

    if (content.length > 0) {
      rows.push({
        key: "explore",
        node: (
          <ContentRail
            title="Explore SourceTV"
            items={content}
          />
        ),
      });
    }

    return rows.slice(0, homepageRows);
  }, [
    becauseYouWatched,
    becauseYouWatchedTitle,
    content,
    editorialCollections,
    editorPicks,
    homepageRows,
    personalized,
    profileName,
    recentlyAdded,
    todayTrending,
    topTen,
  ]);

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
      <FeaturedCarousel items={heroItems} />

      <section className="relative z-30 -mt-36 overflow-visible px-0 pb-28 pt-0 md:-mt-[19rem] md:px-0 md:pb-32">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_66%,rgba(0,0,0,0.08)_76%,rgba(0,0,0,0.30)_86%,rgba(0,0,0,0.72)_94%,#000_100%)]" />

        <div className="relative z-10 space-y-3 md:space-y-4">
          {urlType || urlGenre ? (
            <FilteredResultsRail
              title={filteredTitle}
              items={filteredContent}
            />
          ) : (
            <>
              {homeRows.map((row) => (
                <div key={row.key}>
                  {row.node}
                </div>
              ))}
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
            SourceTV
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-6xl">
            {title || "Filtered Titles"}
          </h1>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white/50">
          No titles found in this category.
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-20 overflow-visible px-4 pt-10 md:px-12 md:pt-20">
      <div className="mb-8 flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-sky-300">
            SourceTV
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-6xl">
            {title}
          </h1>
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
            scheduledAt={item.scheduledAt}
            status={item.status}
          />
        ))}
      </div>
    </section>
  );
}