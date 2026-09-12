import { NextResponse } from "next/server";

import { authorizeSubmission } from "./lib/auth";
import {
  handleSubmissionError,
  SubmissionError,
} from "./lib/errors";
import { parseSubmissionForm } from "./lib/form";
import { createProjectSubmission } from "./lib/project";
import { uploadSubmissionAssets } from "./lib/upload";
import {
  MAX_MAIN_VIDEO_SIZE,
  MAX_TRAILER_SIZE,
  validateImageFile,
  validateVideoFile,
} from "./lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await authorizeSubmission();

    const form =
      await parseSubmissionForm(request);

    const mainVideoError =
      validateVideoFile(
        form.mainVideoFile,
        "Main project video",
        MAX_MAIN_VIDEO_SIZE
      );

    if (mainVideoError) {
      throw new SubmissionError(
        mainVideoError
      );
    }

    if (form.trailerFile) {
      const trailerError =
        validateVideoFile(
          form.trailerFile,
          "Trailer",
          MAX_TRAILER_SIZE
        );

      if (trailerError) {
        throw new SubmissionError(
          trailerError
        );
      }
    }

    const imageFiles: Array<{
      file: File | null;
      label: string;
    }> = [
      {
        file: form.thumbnailFile,
        label: "Poster",
      },
      {
        file: form.backdropFile,
        label: "Backdrop",
      },
      {
        file: form.titleLogoFile,
        label: "Title logo",
      },
    ];

    for (const image of imageFiles) {
      if (!image.file) {
        continue;
      }

      const imageError =
        validateImageFile(
          image.file,
          image.label
        );

      if (imageError) {
        throw new SubmissionError(
          imageError
        );
      }
    }

    const parsedYear = form.yearValue
      ? Number(form.yearValue)
      : null;

    if (
      parsedYear !== null &&
      (!Number.isFinite(parsedYear) ||
        parsedYear < 1888 ||
        parsedYear > 2100)
    ) {
      throw new SubmissionError(
        "Enter a valid release year."
      );
    }

    const uploads =
      await uploadSubmissionAssets(form);

    const submission =
      await createProjectSubmission(
        form,
        uploads,
        user
      );

    return NextResponse.json(
      {
        success: true,
        submission,
        uploads: {
          mainVideo:
            uploads.mainVideo,

          trailerVideo:
            uploads.trailerVideo,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return handleSubmissionError(error);
  }
}