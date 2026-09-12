"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { emptyCollectionForm } from "../constants";

import {
  addEditorialCollectionProject,
  createEditorialCollection,
  deleteEditorialCollection,
  fetchEditorialCollections,
  fetchEditorialProjects,
  removeEditorialCollectionItem,
  reorderEditorialCollectionItems,
  saveEditorialCollectionOrder,
  updateEditorialCollection,
  type CollectionPayload,
} from "../lib/editorialCollectionsApi";

import type {
  CollectionForm,
  EditorialCollection,
  Project,
} from "../types";

import { collectionToForm } from "../utils";

export default function useEditorialCollections() {
  const [collections, setCollections] =
    useState<EditorialCollection[]>([]);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<CollectionForm>(
      emptyCollectionForm
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [
    collectionSearch,
    setCollectionSearch,
  ] = useState("");

  const [
    titleSearch,
    setTitleSearch,
  ] = useState("");

  const [
    showTitlePicker,
    setShowTitlePicker,
  ] = useState(false);

  const selectedCollection =
    useMemo(() => {
      return (
        collections.find(
          (collection) =>
            collection.id ===
            selectedId
        ) || null
      );
    }, [
      collections,
      selectedId,
    ]);

  const filteredCollections =
    useMemo(() => {
      const cleanSearch =
        collectionSearch
          .trim()
          .toLowerCase();

      if (!cleanSearch) {
        return collections;
      }

      return collections.filter(
        (collection) => {
          return [
            collection.title,
            collection.slug,
            collection.placement,
            collection.status,
            collection.description,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  cleanSearch
                )
            );
        }
      );
    }, [
      collections,
      collectionSearch,
    ]);

  const availableProjects =
    useMemo(() => {
      const cleanSearch =
        titleSearch
          .trim()
          .toLowerCase();

      const assignedProjectIds =
        new Set(
          selectedCollection?.items.map(
            (item) =>
              item.projectId
          ) || []
        );

      return projects
        .filter(
          (project) =>
            !assignedProjectIds.has(
              project.id
            )
        )
        .filter((project) => {
          if (!cleanSearch) {
            return true;
          }

          return [
            project.title,
            project.description,
            project.type,
            project.genre,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value)
                .toLowerCase()
                .includes(
                  cleanSearch
                )
            );
        });
    }, [
      projects,
      selectedCollection,
      titleSearch,
    ]);

  const loadCollections =
    useCallback(
      async (
        preferredId?: string | null
      ) => {
        const nextCollections =
          await fetchEditorialCollections();

        setCollections(
          nextCollections
        );

        const selectedStillExists =
          nextCollections.some(
            (collection) =>
              collection.id ===
              selectedId
          );

        const nextSelectedId =
          preferredId ||
          (selectedStillExists
            ? selectedId
            : null) ||
          nextCollections[0]?.id ||
          null;

        setSelectedId(
          nextSelectedId
        );

        return nextCollections;
      },
      [selectedId]
    );

  const loadProjects =
    useCallback(async () => {
      const nextProjects =
        await fetchEditorialProjects();

      setProjects(
        nextProjects
      );
    }, []);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);

        await Promise.all([
          loadCollections(),
          loadProjects(),
        ]);
      } catch (error) {
        console.error(
          "LOAD EDITORIAL PAGE ERROR:",
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "Could not load editorial tools."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [
    loadCollections,
    loadProjects,
  ]);

  useEffect(() => {
    if (creating) {
      return;
    }

    if (!selectedCollection) {
      setForm(
        emptyCollectionForm
      );

      return;
    }

    setForm(
      collectionToForm(
        selectedCollection
      )
    );
  }, [
    creating,
    selectedCollection,
  ]);

  function selectCollection(
    id: string
  ) {
    setCreating(false);
    setSelectedId(id);
    setShowTitlePicker(false);
    setTitleSearch("");
  }

  function startNewCollection() {
    setCreating(true);
    setSelectedId(null);
    setShowTitlePicker(false);
    setTitleSearch("");

    setForm({
      ...emptyCollectionForm,
      sortOrder:
        collections.length + 1,
    });
  }

  function cancelCreating() {
    setCreating(false);

    setSelectedId(
      collections[0]?.id ||
        null
    );

    setShowTitlePicker(false);
  }

  function updateForm<
    K extends keyof CollectionForm,
  >(
    key: K,
    value: CollectionForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function buildCollectionPayload(): CollectionPayload {
    return {
      title:
        form.title.trim(),

      description:
        form.description.trim() ||
        null,

      placement:
        form.placement,

      status:
        form.status,

      sortOrder:
        Number(
          form.sortOrder
        ) || 0,

      startsAt:
        form.startsAt ||
        null,

      endsAt:
        form.endsAt ||
        null,
    };
  }

  async function createCollection() {
    if (!form.title.trim()) {
      window.alert(
        "Enter a collection title."
      );

      return;
    }

    try {
      setSaving(true);

      const data =
        await createEditorialCollection(
          buildCollectionPayload()
        );

      setCreating(false);

      await loadCollections(
        data.id
      );
    } catch (error) {
      console.error(
        "CREATE COLLECTION ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not create the collection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveCollection() {
    if (!selectedCollection) {
      return;
    }

    if (!form.title.trim()) {
      window.alert(
        "Enter a collection title."
      );

      return;
    }

    try {
      setSaving(true);

      await updateEditorialCollection(
        selectedCollection.id,
        buildCollectionPayload()
      );

      await loadCollections(
        selectedCollection.id
      );
    } catch (error) {
      console.error(
        "SAVE COLLECTION ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not save the collection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteCollection() {
    if (!selectedCollection) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${selectedCollection.title}"? This removes the collection and its title assignments, but it will not delete the titles.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await deleteEditorialCollection(
        selectedCollection.id
      );

      setSelectedId(null);

      await loadCollections(
        null
      );
    } catch (error) {
      console.error(
        "DELETE COLLECTION ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not delete the collection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function addProject(
    projectId: string
  ) {
    if (!selectedCollection) {
      return;
    }

    try {
      setSaving(true);

      await addEditorialCollectionProject(
        selectedCollection.id,
        projectId
      );

      await loadCollections(
        selectedCollection.id
      );
    } catch (error) {
      console.error(
        "ADD COLLECTION TITLE ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not add this title."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(
    itemId: string
  ) {
    if (!selectedCollection) {
      return;
    }

    try {
      setSaving(true);

      await removeEditorialCollectionItem(
        selectedCollection.id,
        itemId
      );

      await loadCollections(
        selectedCollection.id
      );
    } catch (error) {
      console.error(
        "REMOVE COLLECTION TITLE ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not remove this title."
      );
    } finally {
      setSaving(false);
    }
  }

  async function reorderItems(
    reorderedItems:
      EditorialCollection["items"]
  ) {
    if (!selectedCollection) {
      return;
    }

    const previousCollections =
      collections;

    const normalizedItems =
      reorderedItems.map(
        (item, index) => ({
          ...item,
          sortOrder: index,
        })
      );

    setCollections(
      (current) =>
        current.map(
          (collection) =>
            collection.id ===
            selectedCollection.id
              ? {
                  ...collection,
                  items:
                    normalizedItems,
                }
              : collection
        )
    );

    try {
      setSaving(true);

      await reorderEditorialCollectionItems(
        selectedCollection.id,
        normalizedItems.map(
          (item) => item.id
        )
      );

      await loadCollections(
        selectedCollection.id
      );
    } catch (error) {
      console.error(
        "REORDER COLLECTION TITLES ERROR:",
        error
      );

      setCollections(
        previousCollections
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not reorder the titles."
      );
    } finally {
      setSaving(false);
    }
  }

  async function reorderCollections(
    reordered:
      EditorialCollection[]
  ) {
    const previous =
      collections;

    const normalized =
      reordered.map(
        (
          collection,
          index
        ) => ({
          ...collection,
          sortOrder:
            index + 1,
        })
      );

    setCollections(
      normalized
    );

    try {
      setSaving(true);

      await saveEditorialCollectionOrder(
        normalized
      );

      await loadCollections(
        selectedId
      );
    } catch (error) {
      console.error(
        "COLLECTION REORDER ERROR:",
        error
      );

      setCollections(
        previous
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not reorder collections."
      );
    } finally {
      setSaving(false);
    }
  }

  function toggleTitlePicker() {
    setShowTitlePicker(
      (current) =>
        !current
    );
  }

  return {
    collections,
    projects,

    selectedCollection,
    filteredCollections,
    availableProjects,

    form,
    updateForm,

    loading,
    saving,
    creating,

    collectionSearch,
    setCollectionSearch,

    titleSearch,
    setTitleSearch,

    showTitlePicker,
    toggleTitlePicker,

    selectCollection,
    startNewCollection,
    cancelCreating,

    createCollection,
    saveCollection,
    deleteCollection,

    addProject,
    removeItem,
    reorderItems,
    reorderCollections,

    refreshCollections:
      loadCollections,
  };
}