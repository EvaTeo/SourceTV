import { NextResponse } from "next/server";

export function contentErrorResponse(error: unknown) {
  return NextResponse.json(
    {
      error: "Failed to load public content",
      message:
        error instanceof Error
          ? error.message
          : "Unknown error",
    },
    { status: 500 }
  );
}