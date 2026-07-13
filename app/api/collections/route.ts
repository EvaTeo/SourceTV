import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    const collections = await prisma.editorialCollection.findMany({
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
      include: {
        items: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            project: true,
          },
        },
      },
    });

    const visibleCollections = collections
      .map((collection) => ({
        id: collection.id,
        title: collection.title,
        slug: collection.slug,
        description: collection.description,
        placement: collection.placement,
        sortOrder: collection.sortOrder,
        items: collection.items
          .map((item) => item.project)
          .filter(
            (project) =>
              project.status === "approved" &&
              (!project.scheduledAt ||
                new Date(project.scheduledAt) <= now)
          ),
      }))
      .filter((collection) => collection.items.length > 0);

    return NextResponse.json(visibleCollections);
  } catch (error) {
    console.error("PUBLIC COLLECTIONS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load editorial collections.",
      },
      {
        status: 500,
      }
    );
  }
}