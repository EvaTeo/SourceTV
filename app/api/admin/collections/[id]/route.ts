import { NextRequest, NextResponse } from "next/server";

import { collectionErrorResponse } from "./lib/errors";
import { parseCollectionUpdate } from "./lib/parser";
import {
  deleteCollection,
  getCollection,
  updateCollection,
} from "./lib/repository";
import type { CollectionRouteContext } from "./lib/types";

export async function GET(
  _request: NextRequest,
  context: CollectionRouteContext
) {
  try {
    const { id } = await context.params;
    const collection = await getCollection(id);

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
  } catch (error: unknown) {
    return collectionErrorResponse(
      error,
      "GET ADMIN COLLECTION ERROR:",
      "Failed to load collection."
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: CollectionRouteContext
) {
  try {
    const { id } = await context.params;
    const parsed = await parseCollectionUpdate(request);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error,
        },
        {
          status: 400,
        }
      );
    }

    const collection = await updateCollection(
      id,
      parsed.data
    );

    return NextResponse.json(collection);
  } catch (error: unknown) {
    return collectionErrorResponse(
      error,
      "UPDATE ADMIN COLLECTION ERROR:",
      "Failed to update collection."
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: CollectionRouteContext
) {
  try {
    const { id } = await context.params;

    await deleteCollection(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    return collectionErrorResponse(
      error,
      "DELETE ADMIN COLLECTION ERROR:",
      "Failed to delete collection."
    );
  }
}