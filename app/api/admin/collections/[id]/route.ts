import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function toNullableDate(value: unknown) {
  if (!value) {
    return null;
  }

  const date = new Date(String(value));

  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    const collection =
      await prisma.editorialCollection.findUnique({
        where: {
          id,
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

    if (!collection) {
      return NextResponse.json(
        {
          error: "Collection not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    console.error("GET ADMIN COLLECTION ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load collection.",
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
    const { id } = await context.params;
    const body = await request.json();

    const collection =
      await prisma.editorialCollection.update({
        where: {
          id,
        },
        data: {
          ...(typeof body.title === "string"
            ? {
                title: body.title.trim(),
              }
            : {}),
          ...(typeof body.description === "string"
            ? {
                description: body.description.trim() || null,
              }
            : {}),
          ...(typeof body.placement === "string"
            ? {
                placement: body.placement.trim() || "browse",
              }
            : {}),
          ...(typeof body.status === "string"
            ? {
                status: body.status.trim() || "draft",
              }
            : {}),
          ...(typeof body.sortOrder === "number"
            ? {
                sortOrder: body.sortOrder,
              }
            : {}),
          ...(Object.prototype.hasOwnProperty.call(
            body,
            "startsAt"
          )
            ? {
                startsAt: toNullableDate(body.startsAt),
              }
            : {}),
          ...(Object.prototype.hasOwnProperty.call(
            body,
            "endsAt"
          )
            ? {
                endsAt: toNullableDate(body.endsAt),
              }
            : {}),
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

    return NextResponse.json(collection);
  } catch (error) {
    console.error("UPDATE ADMIN COLLECTION ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update collection.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } = await context.params;

    await prisma.editorialCollection.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE ADMIN COLLECTION ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete collection.",
      },
      {
        status: 500,
      }
    );
  }
}