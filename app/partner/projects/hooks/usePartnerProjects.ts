"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { PartnerProject } from "../types";

import {
  getStageIndex,
  hasAttention,
} from "../utils";

export default function usePartnerProjects() {
  const [projects, setProjects] = useState<
    PartnerProject[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [sortOrder, setSortOrder] =
    useState("recent");

  const [
    expandedProjectId,
    setExpandedProjectId,
  ] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch(
          "/api/partner/projects",
          {
            cache: "no-store",
          }
        );

        if (
          response.status === 401 ||
          response.status === 403
        ) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error(
            `Failed to load projects: ${response.status}`
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (error) {
        console.error(
          "PARTNER PROJECTS LOAD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const projectTypes = useMemo(() => {
    return Array.from(
      new Set(
        projects
          .map((project) =>
            project.type?.trim()
          )
          .filter(
            (type): type is string =>
              Boolean(type)
          )
      )
    ).sort();
  }, [projects]);

  const stats = useMemo(() => {
    const inReviewStages = new Set([
      "submission",
      "metadata_review",
      "content_review",
      "rights_review",
    ]);

    return {
      total: projects.length,

      reviewing: projects.filter((project) =>
        inReviewStages.has(
          project.workflowStage
        )
      ).length,

      published: projects.filter(
        (project) =>
          project.workflowStage === "published"
      ).length,

      attention: projects.filter(
        hasAttention
      ).length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    const result = projects.filter(
      (project) => {
        const matchesSearch =
          !query ||
          project.title
            .toLowerCase()
            .includes(query) ||
          project.description
            ?.toLowerCase()
            .includes(query) ||
          project.genre
            ?.toLowerCase()
            .includes(query) ||
          project.type
            ?.toLowerCase()
            .includes(query) ||
          project.creatorName
            ?.toLowerCase()
            .includes(query) ||
          project.creatorCompany
            ?.toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          project.workflowStage ===
            statusFilter;

        const matchesType =
          typeFilter === "all" ||
          project.type === typeFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType
        );
      }
    );

    return [...result].sort((a, b) => {
      if (sortOrder === "title") {
        return a.title.localeCompare(
          b.title
        );
      }

      if (sortOrder === "status") {
        return (
          getStageIndex(
            b.workflowStage
          ) -
          getStageIndex(
            a.workflowStage
          )
        );
      }

      const aDate = new Date(
        a.publishedAt ||
          a.scheduledAt ||
          0
      ).getTime();

      const bDate = new Date(
        b.publishedAt ||
          b.scheduledAt ||
          0
      ).getTime();

      return bDate - aDate;
    });
  }, [
    projects,
    search,
    statusFilter,
    typeFilter,
    sortOrder,
  ]);

  useEffect(() => {
    if (!expandedProjectId) {
      return;
    }

    const isStillVisible =
      filteredProjects.some(
        (project) =>
          project.id ===
          expandedProjectId
      );

    if (!isStillVisible) {
      setExpandedProjectId(null);
    }
  }, [
    expandedProjectId,
    filteredProjects,
  ]);

  const filtersActive =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    sortOrder !== "recent";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortOrder("recent");
    setExpandedProjectId(null);
  }

  function toggleProject(
    projectId: string
  ) {
    setExpandedProjectId(
      (currentId) =>
        currentId === projectId
          ? null
          : projectId
    );
  }

  return {
    projects,
    loading,
    search,
    statusFilter,
    typeFilter,
    sortOrder,
    expandedProjectId,
    projectTypes,
    stats,
    filteredProjects,
    filtersActive,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    setSortOrder,
    clearFilters,
    toggleProject,
  };
}