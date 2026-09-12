import type { AdsQuery } from "./types";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

export function parseAdsQuery(
  searchParams: URLSearchParams
):
  | {
      success: true;
      query: AdsQuery;
    }
  | {
      success: false;
      error: string;
    } {
  const page = Number(
    searchParams.get("page") ?? DEFAULT_PAGE
  );

  const limit = Number(
    searchParams.get("limit") ?? DEFAULT_LIMIT
  );

  if (!Number.isFinite(page) || page < 1) {
    return {
      success: false,
      error: "Invalid page.",
    };
  }

  if (
    !Number.isFinite(limit) ||
    limit < 1 ||
    limit > MAX_LIMIT
  ) {
    return {
      success: false,
      error: "Invalid limit.",
    };
  }

  return {
    success: true,
    query: {
      page: Math.trunc(page),
      limit: Math.trunc(limit),
      status:
        searchParams.get("status") ?? undefined,
      type:
        searchParams.get("type") ?? undefined,
      search:
        searchParams.get("search") ??
        undefined,
    },
  };
}