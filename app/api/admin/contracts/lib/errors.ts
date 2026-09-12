import { NextResponse } from "next/server";

export function contractErrorResponse(
  error: unknown
) {
  console.error(
    "[admin/contracts]",
    error
  );

  return NextResponse.json(
    {
      error:
        "An unexpected error occurred while processing the contract.",
    },
    {
      status: 500,
    }
  );
}