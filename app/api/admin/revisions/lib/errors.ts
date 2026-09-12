import { NextResponse } from "next/server";

export function revisionErrorResponse(
  error: unknown
) {
  console.error(
    "[admin/revisions]",
    error
  );

  return NextResponse.json(
    {
      error:
        "An unexpected error occurred while loading revisions.",
    },
    {
      status: 500,
    }
  );
}