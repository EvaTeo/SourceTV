import { NextResponse } from "next/server";

export function adsErrorResponse(
  error: unknown
) {
  console.error(
    "[admin/ads]",
    error
  );

  return NextResponse.json(
    {
      error:
        "An unexpected error occurred while processing advertisements.",
    },
    {
      status: 500,
    }
  );
}