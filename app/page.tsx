"use client";

import ExperienceSection from "@/app/landing/experience/ExperienceSection";
import LandingHero from "@/app/landing/LandingHero";
import LandingPlans from "@/app/landing/LandingPlans";
import LandingTrending from "@/app/landing/LandingTrending";
import type {
  LandingContentItem,
  LandingPosterItem,
} from "@/app/landing/landingTypes";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type ApiContentItem = {
  id?: string;
  title?: string | null;
  description?: string | null;
  type?: string | null;
  genre?: string | null;

  videoUrl?: string | null;
  mainVideoUrl?: string | null;
  trailerUrl?: string | null;

  thumbnailUrl?: string | null;
  backdropUrl?: string | null;

  status?: string | null;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;

  scheduledAt?: string | null;
  views?: number | null;
};

const fallbackContent: LandingContentItem[] = [
  {
    id: "fallback-1",
    title: "Midnight Frames",
    description:
      "Discover new stories and remarkable voices on SourceTV.",
    type: "Film",
    genre: "Drama",
    videoUrl: "",
    mainVideoUrl: "",
    trailerUrl: "",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop",
    status: "approved",
    maturityRating: "",
    runtime: "",
    creatorName: "",
    scheduledAt: null,
    views: 0,
  },
  {
    id: "fallback-2",
    title: "Original Stories",
    description:
      "Entertainment created by fresh voices and established storytellers.",
    type: "Series",
    genre: "Drama",
    videoUrl: "",
    mainVideoUrl: "",
    trailerUrl: "",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1600&auto=format&fit=crop",
    status: "approved",
    maturityRating: "",
    runtime: "",
    creatorName: "",
    scheduledAt: null,
    views: 0,
  },
  {
    id: "fallback-3",
    title: "Premiere Night",
    description:
      "A growing destination for films, shows, and documentaries.",
    type: "Film",
    genre: "Thriller",
    videoUrl: "",
    mainVideoUrl: "",
    trailerUrl: "",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1600&auto=format&fit=crop",
    status: "approved",
    maturityRating: "",
    runtime: "",
    creatorName: "",
    scheduledAt: null,
    views: 0,
  },
  {
    id: "fallback-4",
    title: "Cinema Vault",
    description:
      "True stories, culture, history, and remarkable people.",
    type: "Documentary",
    genre: "Documentary",
    videoUrl: "",
    mainVideoUrl: "",
    trailerUrl: "",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1600&auto=format&fit=crop",
    status: "approved",
    maturityRating: "",
    runtime: "",
    creatorName: "",
    scheduledAt: null,
    views: 0,
  },
  {
    id: "fallback-5",
    title: "Animated Worlds",
    description:
      "Imaginative worlds told through animation.",
    type: "Animation",
    genre: "Animation",
    videoUrl: "",
    mainVideoUrl: "",
    trailerUrl: "",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=700&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1600&auto=format&fit=crop",
    status: "approved",
    maturityRating: "",
    runtime: "",
    creatorName: "",
    scheduledAt: null,
    views: 0,
  },
];

function normalizeContent(
  item: ApiContentItem
): LandingContentItem | null {
  if (!item.id || !item.title) {
    return null;
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description || "",
    type: item.type || "",
    genre: item.genre || "",

    videoUrl: item.videoUrl || "",
    mainVideoUrl:
      item.mainVideoUrl || "",
    trailerUrl: item.trailerUrl || "",

    thumbnailUrl:
      item.thumbnailUrl || "",
    backdropUrl:
      item.backdropUrl || "",

    status: item.status || "",
    maturityRating:
      item.maturityRating || "",
    runtime: item.runtime || "",
    creatorName:
      item.creatorName || "",

    scheduledAt:
      item.scheduledAt || null,
    views: item.views ?? undefined,
  };
}

export default function HomePage() {
  const [content, setContent] = useState<
    LandingContentItem[]
  >([]);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(
          "/api/content",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data: unknown =
          await response.json();

        if (!Array.isArray(data)) {
          return;
        }

        const normalized = data
          .map((item) =>
            normalizeContent(
              item as ApiContentItem
            )
          )
          .filter(
            (
              item
            ): item is LandingContentItem =>
              Boolean(item)
          );

        if (normalized.length > 0) {
          setContent(normalized);
        }
      } catch (error) {
        console.error(
          "Landing content load error:",
          error
        );
      }
    }

    loadContent();
  }, []);

  const displayContent =
    content.length > 0
      ? content
      : fallbackContent;

  const posters =
    useMemo<LandingPosterItem[]>(
      () =>
        displayContent.map((item) => ({
          id: item.id,
          title: item.title,
          thumbnailUrl:
            item.thumbnailUrl,
          backdropUrl:
            item.backdropUrl,
        })),
      [displayContent]
    );

  const trending = useMemo(
    () =>
      [...displayContent]
        .sort(
          (first, second) =>
            Number(second.views || 0) -
            Number(first.views || 0)
        )
        .slice(0, 12),
    [displayContent]
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <LandingHero posters={posters} />

      <LandingTrending items={trending} />

      <LandingPlans />

<ExperienceSection />
    </main>
  );
}