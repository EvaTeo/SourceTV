import type {
  ProjectForm,
  ReadinessItem,
  UploadFiles,
} from "../types";

type ExistingAssets = {
  mainVideoUrl?: string | null;
  trailerUrl?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;
};

export default function useSubmissionReadiness(
  form: ProjectForm,
  files: UploadFiles,
  existingAssets: ExistingAssets = {}
) {
  const readinessItems: ReadinessItem[] = [
    {
      label: "Project title",
      complete: Boolean(form.title.trim()),
      required: true,
    },
    {
      label: "Project description",
      complete: Boolean(
        form.description.trim()
      ),
      required: true,
    },
    {
      label: "Project type",
      complete: Boolean(form.type),
      required: true,
    },
    {
      label: "Genre",
      complete: Boolean(form.genre),
      required: true,
    },
    {
      label: "Main video",
      complete: Boolean(
        files.mainVideoFile ||
          existingAssets.mainVideoUrl
      ),
      required: true,
    },
    {
      label: "Trailer",
      complete: Boolean(
        files.trailerFile ||
          existingAssets.trailerUrl
      ),
      required: false,
    },
    {
      label: "Poster artwork",
      complete: Boolean(
        files.thumbnailFile ||
          existingAssets.thumbnailUrl
      ),
      required: false,
    },
    {
      label: "Backdrop artwork",
      complete: Boolean(
        files.backdropFile ||
          existingAssets.backdropUrl
      ),
      required: false,
    },
    {
      label: "Title logo",
      complete: Boolean(
        files.titleLogoFile ||
          existingAssets.titleLogoUrl
      ),
      required: false,
    },
  ];

  const completedItems =
    readinessItems.filter(
      (item) => item.complete
    ).length;

  const readinessPercent = Math.round(
    (completedItems /
      readinessItems.length) *
      100
  );

  return {
    readinessItems,
    completedItems,
    readinessPercent,
  };
}