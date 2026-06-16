"use client";

import TrailerPreviewVideo from "@/app/components/TrailerPreviewVideo";
import { useEffect, useMemo, useState } from "react";

export default function BrowseHeroTrailer({
  trailerUrl,
}: {
  trailerUrl?: string | null;
}) {
  const [showVideo, setShowVideo] = useState(false);

  const previewSource = useMemo(() => {
    if (!trailerUrl) return "";
    if (!trailerUrl.includes("playlist.m3u8")) return "";
    return trailerUrl;
  }, [trailerUrl]);

  useEffect(() => {
    if (!previewSource) return;

    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [previewSource]);

  if (!previewSource || !showVideo) return null;

  return (
    <TrailerPreviewVideo
      url={previewSource}
      muted
      loop
      autoPlay
      className="absolute inset-0 h-full w-full object-cover opacity-35 transition-opacity duration-1000"
    />
  );
}