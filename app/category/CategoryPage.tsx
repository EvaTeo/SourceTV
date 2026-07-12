import { prisma } from "@/app/lib/prisma";
import CategoryHero from "./CategoryHero";
import CategoryRows from "./CategoryRows";

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

  const items = await prisma.projectSubmission.findMany({
    where: {
      status: "approved",

      OR: [
        { scheduledAt: null },
        { scheduledAt: { lte: now } },
      ],

      ...(type && genre
        ? {
            AND: [
              {
                OR: [
                  { type },
                  { genre },
                ],
              },
            ],
          }
        : type
          ? { type }
          : genre
            ? { genre }
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

    take: 80,
  });

  const heroItem =
    items.find((item) => item.featured) ||
    items[0] ||
    null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <CategoryHero
        categoryTitle={title}
        categoryDescription={description}
        item={heroItem}
      />

      <CategoryRows
        title={title}
        items={items}
        heroId={heroItem?.id}
      />
    </main>
  );
}