function normalizeWhitespace(
  value: string
) {
  return value
    .trim()
    .replace(/\s+/g, " ");
}

export function createSlug(
  value: string
) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function toNullableDate(
  value: unknown
): Date | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const date = new Date(
    String(value)
  );

  return Number.isNaN(
    date.getTime()
  )
    ? null
    : date;
}

export function normalizeString(
  value: unknown
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized =
    normalizeWhitespace(value);

  return normalized.length > 0
    ? normalized
    : null;
}