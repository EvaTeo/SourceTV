import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function cleanContentItem(item: any) {
  return {
    ...item,
    description: item.description || "",
    type: item.type || "",
    genre: item.genre || "",
    thumbnailUrl: item.thumbnailUrl || "",
    backdropUrl: item.backdropUrl || "",
    trailerUrl: item.trailerUrl || "",
    creatorName: item.creatorName || "",
  };
}

export async function GET(request: Request) {
  try {
    const now = new Date();
    const currentTime = now.getTime();

    const { searchParams } = new URL(request.url);

    const mode = searchParams.get("mode") || "all";
    const type = searchParams.get("type");
    const genre = searchParams.get("genre");
    const creatorName = searchParams.get("creatorName");
    const excludeId = searchParams.get("excludeId");

    const requestedLimit = Number(searchParams.get("limit") || 50);
    const limit = Number.isNaN(requestedLimit) ? 50 : requestedLimit;

    const content = await prisma.projectSubmission.findMany({
      where: {
        OR: [
          {
            workflowStage: "published",
          },
          {
            workflowStage: "scheduled",
            scheduledAt: {
              lte: now,
            },
          },
        ],
      },
      orderBy: [
        {
          featured: "desc",
        },
        {
          heroPriority: "asc",
        },
        {
          featuredRank: "asc",
        },
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    const cleanContent = content
      .filter((item) => item.id !== excludeId)
      .map(cleanContentItem);

    let result = cleanContent;

    if (mode === "trending") {
      result = [...cleanContent].sort(
        (a, b) => (b.views || 0) - (a.views || 0)
      );
    }

    if (mode === "featured") {
      result = cleanContent
        .filter((item) => {
          if (!item.featured) return false;

          const startsAt = item.heroStartDate
            ? new Date(item.heroStartDate).getTime()
            : null;

          const endsAt = item.heroEndDate
            ? new Date(item.heroEndDate).getTime()
            : null;

          const hasValidStart =
            startsAt === null || !Number.isNaN(startsAt);

          const hasValidEnd =
            endsAt === null || !Number.isNaN(endsAt);

          if (!hasValidStart || !hasValidEnd) {
            return false;
          }

          const hasStarted =
            startsAt === null || startsAt <= currentTime;

          const hasNotEnded =
            endsAt === null || endsAt >= currentTime;

          return hasStarted && hasNotEnded;
        })
        .sort((a, b) => {
          const aPriority =
            typeof a.heroPriority === "number"
              ? a.heroPriority
              : typeof a.featuredRank === "number"
                ? a.featuredRank
                : 999;

          const bPriority =
            typeof b.heroPriority === "number"
              ? b.heroPriority
              : typeof b.featuredRank === "number"
                ? b.featuredRank
                : 999;

          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }

          const aDate = new Date(
            a.publishedAt || a.createdAt
          ).getTime();

          const bDate = new Date(
            b.publishedAt || b.createdAt
          ).getTime();

          return bDate - aDate;
        });
    }

    if (mode === "new") {
      result = [...cleanContent].sort((a, b) => {
        const aDate = new Date(
          a.publishedAt || a.createdAt
        ).getTime();

        const bDate = new Date(
          b.publishedAt || b.createdAt
        ).getTime();

        return bDate - aDate;
      });
    }

    if (mode === "editor_picks") {
      result = cleanContent.filter((item) => item.editorPick);
    }

    if (mode === "genre" && genre) {
      result = cleanContent.filter(
        (item) =>
          item.genre?.toLowerCase() === genre.toLowerCase()
      );
    }

    if (mode === "type" && type) {
      result = cleanContent.filter(
        (item) =>
          item.type?.toLowerCase() === type.toLowerCase()
      );
    }

    if (mode === "creator" && creatorName) {
      result = cleanContent.filter(
        (item) =>
          item.creatorName?.toLowerCase() ===
          creatorName.toLowerCase()
      );
    }

    if (mode === "because_you_watched") {
      result = cleanContent.filter((item) => {
        const typeMatch =
          type &&
          item.type?.toLowerCase() === type.toLowerCase();

        const genreMatch =
          genre &&
          item.genre?.toLowerCase() === genre.toLowerCase();

        const creatorMatch =
          creatorName &&
          item.creatorName?.toLowerCase() ===
            creatorName.toLowerCase();

        return Boolean(
          typeMatch || genreMatch || creatorMatch
        );
      });

      result = result.sort((a, b) => {
        let aScore = 0;
        let bScore = 0;

        if (
          genre &&
          a.genre?.toLowerCase() === genre.toLowerCase()
        ) {
          aScore += 4;
        }

        if (
          type &&
          a.type?.toLowerCase() === type.toLowerCase()
        ) {
          aScore += 2;
        }

        if (
          creatorName &&
          a.creatorName?.toLowerCase() ===
            creatorName.toLowerCase()
        ) {
          aScore += 3;
        }

        if (
          genre &&
          b.genre?.toLowerCase() === genre.toLowerCase()
        ) {
          bScore += 4;
        }

        if (
          type &&
          b.type?.toLowerCase() === type.toLowerCase()
        ) {
          bScore += 2;
        }

        if (
          creatorName &&
          b.creatorName?.toLowerCase() ===
            creatorName.toLowerCase()
        ) {
          bScore += 3;
        }

        return bScore - aScore;
      });
    }

    if (mode === "hidden_gems") {
      result = cleanContent
        .filter((item) => !item.featured)
        .sort(
          (a, b) => (a.views || 0) - (b.views || 0)
        );
    }

    if (mode === "recommended") {
      result = shuffle(cleanContent).sort((a, b) => {
        const aScore =
          (a.featured ? 5 : 0) +
          (a.editorPick ? 4 : 0) +
          Math.min(a.views || 0, 1000) / 100;

        const bScore =
          (b.featured ? 5 : 0) +
          (b.editorPick ? 4 : 0) +
          Math.min(b.views || 0, 1000) / 100;

        return bScore - aScore;
      });
    }

    return NextResponse.json(result.slice(0, limit));
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load public content",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}