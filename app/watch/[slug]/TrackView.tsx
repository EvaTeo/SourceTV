"use client";

import { useEffect } from "react";

export default function TrackView({ projectId }: { projectId: string }) {
  useEffect(() => {
    console.log("Tracking view for:", projectId);

    fetch("/api/content/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: projectId }),
    })
      .then((res) => res.json())
      .then((data) => console.log("View tracked:", data))
      .catch((err) => console.error("View tracking failed:", err));
  }, [projectId]);

  return null;
}