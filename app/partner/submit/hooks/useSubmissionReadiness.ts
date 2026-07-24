"use client";

import { useMemo } from "react";

import type {
  ProjectForm,
  ReadinessItem,
  UploadFiles,
} from "../types";

export default function useSubmissionReadiness(
  form: ProjectForm,
  files: UploadFiles
) {
  const readinessItems =
    useMemo<ReadinessItem[]>(
      () => [
        {
          label: "Project title",
          complete: Boolean(
            form.title.trim()
          ),
          required: true,
        },
        {
          label: "Description",
          complete: Boolean(
            form.description.trim()
          ),
          required: true,
        },
        {
          label: "Main video",
          complete: Boolean(
            files.mainVideoFile
          ),
          required: true,
        },
        {
          label: "Trailer",
          complete: Boolean(
            files.trailerFile
          ),
          required: false,
        },
        {
          label: "Poster artwork",
          complete: Boolean(
            files.thumbnailFile
          ),
          required: false,
        },
        {
          label: "Backdrop artwork",
          complete: Boolean(
            files.backdropFile
          ),
          required: false,
        },
        {
          label: "Title logo",
          complete: Boolean(
            files.titleLogoFile
          ),
          required: false,
        },
      ],
      [
        files.backdropFile,
        files.mainVideoFile,
        files.thumbnailFile,
        files.titleLogoFile,
        files.trailerFile,
        form.description,
        form.title,
      ]
    );

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