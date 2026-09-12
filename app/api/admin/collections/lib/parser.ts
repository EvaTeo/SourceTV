import { NextRequest } from "next/server";

export type CreateCollectionInput = {
  title: string;
  slug?: string;
  description?: string;
  placement?: string;
  status?: string;
  sortOrder?: number;
  startsAt?: string | null;
  endsAt?: string | null;
};

export async function parseCollectionCreate(
  request: NextRequest
): Promise<
  | {
      success: true;
      data: CreateCollectionInput;
    }
  | {
      success: false;
      error: string;
    }
> {
  try {
    const body = (await request.json()) as Record<
      string,
      unknown
    >;

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    if (!title) {
      return {
        success: false,
        error: "Title is required.",
      };
    }

    return {
      success: true,
      data: {
        title,
        slug:
          typeof body.slug === "string"
            ? body.slug.trim()
            : undefined,
        description:
          typeof body.description === "string"
            ? body.description.trim()
            : undefined,
        placement:
          typeof body.placement === "string"
            ? body.placement.trim()
            : undefined,
        status:
          typeof body.status === "string"
            ? body.status.trim()
            : undefined,
        sortOrder:
          typeof body.sortOrder === "number"
            ? body.sortOrder
            : undefined,
        startsAt:
          typeof body.startsAt === "string"
            ? body.startsAt
            : null,
        endsAt:
          typeof body.endsAt === "string"
            ? body.endsAt
            : null,
      },
    };
  } catch {
    return {
      success: false,
      error: "Invalid request body.",
    };
  }
}