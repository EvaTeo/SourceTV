"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  PartnerDashboardStats,
  PartnerProject,
} from "../types";
import { reviewStages } from "../utils";

export default function usePartnerDashboard() {
  const [projects, setProjects] = useState<PartnerProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/partner/projects", {
          cache: "no-store",
        });

        if (response.status === 401 || response.status === 403) {
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
          "PARTNER DASHBOARD LOAD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const stats = useMemo<PartnerDashboardStats>(() => {
    return {
      total: projects.length,

      inReview: projects.filter((project) =>
        reviewStages.includes(project.workflowStage)
      ).length,

      scheduled: projects.filter(
        (project) => project.workflowStage === "scheduled"
      ).length,

      published: projects.filter(
        (project) => project.workflowStage === "published"
      ).length,
    };
  }, [projects]);

  const recentProjects = projects.slice(0, 5);

  const attentionProjects = projects
    .filter(
      (project) =>
        project.rightsNotes ||
        project.contentNotes ||
        project.metadataNotes ||
        project.reviewNotes
    )
    .slice(0, 3);

  return {
    projects,
    loading,
    stats,
    recentProjects,
    attentionProjects,
  };
}