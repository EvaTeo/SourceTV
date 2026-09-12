import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/app/api/admin/lib/auth";

import { revisionErrorResponse } from "./lib/errors";
import { parseRevisionQuery } from "./lib/query";
import { getRevisionPage } from "./lib/repository";

export async function GET(
  request: NextRequest
) {
  const authResponse = await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  const parsed = parseRevisionQuery(
    request.nextUrl.searchParams
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
    const result = await getRevisionPage(
      parsed.query
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    return revisionErrorResponse(error);
  }
}