import type {
  EditorialCollection,
  Project,
} from "../types";

export type CollectionPayload = {
  title: string;
  description: string | null;
  placement: string;
  status: string;
  sortOrder: number;
  startsAt: string | null;
  endsAt: string | null;
};

async function readJson(
  response: Response,
  invalidResponseMessage: string
): Promise<unknown> {
  const responseText =
    await response.text();

  try {
    return responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    console.error(
      invalidResponseMessage,
      response.status,
      responseText
    );

    throw new Error(
      `${invalidResponseMessage} (${response.status}).`
    );
  }
}

export async function fetchEditorialCollections(): Promise<
  EditorialCollection[]
> {
  const response = await fetch(
    "/api/admin/collections",
    {
      cache: "no-store",
    }
  );

  const data = await readJson(
    response,
    "Collections API returned an invalid response"
  );

  if (!response.ok) {
    const errorData = data as {
      error?: string;
    } | null;

    throw new Error(
      errorData?.error ||
        `Failed to load collections (${response.status}).`
    );
  }

  return Array.isArray(data)
    ? (data as EditorialCollection[])
    : [];
}

export async function fetchEditorialProjects(): Promise<
  Project[]
> {
  const response = await fetch(
    "/api/admin/content",
    {
      cache: "no-store",
    }
  );

  const data = await readJson(
    response,
    "Content API returned an invalid response"
  );

  if (!response.ok) {
    const errorData = data as {
      error?: string;
      message?: string;
    } | null;

    throw new Error(
      errorData?.error ||
        errorData?.message ||
        `Failed to load content library (${response.status}).`
    );
  }

  return Array.isArray(data)
    ? (data as Project[])
    : [];
}

export async function createEditorialCollection(
  payload: CollectionPayload
): Promise<{ id: string }> {
  const response = await fetch(
    "/api/admin/collections",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = (await response.json()) as {
    id?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      data.error ||
        "Failed to create collection."
    );
  }

  if (!data.id) {
    throw new Error(
      "Collection was created without an ID."
    );
  }

  return {
    id: data.id,
  };
}

export async function updateEditorialCollection(
  collectionId: string,
  payload: Partial<CollectionPayload>
) {
  const response = await fetch(
    `/api/admin/collections/${collectionId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Failed to save collection."
    );
  }

  return data;
}

export async function deleteEditorialCollection(
  collectionId: string
) {
  const response = await fetch(
    `/api/admin/collections/${collectionId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Failed to delete collection."
    );
  }

  return data;
}

export async function addEditorialCollectionProject(
  collectionId: string,
  projectId: string
) {
  const response = await fetch(
    `/api/admin/collections/${collectionId}/items`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        projectId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Failed to add title."
    );
  }

  return data;
}

export async function removeEditorialCollectionItem(
  collectionId: string,
  itemId: string
) {
  const response = await fetch(
    `/api/admin/collections/${collectionId}/items/${itemId}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Failed to remove title."
    );
  }

  return data;
}

export async function reorderEditorialCollectionItems(
  collectionId: string,
  orderedItemIds: string[]
) {
  const response = await fetch(
    `/api/admin/collections/${collectionId}/items`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        orderedItemIds,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Failed to reorder titles."
    );
  }

  return data;
}

export async function saveEditorialCollectionOrder(
  collections: EditorialCollection[]
) {
  const responses = await Promise.all(
    collections.map((collection) =>
      fetch(
        `/api/admin/collections/${collection.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sortOrder:
              collection.sortOrder,
          }),
        }
      )
    )
  );

  const failedResponse =
    responses.find(
      (response) => !response.ok
    );

  if (!failedResponse) {
    return;
  }

  const data = await failedResponse
    .json()
    .catch(() => null);

  throw new Error(
    data?.error ||
      "Failed to save collection order."
  );
}