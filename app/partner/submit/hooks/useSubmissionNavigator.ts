"use client";

import {
  useEffect,
  useState,
} from "react";

import { SUBMISSION_SECTIONS } from "../constants";

import type {
  SubmissionSectionId,
} from "../types";

export default function useSubmissionNavigator(
  disabled: boolean
) {
  const [activeSection, setActiveSection] =
    useState<SubmissionSectionId>(
      "project-details"
    );

  useEffect(() => {
    if (disabled) {
      return;
    }

    const elements = SUBMISSION_SECTIONS.map(
      (section) =>
        document.getElementById(section.id)
    ).filter(
      (element): element is HTMLElement =>
        Boolean(element)
    );

    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        const mostVisible = visibleEntries[0];

        if (mostVisible) {
          setActiveSection(
            mostVisible.target
              .id as SubmissionSectionId
          );
        }
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0.08, 0.2, 0.4, 0.65],
      }
    );

    elements.forEach((element) =>
      observer.observe(element)
    );

    return () => observer.disconnect();
  }, [disabled]);

  function selectSection(
    sectionId: SubmissionSectionId
  ) {
    setActiveSection(sectionId);

    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return {
    activeSection,
    selectSection,
  };
}