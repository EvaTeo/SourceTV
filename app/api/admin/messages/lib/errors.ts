import { NextResponse } from "next/server";

export function adminMessageErrorResponse(
  error: unknown,
  fallbackMessage = "An unexpected error occurred."
) {
  console.error(
    "[admin/messages]",
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