import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNullableDate(value: unknown) {
  if (!value) {
    return null;
  }

  const date = new Date(String(value));

  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  try {
    const collections = await prisma.editorialCollection.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
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

    return NextResponse.json(collections);
  } catch (error) {
    console.error("GET ADMIN COLLECTIONS ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load collections.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";

    if (!title) {
      return NextResponse.json(
        {
          error: "Collection title is required.",
        },
        {
          status: 400,
        }
      );
    }

    const requestedSlug =
      typeof body.slug === "string" ? body.slug.trim() : "";

    const baseSlug = createSlug(requestedSlug || title);

    if (!baseSlug) {
      return NextResponse.json(
        {
          error: "A valid collection slug could not be created.",
        },
        {
          status: 400,
        }
      );
    }

    let slug = baseSlug;
    let suffix = 2;

    while (
      await prisma.editorialCollection.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
        },
      })
    ) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const collection = await prisma.editorialCollection.create({
      data: {
        title,
        slug,
        description:
          typeof body.description === "string" &&
          body.description.trim()
            ? body.description.trim()
            : null,
        placement:
          typeof body.placement === "string" &&
          body.placement.trim()
            ? body.placement.trim()
            : "browse",
        status:
          typeof body.status === "string" &&
          body.status.trim()
            ? body.status.trim()
            : "active",
        sortOrder:
          typeof body.sortOrder === "number"
            ? body.sortOrder
            : 0,
        startsAt: toNullableDate(body.startsAt),
        endsAt: toNullableDate(body.endsAt),
      },
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

    return NextResponse.json(collection, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE ADMIN COLLECTION ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to create collection.",
      },
      {
        status: 500,
      }
    );
  }
}