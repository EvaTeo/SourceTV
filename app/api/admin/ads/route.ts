import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/app/api/admin/lib/auth";

import { adsErrorResponse } from "./lib/errors";
import { parseAdsQuery } from "./lib/query";
import {
  getAdsPage,
  updateAdStatus,
} from "./lib/repository";

export async function GET(
  request: NextRequest
) {
  const authResponse = await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  const parsed = parseAdsQuery(
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
    const result = await getAdsPage(
      parsed.query
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    return adsErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest
) {
  const authResponse = await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  try {
    const body = await request.json();

    const result =
      await updateAdStatus(body);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return adsErrorResponse(error);
  }
}