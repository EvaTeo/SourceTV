const MAX_MAIN_VIDEO_SIZE =
  10 * 1024 * 1024 * 1024;

const MAX_TRAILER_SIZE =
  3 * 1024 * 1024 * 1024;

const MAX_IMAGE_SIZE =
  20 * 1024 * 1024;

export class ProjectValidationError extends Error {
  status: number;

  constructor(message: string) {
    super(message);

    this.name = "ProjectValidationError";
    this.status = 400;
  }
}

function validateVideoFile(
  file: File,
  label: string,
  maximumSize: number
) {
  if (!file.type.startsWith("video/")) {
    throw new ProjectValidationError(
      `${label} must be a valid video file.`
    );
  }

  if (file.size > maximumSize) {
    throw new ProjectValidationError(
      `${label} exceeds the current upload limit.`
    );
  }
}

function validateImageFile(
  file: File,
  label: string
) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new ProjectValidationError(
      `${label} must be a JPG, PNG, or WebP image.`
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new ProjectValidationError(
      `${label} must be smaller than 20 MB.`
    );
  }
}

type ValidationInput = {
  mainVideoFile: File | null;
  trailerFile: File | null;
  thumbnailFile: File | null;
  backdropFile: File | null;
  titleLogoFile: File | null;
};

export function validateProject(
  data: ValidationInput
) {
  if (data.mainVideoFile) {
    validateVideoFile(
      data.mainVideoFile,
      "Main project video",
      MAX_MAIN_VIDEO_SIZE
    );
  }

  if (data.trailerFile) {
    validateVideoFile(
      data.trailerFile,
      "Trailer",
      MAX_TRAILER_SIZE
    );
  }

  const images = [
    {
      file: data.thumbnailFile,
      label: "Poster",
    },
    {
      file: data.backdropFile,
      label: "Backdrop",
    },
    {
      file: data.titleLogoFile,
      label: "Title Logo",
    },
  ];

  for (const image of images) {
    if (!image.file) {
      continue;
    }

    validateImageFile(
      image.file,
      image.label
    );
  }
}