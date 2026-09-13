import { prisma } from "@/app/lib/prisma";
import {
  defaultPlatformSettings,
  getPlatformSettings,
} from "@/app/lib/platformSettings";
import { NextResponse } from "next/server";

import { selectPublicContent } from "../content/lib/content";
import {
  browseContentSelect,
  getPublishedBrowseContent,
} from "../content/lib/repository";
import type {
  ContentMode,
  ContentQuery,
} from "../content/lib/types";

export const dynamic = "force-dynamic";

function createContentQuery(
  mode: ContentMode,
  limit: number
): ContentQuery {
  return {
    mode,
    type: null,
    genre: null,
    creatorName: null,
    excludeId: null,
    limit,
  };
}

function getContentIds(
  items: Array<{ id: string }>
) {
  return items.map((item) => item.id);
}

export async function GET() {
  try {
    const now = new Date();

    const [
      content,
      collections,
      settings,
    ] = await Promise.all([
      getPublishedBrowseContent(now),

      prisma.editorialCollection.findMany({
        where: {
          status: "active",
          placement: "browse",

          AND: [
            {
              OR: [
                {
                  startsAt: null,
                },
                {
                  startsAt: {
                    lte: now,
                  },
                },
              ],
            },

            {
              OR: [
                {
                  endsAt: null,
                },
                {
                  endsAt: {
                    gte: now,
                  },
                },
              ],
            },
          ],
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],

        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          placement: true,
          sortOrder: true,

          items: {
            orderBy: {
              sortOrder: "asc",
            },

            select: {
              project: {
                select:
                  browseContentSelect,
              },
            },
          },
        },
      }),

      getPlatformSettings().catch(() => {
        return defaultPlatformSettings;
      }),
    ]);

    const allContent =
      selectPublicContent(
        content,
        createContentQuery(
          "all",
          100
        ),
        now
      );

    const featured =
      selectPublicContent(
        content,
        createContentQuery(
          "featured",
          6
        ),
        now
      );

    const trending =
      selectPublicContent(
        content,
        createContentQuery(
          "trending",
          12
        ),
        now
      );

    const recentlyAdded =
      selectPublicContent(
        content,
        createContentQuery(
          "new",
          12
        ),
        now
      );

    const editorPicks =
      selectPublicContent(
        content,
        createContentQuery(
          "editor_picks",
          12
        ),
        now
      );

    const visibleCollections =
      collections
        .map((collection) => ({
          id: collection.id,
          title: collection.title,
          slug: collection.slug,
          description:
            collection.description,
          placement:
            collection.placement,
          sortOrder:
            collection.sortOrder,

          projects:
            collection.items
              .map(
                (item) =>
                  item.project
              )
              .filter(
                (project) =>
                  project.status ===
                    "approved" &&
                  (!project.scheduledAt ||
                    new Date(
                      project.scheduledAt
                    ) <= now)
              ),
        }))
        .filter(
          (collection) =>
            collection.projects
              .length > 0
        );

    const collectionProjects =
      visibleCollections.flatMap(
        (collection) =>
          collection.projects
      );

    const uniqueCollectionProjects =
      Array.from(
        new Map(
          collectionProjects.map(
            (project) => [
              project.id,
              project,
            ]
          )
        ).values()
      );

    const cleanedCollectionProjects =
      uniqueCollectionProjects.length >
      0
        ? selectPublicContent(
            uniqueCollectionProjects,
            createContentQuery(
              "all",
              uniqueCollectionProjects.length
            ),
            now
          )
        : [];

    const canonicalContentMap =
      new Map(
        allContent.map(
          (item) => [
            item.id,
            item,
          ]
        )
      );

    for (
      const item of
      cleanedCollectionProjects
    ) {
      if (
        !canonicalContentMap.has(
          item.id
        )
      ) {
        canonicalContentMap.set(
          item.id,
          item
        );
      }
    }

    const canonicalContent =
      Array.from(
        canonicalContentMap.values()
      );

    const editorialCollections =
      visibleCollections.map(
        (collection) => ({
          id: collection.id,
          title:
            collection.title,
          slug:
            collection.slug,
          description:
            collection.description,
          placement:
            collection.placement,
          sortOrder:
            collection.sortOrder,

          itemIds:
            collection.projects.map(
              (project) =>
                project.id
            ),
        })
      );

    return NextResponse.json(
      {
        content:
          canonicalContent,

        featuredIds:
          getContentIds(
            featured
          ),

        trendingIds:
          getContentIds(
            trending
          ),

        recentlyAddedIds:
          getContentIds(
            recentlyAdded
          ),

        editorPickIds:
          getContentIds(
            editorPicks
          ),

        editorialCollections,

        settings: {
          homepageRows:
            settings.homepageRows,

          aiRecommendations:
            settings.aiRecommendations,

          heroAutoplay:
            settings.heroAutoplay,

          autoplayMuted:
            settings.autoplayMuted,
        },
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "BROWSE HOMEPAGE LOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load the SourceTV homepage.",
      },
      {
        status: 500,
      }
    );
  }
}