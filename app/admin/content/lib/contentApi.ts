import type { ContentItem } from "../types";

export type ContentUpdateBody =
  Record<string, unknown>;

async function readJson(
  response: Response
) {
  return response
    .json()
    .catch(() => null);
}

export async function fetchAdminContent(): Promise<
  ContentItem[]
> {
  const response = await fetch(
    "/api/admin/content",
    {
      cache: "no-store",
    }
  );

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Could not load admin content."
    );
  }

  return Array.isArray(data)
    ? data
    : [];
}

export async function updateAdminContent(
  id: string,
  body: ContentUpdateBody
) {
  const response = await fetch(
    `/api/admin/content/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(body),
    }
  );

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Failed to update content."
    );
  }

  return data;
}