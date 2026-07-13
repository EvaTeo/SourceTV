import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  context: {
    params: Promise<{
      id: string;
      itemId: string;
    }>;
  }
) {
  try {
    const { id: collectionId, itemId } =
      await context.params;

    await prisma.editorialCollectionItem.deleteMany({
      where: {
        id: itemId,
        collectionId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("REMOVE COLLECTION ITEM ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to remove title from collection.",
      },
      {
        status: 500,
      }
    );
  }
}