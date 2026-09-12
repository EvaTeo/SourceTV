import { NextResponse } from "next/server";

export function settingsErrorResponse(
  error: unknown
) {
  console.error(
    "[admin/settings]",
    error
  );

  return NextResponse.json(
    {
      error:
        "An unexpected error occurred while updating platform settings.",
    },
    {
      status: 500,
    }
  );
}