"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEFAULT_FILES,
  DEFAULT_FORM,
} from "../constants";

import type {
  PreviewMode,
  ProjectForm,
  UploadFiles,
  UploadKey,
} from "../types";

import {
  buildSubmissionPayload,
} from "../utils/buildSubmissionPayload";

import { validateFile } from "../utils/validateFile";

import useObjectUrl from "./useObjectUrl";
import usePartnerSubmitAccess from "./usePartnerSubmitAccess";
import useSubmissionReadiness from "./useSubmissionReadiness";

type ExistingAssets = {
  mainVideoUrl: string;
  trailerUrl: string;
  thumbnailUrl: string;
  backdropUrl: string;
  titleLogoUrl: string;
};

type EditableProject = {
  id: string;
  title?: string | null;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  year?: number | string | null;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  creatorCompany?: string | null;
  mainVideoUrl?: string | null;
  videoUrl?: string | null;
  trailerUrl?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;
};

type UseProjectSubmissionOptions = {
  projectId?: string;
};

const EMPTY_EXISTING_ASSETS: ExistingAssets = {
  mainVideoUrl: "",
  trailerUrl: "",
  thumbnailUrl: "",
  backdropUrl: "",
  titleLogoUrl: "",
};

export default function useProjectSubmission(
  options: UseProjectSubmissionOptions = {}
) {
  const projectId = options.projectId;
  const isEditMode = Boolean(projectId);

  const [submitting, setSubmitting] =
    useState(false);

  const [loadingProject, setLoadingProject] =
    useState(isEditMode);

  const [form, setForm] =
    useState<ProjectForm>(DEFAULT_FORM);

  const [files, setFiles] =
    useState<UploadFiles>(DEFAULT_FILES);

  const [existingAssets, setExistingAssets] =
    useState<ExistingAssets>(
      EMPTY_EXISTING_ASSETS
    );

  const [previewMode, setPreviewMode] =
    useState<PreviewMode>("main");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const checkingAccess =
    usePartnerSubmitAccess(setForm);

  useEffect(() => {
    if (!projectId || checkingAccess) {
      return;
    }

    let cancelled = false;

    async function loadProject() {
      try {
        setLoadingProject(true);
        setErrorMessage("");

        const response = await fetch(
          `/api/partner/projects/${projectId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const text = await response.text();

        let data:
          | EditableProject
          | {
              project?: EditableProject;
              error?: string;
              message?: string;
            }
          | null = null;

        try {
          data = text
            ? JSON.parse(text)
            : null;
        } catch {
          data = null;
        }

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (response.status === 403) {
          window.location.href =
            "/partner/apply";
          return;
        }

        if (response.status === 404) {
          if (!cancelled) {
            setErrorMessage(
              "This project could not be found."
            );
          }

          return;
        }

        if (!response.ok) {
          const errorData =
            data &&
            "project" in data
              ? data
              : null;

          throw new Error(
            errorData?.message ||
              errorData?.error ||
              "SourceTV could not load this project."
          );
        }

        const project =
          data &&
          "project" in data
            ? data.project
            : (data as EditableProject | null);

        if (!project) {
          throw new Error(
            "SourceTV returned an empty project."
          );
        }

        if (cancelled) {
          return;
        }

        setForm({
          title: project.title || "",
          description:
            project.description || "",
          type: project.type || "Film",
          genre: project.genre || "Drama",
          year:
            project.year === null ||
            project.year === undefined
              ? ""
              : String(project.year),
          maturityRating:
            project.maturityRating ||
            "Not Rated",
          runtime: project.runtime || "",
          creatorName:
            project.creatorName || "",
          creatorCompany:
            project.creatorCompany || "",
        });

        setExistingAssets({
          mainVideoUrl:
            project.mainVideoUrl ||
            project.videoUrl ||
            "",
          trailerUrl:
            project.trailerUrl || "",
          thumbnailUrl:
            project.thumbnailUrl || "",
          backdropUrl:
            project.backdropUrl || "",
          titleLogoUrl:
            project.titleLogoUrl || "",
        });

        setFiles(DEFAULT_FILES);
        setPreviewMode("main");
      } catch (error) {
        console.error(
          "PROJECT LOAD ERROR:",
          error
        );

        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "SourceTV could not load this project."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingProject(false);
        }
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [checkingAccess, projectId]);

  const mainVideoObjectUrl = useObjectUrl(
    files.mainVideoFile
  );

  const trailerObjectUrl = useObjectUrl(
    files.trailerFile
  );

  const posterObjectUrl = useObjectUrl(
    files.thumbnailFile
  );

  const backdropObjectUrl = useObjectUrl(
    files.backdropFile
  );

  const titleLogoObjectUrl = useObjectUrl(
    files.titleLogoFile
  );

  const mainVideoPreview =
    mainVideoObjectUrl ||
    existingAssets.mainVideoUrl;

  const trailerPreview =
    trailerObjectUrl ||
    existingAssets.trailerUrl;

  const posterPreview =
    posterObjectUrl ||
    existingAssets.thumbnailUrl;

  const backdropPreview =
    backdropObjectUrl ||
    existingAssets.backdropUrl;

  const titleLogoPreview =
    titleLogoObjectUrl ||
    existingAssets.titleLogoUrl;

  const {
    readinessItems,
    completedItems,
    readinessPercent,
  } = useSubmissionReadiness(
    form,
    files,
    existingAssets
  );

  function clearMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  function updateField(
    name: keyof ProjectForm,
    value: string
  ) {
    clearMessages();

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function updateFile(
    name: UploadKey,
    file: File | null
  ) {
    clearMessages();

    if (file) {
      const error = validateFile(
        name,
        file
      );

      if (error) {
        setErrorMessage(error);
        return;
      }
    }

    setFiles((current) => ({
      ...current,
      [name]: file,
    }));

    if (
      name === "mainVideoFile" &&
      file
    ) {
      setPreviewMode("main");
    }

    if (
      name === "trailerFile" &&
      file &&
      !files.mainVideoFile &&
      !existingAssets.mainVideoUrl
    ) {
      setPreviewMode("trailer");
    }
  }

  const hasMainVideo = Boolean(
    files.mainVideoFile ||
      existingAssets.mainVideoUrl
  );

  const requiredComplete = Boolean(
    form.title.trim() &&
      form.description.trim() &&
      form.type &&
      form.genre &&
      hasMainVideo
  );

  const activeVideoPreview =
    previewMode === "trailer"
      ? trailerPreview
      : mainVideoPreview;

  const activeVideoFile =
    previewMode === "trailer"
      ? files.trailerFile
      : files.mainVideoFile;

  const activeVideoExists = Boolean(
    activeVideoFile ||
      activeVideoPreview
  );

  const submitButtonLabel = useMemo(() => {
    if (submitting) {
      return isEditMode
        ? "Saving Changes..."
        : "Submitting Project...";
    }

    return isEditMode
      ? "Save Project Changes"
      : "Submit Project";
  }, [isEditMode, submitting]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    clearMessages();

    if (!form.title.trim()) {
      setErrorMessage(
        "Enter a project title."
      );
      return;
    }

    if (!form.description.trim()) {
      setErrorMessage(
        "Enter a project description."
      );
      return;
    }

    if (!hasMainVideo) {
      setErrorMessage(
        "Upload the main project video before submitting."
      );
      return;
    }

    const payload =
      buildSubmissionPayload(
        form,
        files,
        {
          requireMainVideo:
            !isEditMode ||
            !existingAssets.mainVideoUrl,
        }
      );

    try {
      setSubmitting(true);

      const response = await fetch(
        isEditMode
          ? `/api/partner/projects/${projectId}`
          : "/api/submit",
        {
          method: isEditMode
            ? "PATCH"
            : "POST",
          body: payload,
        }
      );

      const text = await response.text();

      let data: {
        error?: string;
        message?: string;
        project?: EditableProject;
      } | null = null;

      try {
        data = text
          ? JSON.parse(text)
          : null;
      } catch {
        data = null;
      }

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (response.status === 403) {
        window.location.href =
          "/partner/apply";
        return;
      }

      if (!response.ok) {
        setErrorMessage(
          data?.message ||
            data?.error ||
            (isEditMode
              ? "SourceTV could not save these project changes."
              : "SourceTV could not upload this project.")
        );

        return;
      }

      if (isEditMode) {
        setExistingAssets(
          (current) => ({
            mainVideoUrl:
              data?.project
                ?.mainVideoUrl ||
              data?.project?.videoUrl ||
              (files.mainVideoFile
                ? current.mainVideoUrl
                : current.mainVideoUrl),

            trailerUrl:
              data?.project?.trailerUrl ||
              current.trailerUrl,

            thumbnailUrl:
              data?.project
                ?.thumbnailUrl ||
              current.thumbnailUrl,

            backdropUrl:
              data?.project
                ?.backdropUrl ||
              current.backdropUrl,

            titleLogoUrl:
              data?.project
                ?.titleLogoUrl ||
              current.titleLogoUrl,
          })
        );

        setFiles(DEFAULT_FILES);

        setSuccessMessage(
          data?.message ||
            "Your project changes were saved successfully."
        );
      } else {
        const creatorName =
          form.creatorName;

        const creatorCompany =
          form.creatorCompany;

        setForm({
          ...DEFAULT_FORM,
          creatorName,
          creatorCompany,
        });

        setFiles(DEFAULT_FILES);
        setExistingAssets(
          EMPTY_EXISTING_ASSETS
        );
        setPreviewMode("main");

        setSuccessMessage(
          data?.message ||
            "Your project was uploaded successfully and entered the SourceTV review queue."
        );
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        isEditMode
          ? "PROJECT UPDATE ERROR:"
          : "PROJECT SUBMISSION ERROR:",
        error
      );

      setErrorMessage(
        isEditMode
          ? "The project changes could not be saved. Check your connection and try again."
          : "The upload could not be completed. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    checkingAccess,
    loadingProject,
    submitting,
    isEditMode,
    projectId,
    form,
    files,
    existingAssets,
    previewMode,
    errorMessage,
    successMessage,
    requiredComplete,
    readinessItems,
    completedItems,
    readinessPercent,
    activeVideoPreview,
    activeVideoFile,
    activeVideoExists,
    mainVideoPreview,
    trailerPreview,
    posterPreview,
    backdropPreview,
    titleLogoPreview,
    submitButtonLabel,
    setPreviewMode,
    updateField,
    updateFile,
    handleSubmit,
  };
}