import type {
  ProjectForm,
  UploadFiles,
} from "../types";

export function buildSubmissionPayload(
  form: ProjectForm,
  files: UploadFiles
) {
  if (!files.mainVideoFile) {
    throw new Error(
      "Main video is required."
    );
  }

  const payload = new FormData();

  payload.append(
    "title",
    form.title.trim()
  );

  payload.append(
    "description",
    form.description.trim()
  );

  payload.append("type", form.type);
  payload.append("genre", form.genre);

  payload.append(
    "year",
    form.year.trim()
  );

  payload.append(
    "maturityRating",
    form.maturityRating
  );

  payload.append(
    "runtime",
    form.runtime.trim()
  );

  payload.append(
    "creatorName",
    form.creatorName.trim()
  );

  payload.append(
    "creatorCompany",
    form.creatorCompany.trim()
  );

  payload.append("revenueShare", "50");

  payload.append(
    "mainVideoFile",
    files.mainVideoFile
  );

  if (files.trailerFile) {
    payload.append(
      "trailerFile",
      files.trailerFile
    );
  }

  if (files.thumbnailFile) {
    payload.append(
      "thumbnailFile",
      files.thumbnailFile
    );
  }

  if (files.backdropFile) {
    payload.append(
      "backdropFile",
      files.backdropFile
    );
  }

  if (files.titleLogoFile) {
    payload.append(
      "titleLogoFile",
      files.titleLogoFile
    );
  }

  return payload;
}