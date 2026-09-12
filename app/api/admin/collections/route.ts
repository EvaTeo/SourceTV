import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/app/api/admin/lib/auth";

import { collectionErrorResponse } from "./lib/errors";
import { parseCollectionCreate } from "./lib/parser";
import {
  createCollection,
  getCollections,
} from "./lib/repository";

export async function GET() {
  const authResponse =
    await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  try {
    const collections =
      await getCollections();

    return NextResponse.json(
      collections
    );
  } catch (error) {
    return collectionErrorResponse(
      error,
      "[admin/collections] GET",
      "Failed to load collections."
    );
  }
}

export async function POST(
  request: NextRequest
) {
  const authResponse =
    await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  const parsed =
    await parseCollectionCreate(
      request
    );

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

  try {
    const collection =
      await createCollection(
        parsed.data
      );

    return NextResponse.json(
      collection,
      {
        status: 201,
      }
    );
  } catch (error) {
    return collectionErrorResponse(
      error,
      "[admin/collections] POST",
      "Failed to create collection."
    );
  }
}