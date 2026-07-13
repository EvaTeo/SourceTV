import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id: collectionId } = await context.params;
    const body = await request.json();

    const projectId =
      typeof body.projectId === "string"
        ? body.projectId.trim()
        : "";

    if (!projectId) {
      return NextResponse.json(
        {
          error: "Project ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const existing =
      await prisma.editorialCollectionItem.findUnique({
        where: {
          collectionId_projectId: {
            collectionId,
            projectId,
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error: "This title is already in the collection.",
        },
        {
          status: 409,
        }
      );
    }

    const lastItem =
      await prisma.editorialCollectionItem.findFirst({
        where: {
          collectionId,
        },
        orderBy: {
          sortOrder: "desc",
        },
        select: {
          sortOrder: true,
        },
      });

    const item =
      await prisma.editorialCollectionItem.create({
        data: {
          collectionId,
          projectId,
          sortOrder: (lastItem?.sortOrder ?? -1) + 1,
        },
        include: {
          project: true,
        },
      });

    return NextResponse.json(item, {
      status: 201,
    });
  } catch (error) {
    console.error("ADD COLLECTION ITEM ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to add title to collection.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id: collectionId } = await context.params;
    const body = await request.json();

    const orderedItemIds = Array.isArray(body.orderedItemIds)
      ? body.orderedItemIds.filter(
          (value: unknown): value is string =>
            typeof value === "string"
        )
      : [];

    await prisma.$transaction(
      orderedItemIds.map((itemId: string, index: number) =>
        prisma.editorialCollectionItem.updateMany({
          where: {
            id: itemId,
            collectionId,
          },
          data: {
            sortOrder: index,
          },
        })
      )
    );

    const items =
      await prisma.editorialCollectionItem.findMany({
        where: {
          collectionId,
        },
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          project: true,
        },
      });

    return NextResponse.json(items);
  } catch (error) {
    console.error("REORDER COLLECTION ITEMS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to reorder collection titles.",
      },
      {
        status: 500,
      }
    );
  }
}