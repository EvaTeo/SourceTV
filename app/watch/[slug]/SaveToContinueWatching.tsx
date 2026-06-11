"use client";

import { useEffect } from "react";

export default function SaveToContinueWatching({
  slug,
}: {
  title: string;
  slug: string;
  thumbnailUrl: string;
  type: string;
  genre?: string | null;
  creatorName?: string | null;
}) {
  useEffect(() => {
    async function saveProgress() {
      try {
        await fetch("/api/continue-watching", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: slug,
            progress: Math.floor(Math.random() * 55) + 15,
            currentTime: 0,
            duration: 0,
          }),
        });
      } catch (error) {
        console.error("SAVE CONTINUE WATCHING ERROR:", error);
      }
    }

    saveProgress();
  }, [slug]);

  return null;
}