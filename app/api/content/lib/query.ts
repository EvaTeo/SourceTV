import type { ContentMode, ContentQuery } from "./types";

const CONTENT_MODES: ContentMode[] = [
  "all",
  "trending",
  "featured",
  "new",
  "editor_picks",
  "genre",
  "type",
  "creator",
  "because_you_watched",
  "hidden_gems",
  "recommended",
];

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function parseContentMode(value: string | null): ContentMode {
  if (value && CONTENT_MODES.includes(value as ContentMode)) {
    return value as ContentMode;
  }

  return "all";
}

function parseLimit(value: string | null): number {
  const requestedLimit = Number(value ?? DEFAULT_LIMIT);

  if (!Number.isFinite(requestedLimit)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(
    Math.max(Math.trunc(requestedLimit), 1),
    MAX_LIMIT
  );
}

export function parseContentQuery(
  request: Request
): ContentQuery {
  const { searchParams } = new URL(request.url);

  return {
    mode: parseContentMode(searchParams.get("mode")),
    type: searchParams.get("type"),
    genre: searchParams.get("genre"),
    creatorName: searchParams.get("creatorName"),
    excludeId: searchParams.get("excludeId"),
    limit: parseLimit(searchParams.get("limit")),
  };
}