import { SubmissionError } from "./errors";
import {
  cleanString,
  getFile,
} from "./helpers";

export type SubmissionForm = {
  title: string;
  description: string;
  type: string;
  genre: string;
  yearValue: string;
  maturityRating: string;
  runtime: string;
  creatorName: string;
  creatorCompany: string;

  mainVideoFile: File;
  trailerFile: File | null;

  thumbnailFile: File | null;
  backdropFile: File | null;
  titleLogoFile: File | null;
};

export async function parseSubmissionForm(
  request: Request
): Promise<SubmissionForm> {
  const contentType =
    request.headers.get("content-type") || "";

  if (
    !contentType.includes(
      "multipart/form-data"
    )
  ) {
    throw new SubmissionError(
      "This endpoint requires a multipart project submission.",
      415
    );
  }

  const formData =
    await request.formData();

  const title = cleanString(
    formData.get("title")
  );

  const description = cleanString(
    formData.get("description")
  );

  if (!title) {
    throw new SubmissionError(
      "Project title is required."
    );
  }

  if (!description) {
    throw new SubmissionError(
      "Project description is required."
    );
  }

  const mainVideoFile = getFile(
    formData,
    "mainVideoFile"
  );

  if (!mainVideoFile) {
    throw new SubmissionError(
      "A main project video is required."
    );
  }

  return {
    title,
    description,

    type:
      cleanString(formData.get("type")) ||
      "Film",

    genre:
      cleanString(formData.get("genre")) ||
      "Drama",

    yearValue: cleanString(
      formData.get("year")
    ),

    maturityRating:
      cleanString(
        formData.get("maturityRating")
      ) || "Not Rated",

    runtime: cleanString(
      formData.get("runtime")
    ),

    creatorName: cleanString(
      formData.get("creatorName")
    ),

    creatorCompany: cleanString(
      formData.get("creatorCompany")
    ),

    mainVideoFile,

    trailerFile: getFile(
      formData,
      "trailerFile"
    ),

    thumbnailFile: getFile(
      formData,
      "thumbnailFile"
    ),

    backdropFile: getFile(
      formData,
      "backdropFile"
    ),

    titleLogoFile: getFile(
      formData,
      "titleLogoFile"
    ),
  };
}