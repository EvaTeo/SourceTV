import { ContentRouteError } from "./errors";

type NumberOptions = {
  min?: number;
  max?: number;
  integer?: boolean;
  nullable?: boolean;
};

export function parseOptionalDate(
  value: unknown,
  fieldName: string
): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  const parsed = new Date(String(value));

  if (Number.isNaN(parsed.getTime())) {
    throw new ContentRouteError({
      error: "Invalid content update",
      message: `${fieldName} must be a valid date.`,
    });
  }

  return parsed;
}

export function parseOptionalNumber(
  value: unknown,
  fieldName: string,
  options: NumberOptions = {}
): number | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    if (options.nullable) {
      return null;
    }

    throw new ContentRouteError({
      error: "Invalid content update",
      message: `${fieldName} cannot be empty.`,
    });
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new ContentRouteError({
      error: "Invalid content update",
      message: `${fieldName} must be a valid number.`,
    });
  }

  if (
    options.integer &&
    !Number.isInteger(parsed)
  ) {
    throw new ContentRouteError({
      error: "Invalid content update",
      message: `${fieldName} must be a whole number.`,
    });
  }

  if (
    options.min !== undefined &&
    parsed < options.min
  ) {
    throw new ContentRouteError({
      error: "Invalid content update",
      message: `${fieldName} must be at least ${options.min}.`,
    });
  }

  if (
    options.max !== undefined &&
    parsed > options.max
  ) {
    throw new ContentRouteError({
      error: "Invalid content update",
      message: `${fieldName} cannot exceed ${options.max}.`,
    });
  }

  return parsed;
}

export function validateDateRange(
  start: Date | null | undefined,
  end: Date | null | undefined,
  startName: string,
  endName: string
) {
  if (
    start &&
    end &&
    start.getTime() > end.getTime()
  ) {
    throw new ContentRouteError({
      error: "Invalid content update",
      message: `${startName} cannot be after ${endName}.`,
    });
  }
}

export function optionalString(
  value: unknown
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return String(value);
}

export function optionalCleanString(
  value: unknown
): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  return String(value).trim();
}