"use client";

import {
  FormEvent,
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

export default function useProjectSubmission() {
  const [submitting, setSubmitting] =
    useState(false);

  const [form, setForm] =
    useState<ProjectForm>(DEFAULT_FORM);

  const [files, setFiles] =
    useState<UploadFiles>(DEFAULT_FILES);

  const [previewMode, setPreviewMode] =
    useState<PreviewMode>("main");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const checkingAccess =
    usePartnerSubmitAccess(setForm);

  const mainVideoPreview = useObjectUrl(
    files.mainVideoFile
  );

  const trailerPreview = useObjectUrl(
    files.trailerFile
  );

  const posterPreview = useObjectUrl(
    files.thumbnailFile
  );

  const backdropPreview = useObjectUrl(
    files.backdropFile
  );

  const titleLogoPreview = useObjectUrl(
    files.titleLogoFile
  );

  const {
    readinessItems,
    completedItems,
    readinessPercent,
  } = useSubmissionReadiness(
    form,
    files
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
      const error = validateFile(name, file);

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
      !files.mainVideoFile
    ) {
      setPreviewMode("trailer");
    }
  }

  const requiredComplete = Boolean(
    form.title.trim() &&
      form.description.trim() &&
      form.type &&
      form.genre &&
      files.mainVideoFile
  );

  const activeVideoPreview =
    previewMode === "trailer"
      ? trailerPreview
      : mainVideoPreview;

  const activeVideoFile =
    previewMode === "trailer"
      ? files.trailerFile
      : files.mainVideoFile;

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

    if (!files.mainVideoFile) {
      setErrorMessage(
        "Upload the main project video before submitting."
      );
      return;
    }

    const payload =
      buildSubmissionPayload(
        form,
        files
      );

    try {
      setSubmitting(true);

      const response = await fetch(
        "/api/submit",
        {
          method: "POST",
          body: payload,
        }
      );

      const text = await response.text();

      let data: {
        error?: string;
        message?: string;
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
            "SourceTV could not upload this project."
        );
        return;
      }

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
      setPreviewMode("main");

      setSuccessMessage(
        "Your project was uploaded successfully and entered the SourceTV review queue."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "PROJECT SUBMISSION ERROR:",
        error
      );

      setErrorMessage(
        "The upload could not be completed. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return {
    checkingAccess,
    submitting,
    form,
    files,
    previewMode,
    errorMessage,
    successMessage,
    requiredComplete,
    readinessItems,
    completedItems,
    readinessPercent,
    activeVideoPreview,
    activeVideoFile,
    posterPreview,
    backdropPreview,
    titleLogoPreview,
    setPreviewMode,
    updateField,
    updateFile,
    handleSubmit,
  };
}