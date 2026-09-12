import { NextResponse } from "next/server";

export function userErrorResponse(
  error: unknown,
  fallbackMessage = "An unexpected error occurred."
) {
  console.error(
    "[admin/users]",
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