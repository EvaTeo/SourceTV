"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  fetchAdminContent,
  updateAdminContent,
  type ContentUpdateBody,
} from "../lib/contentApi";

import type { ContentItem } from "../types";

import useContentFilters from "./useContentFilters";
import useContentModals from "./useContentModals";

export default function useAdminContent() {
  const [
    content,
    setContent,
  ] =
    useState<ContentItem[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    savingId,
    setSavingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    expandedId,
    setExpandedId,
  ] =
    useState<string | null>(
      null
    );

  async function loadContent() {
    try {
      setLoading(true);

      const nextContent =
        await fetchAdminContent();

      setContent(nextContent);
    } catch (error) {
      console.error(
        "ADMIN CONTENT LOAD ERROR:",
        error
      );

      setContent([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateContent(
    id: string,
    body: ContentUpdateBody
  ) {
    try {
      setSavingId(id);

      await updateAdminContent(
        id,
        body
      );

      await loadContent();
    } catch (error) {
      console.error(
        "UPDATE CONTENT ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not update this title."
      );
    } finally {
      setSavingId(null);
    }
  }

  useEffect(() => {
    void loadContent();
  }, []);

  function toggleExpanded(
    id: string
  ) {
    setExpandedId(
      (current) =>
        current === id
          ? null
          : id
    );
  }

  const filters =
    useContentFilters(
      content
    );

  const modals =
    useContentModals(
      updateContent,
      savingId
    );

  return {
    content,
    loading,
    savingId,

    expandedId,
    toggleExpanded,

    loadContent,
    updateContent,

    ...filters,
    ...modals,
  };
}