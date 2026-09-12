import { prisma } from "@/app/lib/prisma";

function toNullableDate(value: unknown) {
  if (!value) {
    return null;
  }

  const date = new Date(String(value));

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

export async function getCollection(
  id: string
) {
  return prisma.editorialCollection.findUnique({
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
}

export async function updateCollection(
  id: string,
  body: Record<string, unknown>
) {
  return prisma.editorialCollection.update({
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
            description:
              body.description.trim() || null,
          }
        : {}),
      ...(typeof body.placement === "string"
        ? {
            placement:
              body.placement.trim() || "browse",
          }
        : {}),
      ...(typeof body.status === "string"
        ? {
            status:
              body.status.trim() || "draft",
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
            startsAt: toNullableDate(
              body.startsAt
            ),
          }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(
        body,
        "endsAt"
      )
        ? {
            endsAt: toNullableDate(
              body.endsAt
            ),
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
}

export async function deleteCollection(
  id: string
) {
  return prisma.editorialCollection.delete({
    where: {
      id,
    },
  });
}