import { NextResponse } from "next/server";

export function collectionErrorResponse(
  error: unknown,
  logPrefix = "[admin/collections]",
  fallbackMessage = "An unexpected error occurred."
) {
  console.error(
    logPrefix,
    error
  );

  return NextResponse.json(
    {
      error: fallbackMessage,
    },
    {
      status: 500,
    }
  );
}