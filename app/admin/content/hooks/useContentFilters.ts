"use client";

import {
  useMemo,
  useState,
} from "react";

import { filters } from "../constants";
import type { ContentItem } from "../types";

export default function useContentFilters(
  content: ContentItem[]
) {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState("all");

  const [
    activeType,
    setActiveType,
  ] = useState("all");

  const [
    showFilters,
    setShowFilters,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const contentTypes: string[] =
    useMemo(() => {
      const values =
        content.reduce<string[]>(
          (items, item) => {
            if (
              typeof item.type ===
                "string" &&
              item.type.trim()
            ) {
              items.push(
                item.type
              );
            }

            return items;
          },
          []
        );

      const uniqueValues =
        Array.from(
          new Set(values)
        ).sort();

      return [
        "all",
        ...uniqueValues,
      ];
    }, [content]);

  const filteredContent =
    useMemo(() => {
      return content.filter(
        (item) => {
          const cleanSearch =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !cleanSearch ||
            item.title
              ?.toLowerCase()
              .includes(
                cleanSearch
              ) ||
            item.description
              ?.toLowerCase()
              .includes(
                cleanSearch
              ) ||
            item.creatorName
              ?.toLowerCase()
              .includes(
                cleanSearch
              ) ||
            item.creatorEmail
              ?.toLowerCase()
              .includes(
                cleanSearch
              ) ||
            item.creatorCompany
              ?.toLowerCase()
              .includes(
                cleanSearch
              ) ||
            item.genre
              ?.toLowerCase()
              .includes(
                cleanSearch
              ) ||
            item.type
              ?.toLowerCase()
              .includes(
                cleanSearch
              ) ||
            item.recognitionLevel
              ?.toLowerCase()
              .includes(
                cleanSearch
              );

          const matchesFilter =
            activeFilter ===
            "all"
              ? true
              : activeFilter ===
                  "featured"
                ? Boolean(
                    item.featured
                  )
                : item.workflowStage ===
                  activeFilter;

          const matchesType =
            activeType ===
            "all"
              ? true
              : (
                  item.type ||
                  ""
                ).toLowerCase() ===
                activeType.toLowerCase();

          return (
            matchesSearch &&
            matchesFilter &&
            matchesType
          );
        }
      );
    }, [
      content,
      search,
      activeFilter,
      activeType,
    ]);

  const counts =
    useMemo(() => {
      const map: Record<
        string,
        number
      > = {
        all:
          content.length,

        featured:
          content.filter(
            (item) =>
              item.featured
          ).length,
      };

      filters.forEach(
        (filter) => {
          if (
            filter.value !==
              "all" &&
            filter.value !==
              "featured"
          ) {
            map[
              filter.value
            ] =
              content.filter(
                (item) =>
                  item.workflowStage ===
                  filter.value
              ).length;
          }
        }
      );

      return map;
    }, [content]);

  const stats =
    useMemo(() => {
      const inReview =
        content.filter(
          (item) =>
            [
              "submission",
              "metadata_review",
              "content_review",
              "rights_review",
            ].includes(
              item.workflowStage
            )
        ).length;

      return [
        {
          label:
            "Total Titles",

          value:
            content.length,
        },

        {
          label:
            "Published",

          value:
            content.filter(
              (item) =>
                item.workflowStage ===
                "published"
            ).length,
        },

        {
          label:
            "In Review",

          value:
            inReview,
        },

        {
          label:
            "Featured",

          value:
            content.filter(
              (item) =>
                item.featured
            ).length,
        },
      ];
    }, [content]);

  return {
    search,
    activeFilter,
    activeType,
    showFilters,

    setSearch,
    setActiveFilter,
    setActiveType,
    setShowFilters,

    contentTypes,
    filteredContent,
    counts,
    stats,
  };
}