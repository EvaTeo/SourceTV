"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { emptyCollectionForm } from "../constants";
import type {
  CollectionForm,
  EditorialCollection,
  MoveDirection,
  Project,
} from "../types";
import { collectionToForm } from "../utils";

export default function useEditorialCollections() {
  const [collections, setCollections] = useState<
    EditorialCollection[]
  >([]);

  const [projects, setProjects] = useState<Project[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );

  const [form, setForm] = useState<CollectionForm>(
    emptyCollectionForm
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const [collectionSearch, setCollectionSearch] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [showTitlePicker, setShowTitlePicker] = useState(false);

  const selectedCollection = useMemo(() => {
    return (
      collections.find(
        (collection) => collection.id === selectedId
      ) || null
    );
  }, [collections, selectedId]);

  const filteredCollections = useMemo(() => {
    const cleanSearch = collectionSearch.trim().toLowerCase();

    if (!cleanSearch) {
      return collections;
    }

    return collections.filter((collection) => {
      return [
        collection.title,
        collection.slug,
        collection.placement,
        collection.status,
        collection.description,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(cleanSearch)
        );
    });
  }, [collections, collectionSearch]);

  const availableProjects = useMemo(() => {
    const cleanSearch = titleSearch.trim().toLowerCase();

    const assignedProjectIds = new Set(
      selectedCollection?.items.map((item) => item.projectId) ||
        []
    );

    return projects
      .filter(
        (project) => !assignedProjectIds.has(project.id)
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
              .includes(cleanSearch)
          );
      });
  }, [projects, selectedCollection, titleSearch]);

  const loadCollections = useCallback(
  async (preferredId?: string | null) => {
    const response = await fetch("/api/admin/collections", {
      cache: "no-store",
    });

    const responseText = await response.text();

    let data: any;

    try {
      data = responseText ? JSON.parse(responseText) : [];
    } catch {
      console.error(
        "COLLECTIONS API RETURNED NON-JSON:",
        response.status,
        responseText
      );

      throw new Error(
        `Collections API returned an invalid response (${response.status}). Check that app/api/admin/collections/route.ts exists and inspect the terminal for the server error.`
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.error || `Failed to load collections (${response.status}).`
      );
    }

    const nextCollections: EditorialCollection[] = Array.isArray(data)
      ? data
      : [];

    setCollections(nextCollections);

    const selectedStillExists = nextCollections.some(
      (collection) => collection.id === selectedId
    );

    const nextSelectedId =
      preferredId ||
      (selectedStillExists ? selectedId : null) ||
      nextCollections[0]?.id ||
      null;

    setSelectedId(nextSelectedId);

    return nextCollections;
  },
  [selectedId]
);

 const loadProjects = useCallback(async () => {
  const response = await fetch("/api/admin/content", {
    cache: "no-store",
  });

  const responseText = await response.text();

  let data: any;

  try {
    data = responseText ? JSON.parse(responseText) : [];
  } catch {
    console.error(
      "ADMIN CONTENT API RETURNED NON-JSON:",
      response.status,
      responseText
    );

    throw new Error(
      `Content API returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        `Failed to load content library (${response.status}).`
    );
  }

  setProjects(Array.isArray(data) ? data : []);
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
        console.error("LOAD EDITORIAL PAGE ERROR:", error);
        window.alert(
          error instanceof Error
            ? error.message
            : "Could not load editorial tools."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, []);

  useEffect(() => {
    if (creating) {
      return;
    }

    if (!selectedCollection) {
      setForm(emptyCollectionForm);
      return;
    }

    setForm(collectionToForm(selectedCollection));
  }, [creating, selectedCollection]);

  function selectCollection(id: string) {
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
      sortOrder: collections.length,
    });
  }

  function cancelCreating() {
    setCreating(false);
    setSelectedId(collections[0]?.id || null);
    setShowTitlePicker(false);
  }

  function updateForm<K extends keyof CollectionForm>(
    key: K,
    value: CollectionForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function buildCollectionPayload() {
    return {
      title: form.title.trim(),
      description: form.description.trim() || null,
      placement: form.placement,
      status: form.status,
      sortOrder: Number(form.sortOrder) || 0,
      startsAt: form.startsAt || null,
      endsAt: form.endsAt || null,
    };
  }

  async function createCollection() {
    if (!form.title.trim()) {
      window.alert("Enter a collection title.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/collections",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildCollectionPayload()),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to create collection."
        );
      }

      setCreating(false);
      await loadCollections(data.id);
    } catch (error) {
      console.error("CREATE COLLECTION ERROR:", error);

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
      window.alert("Enter a collection title.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/collections/${selectedCollection.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildCollectionPayload()),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to save collection."
        );
      }

      await loadCollections(selectedCollection.id);
    } catch (error) {
      console.error("SAVE COLLECTION ERROR:", error);

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

    const confirmed = window.confirm(
      `Delete "${selectedCollection.title}"? This removes the collection and its title assignments, but it will not delete the titles.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/collections/${selectedCollection.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to delete collection."
        );
      }

      setSelectedId(null);
      await loadCollections(null);
    } catch (error) {
      console.error("DELETE COLLECTION ERROR:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not delete the collection."
      );
    } finally {
      setSaving(false);
    }
  }

  async function addProject(projectId: string) {
    if (!selectedCollection) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/collections/${selectedCollection.id}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to add title."
        );
      }

      await loadCollections(selectedCollection.id);
    } catch (error) {
      console.error("ADD COLLECTION TITLE ERROR:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not add this title."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(itemId: string) {
    if (!selectedCollection) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/collections/${selectedCollection.id}/items/${itemId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to remove title."
        );
      }

      await loadCollections(selectedCollection.id);
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

  async function moveItem(
    itemId: string,
    direction: MoveDirection
  ) {
    if (!selectedCollection) {
      return;
    }

    const currentItems = [...selectedCollection.items];

    const currentIndex = currentItems.findIndex(
      (item) => item.id === itemId
    );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    if (
      nextIndex < 0 ||
      nextIndex >= currentItems.length
    ) {
      return;
    }

    const reorderedItems = [...currentItems];

    [
      reorderedItems[currentIndex],
      reorderedItems[nextIndex],
    ] = [
      reorderedItems[nextIndex],
      reorderedItems[currentIndex],
    ];

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/collections/${selectedCollection.id}/items`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderedItemIds: reorderedItems.map(
              (item) => item.id
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to reorder titles."
        );
      }

      await loadCollections(selectedCollection.id);
    } catch (error) {
      console.error(
        "REORDER COLLECTION TITLES ERROR:",
        error
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

  function toggleTitlePicker() {
    setShowTitlePicker((current) => !current);
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
    moveItem,

    refreshCollections: loadCollections,
  };
}