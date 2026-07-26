export type ParsedProjectForm = {
  title: string;
  description: string;
  type: string;
  genre: string;
  year: number | null;
  maturityRating: string;
  runtime: string | null;
  creatorName: string;
  creatorCompany: string | null;

  mainVideoFile: File | null;
  trailerFile: File | null;
  thumbnailFile: File | null;
  backdropFile: File | null;
  titleLogoFile: File | null;

  partnerNotes: string | null;
  changeSummary: string | null;
};

export class ProjectFormError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);

    this.name = "ProjectFormError";
    this.status = status;
  }
}

function cleanString(
  value: FormDataEntryValue | null
) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function getFile(
  formData: FormData,
  key: string
) {
  const value = formData.get(key);

  if (!(value instanceof File)) {
    return null;
  }

  if (value.size === 0) {
    return null;
  }

  return value;
}

function parseYear(value: string) {
  if (!value) {
    return null;
  }

  const parsedYear = Number(value);

  if (
    !Number.isFinite(parsedYear) ||
    parsedYear < 1888 ||
    parsedYear > 2100
  ) {
    throw new ProjectFormError(
      "Enter a valid release year."
    );
  }

  return Math.round(parsedYear);
}

export function parseProjectForm(
  formData: FormData
): ParsedProjectForm {
  const title = cleanString(
    formData.get("title")
  );

  const description = cleanString(
    formData.get("description")
  );

  if (!title) {
    throw new ProjectFormError(
      "Project title is required."
    );
  }

  if (!description) {
    throw new ProjectFormError(
      "Project description is required."
    );
  }

  const year = parseYear(
    cleanString(formData.get("year"))
  );

  const runtime =
    cleanString(formData.get("runtime")) ||
    null;

  const creatorCompany =
    cleanString(
      formData.get("creatorCompany")
    ) || null;

  const partnerNotes =
    cleanString(
      formData.get("partnerNotes")
    ) || null;

  const changeSummary =
    cleanString(
      formData.get("changeSummary")
    ) || null;

  return {
    title,
    description,

    type:
      cleanString(formData.get("type")) ||
      "Film",

    genre:
      cleanString(formData.get("genre")) ||
      "Drama",

    year,

    maturityRating:
      cleanString(
        formData.get("maturityRating")
      ) || "Not Rated",

    runtime,

    creatorName: cleanString(
      formData.get("creatorName")
    ),

    creatorCompany,

    mainVideoFile: getFile(
      formData,
      "mainVideoFile"
    ),

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

    partnerNotes,
    changeSummary,
  };
}