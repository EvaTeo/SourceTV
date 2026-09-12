export const MAX_MAIN_VIDEO_SIZE =
  10 * 1024 * 1024 * 1024;

export const MAX_TRAILER_SIZE =
  3 * 1024 * 1024 * 1024;

export const MAX_IMAGE_SIZE =
  20 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function getVideoValidationError(
  file: File,
  label: string,
  maximumSize: number
): string | null {
  if (!file.type.startsWith("video/")) {
    return `${label} must be a valid video file.`;
  }

  if (file.size > maximumSize) {
    return `${label} exceeds the current upload limit.`;
  }

  return null;
}

export function getImageValidationError(
  file: File,
  label: string
): string | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as
        (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    return `${label} must be a JPG, PNG, or WebP image.`;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return `${label} must be smaller than 20 MB.`;
  }

  return null;
}