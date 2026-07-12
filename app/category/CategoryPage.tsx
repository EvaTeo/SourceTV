import { prisma } from "@/app/lib/prisma";
import CategoryCatalogGrid, {
  type CategoryCatalogItem,
} from "./CategoryCatalogGrid";
import CategoryHero from "./CategoryHero";

type CategoryPageProps = {
  title: string;
  description: string;
  type?: string;
  genre?: string;
};

export default async function CategoryPage({
  title,
  description,
  type,
  genre,
}: CategoryPageProps) {
  const now = new Date();

  const databaseItems =
    await prisma.projectSubmission.findMany({
      where: {
        status: "approved",

        OR: [
          {
            scheduledAt: null,
          },
          {
            scheduledAt: {
              lte: now,
            },
          },
        ],

        ...(type && genre
          ? {
              AND: [
                {
                  OR: [
                    {
                      type,
                    },
                    {
                      genre,
                    },
                  ],
                },
              ],
            }
          : type
            ? {
                type,
              }
            : genre
              ? {
                  genre,
                }
              : {}),
      },

      orderBy: [
        {
          featured: "desc",
        },
        {
          featuredRank: "asc",
        },
        {
          views: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

      take: 100,
    });

  const items: CategoryCatalogItem[] =
    databaseItems.map((item) => ({
      id: item.id,
      title: item.title,
      description:
        item.description || "",
      type: item.type || "",
      genre: item.genre || "",
      year: item.year,
      maturityRating:
        item.maturityRating || "",
      runtime: item.runtime || "",
      creatorName:
        item.creatorName || "",
      thumbnailUrl:
        item.thumbnailUrl || "",
      backdropUrl:
        item.backdropUrl || "",
      titleLogoUrl:
        item.titleLogoUrl || "",
      mainVideoUrl:
        item.mainVideoUrl || "",
      videoUrl: item.videoUrl || "",
      trailerUrl:
        item.trailerUrl || "",
      status: item.status || "",
      scheduledAt: item.scheduledAt
        ? item.scheduledAt.toISOString()
        : null,
      views: item.views || 0,
      createdAt: item.createdAt
        ? item.createdAt.toISOString()
        : null,
      editorPick:
        item.editorPick === true,
    }));

  const featuredDatabaseItem =
    databaseItems.find(
      (item) => item.featured
    );

  const heroItem =
    items.find(
      (item) =>
        item.id ===
        featuredDatabaseItem?.id
    ) ||
    items[0] ||
    null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <CategoryHero
        categoryTitle={title}
        categoryDescription={description}
        item={heroItem}
      />

      <CategoryCatalogGrid
        title={title}
        items={items}
      />
    </main>
  );
}