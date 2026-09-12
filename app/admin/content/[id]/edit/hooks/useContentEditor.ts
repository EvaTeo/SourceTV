"use client";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import {
  fetchContentEditorItem,
  saveContentEditorItem,
} from "../lib/contentEditorApi";

import type { ContentEditorForm } from "../types";

import useContentAssetUploads from "./useContentAssetUploads";
import useContentSchedule from "./useContentSchedule";
import usePartnerMessage from "./usePartnerMessage";

export default function useContentEditor(
  id: string
) {
  const [
    form,
    setForm,
  ] =
    useState<ContentEditorForm | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        setLoading(true);

        const item =
          await fetchContentEditorItem(
            id
          );

        setForm(item);
      } catch (error) {
        console.error(
          "CONTENT EDITOR LOAD ERROR:",
          error
        );

        setForm(null);
      } finally {
        setLoading(false);
      }
    }

    void loadContent();
  }, [id]);

  function updateField(
    name: string,
    value: unknown
  ) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [name]: value,
      };
    });
  }

  async function saveChanges(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!form) {
      return;
    }

    try {
      setSaving(true);

      await saveContentEditorItem(
        id,
        form
      );

      window.alert(
        "Content updated!"
      );
    } catch (error) {
      console.error(
        "CONTENT SAVE ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Failed to save changes"
      );
    } finally {
      setSaving(false);
    }
  }

  const assets =
    useContentAssetUploads({
      id,

      onProjectUpdated:
        setForm,
    });

  const schedule =
    useContentSchedule({
      scheduledAt:
        form?.scheduledAt,

      onScheduledAtChange:
        (value) =>
          updateField(
            "scheduledAt",
            value
          ),
    });

  const partnerMessage =
    usePartnerMessage({
      id,

      partnerEmail:
        form?.creatorEmail,

      partnerName:
        form?.creatorName,

      partnerCompany:
        form?.creatorCompany,
    });

  return {
    form,
    loading,
    saving,

    updateField,
    saveChanges,

    ...assets,
    ...schedule,
    ...partnerMessage,
  };
}