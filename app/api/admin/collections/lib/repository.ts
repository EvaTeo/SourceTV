import { prisma } from "@/app/lib/prisma";

import { createSlug, toNullableDate } from "./helpers";
import type { CreateCollectionInput } from "./parser";

export async function getCollections() {
  return prisma.editorialCollection.findMany({
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
}

async function createUniqueSlug(
  requestedSlug: string | undefined,
  title: string
) {
  const baseSlug = createSlug(
    requestedSlug || title
  );

  if (!baseSlug) {
    throw new Error(
      "A valid collection slug could not be created."
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

  return slug;
}

export async function createCollection(
  input: CreateCollectionInput
) {
  const slug = await createUniqueSlug(
    input.slug,
    input.title
  );

  return prisma.editorialCollection.create({
    data: {
      title: input.title,
      slug,
      description:
        input.description || null,
      placement:
        input.placement || "browse",
      status:
        input.status || "active",
      sortOrder:
        input.sortOrder ?? 0,
      startsAt: toNullableDate(
        input.startsAt
      ),
      endsAt: toNullableDate(
        input.endsAt
      ),
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