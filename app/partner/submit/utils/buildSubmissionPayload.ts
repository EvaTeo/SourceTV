import type {
  ProjectForm,
  UploadFiles,
  UploadKey,
} from "../types";

type BuildPayloadOptions = {
  requireMainVideo?: boolean;
};

const FILE_FIELD_MAP: Record<
  UploadKey,
  string
> = {
  mainVideoFile: "mainVideoFile",
  trailerFile: "trailerFile",
  thumbnailFile: "thumbnailFile",
  backdropFile: "backdropFile",
  titleLogoFile: "titleLogoFile",
};

export function buildSubmissionPayload(
  form: ProjectForm,
  files: UploadFiles,
  options: BuildPayloadOptions = {}
) {
  const {
    requireMainVideo = true,
  } = options;

  const payload = new FormData();

  payload.append("title", form.title);
  payload.append(
    "description",
    form.description
  );
  payload.append("type", form.type);
  payload.append("genre", form.genre);
  payload.append("year", form.year);
  payload.append(
    "maturityRating",
    form.maturityRating
  );
  payload.append(
    "runtime",
    form.runtime
  );
  payload.append(
    "creatorName",
    form.creatorName
  );
  payload.append(
    "creatorCompany",
    form.creatorCompany
  );

  (
    Object.keys(FILE_FIELD_MAP) as UploadKey[]
  ).forEach((key) => {
    const file = files[key];

    if (!file) {
      return;
    }

    payload.append(
      FILE_FIELD_MAP[key],
      file
    );
  });

  if (
    requireMainVideo &&
    !files.mainVideoFile
  ) {
    throw new Error(
      "Main project video is required."
    );
  }

  return payload;
}