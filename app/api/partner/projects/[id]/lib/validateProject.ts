import {
  getImageValidationError,
  getVideoValidationError,
  MAX_MAIN_VIDEO_SIZE,
  MAX_TRAILER_SIZE,
} from "@/app/api/lib/uploadValidation";

export class ProjectValidationError extends Error {
  status: number;

  constructor(message: string) {
    super(message);

    this.name = "ProjectValidationError";
    this.status = 400;
  }
}

type ValidationInput = {
  mainVideoFile: File | null;
  trailerFile: File | null;
  thumbnailFile: File | null;
  backdropFile: File | null;
  titleLogoFile: File | null;
};

function throwIfValidationError(
  error: string | null
) {
  if (!error) {
    return;
  }

  throw new ProjectValidationError(
    error
  );
}

export function validateProject(
  data: ValidationInput
) {
  if (data.mainVideoFile) {
    throwIfValidationError(
      getVideoValidationError(
        data.mainVideoFile,
        "Main project video",
        MAX_MAIN_VIDEO_SIZE
      )
    );
  }

  if (data.trailerFile) {
    throwIfValidationError(
      getVideoValidationError(
        data.trailerFile,
        "Trailer",
        MAX_TRAILER_SIZE
      )
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

    throwIfValidationError(
      getImageValidationError(
        image.file,
        image.label
      )
    );
  }
}