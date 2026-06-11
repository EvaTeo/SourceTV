"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

function getHlsUrl(url?: string | null) {
  if (!url) return "";

  const match = url.match(/embed\/(\d+)\/([a-zA-Z0-9-]+)/);
  if (!match) return "";

  const videoGuid = match[2];

  return `https://vz-ea77d4fd-c11.b-cdn.net/${videoGuid}/playlist.m3u8`;
}

export default function BrowseHeroTrailer({
  trailerUrl,
}: {
  trailerUrl?: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const hlsUrl = getHlsUrl(trailerUrl);

  useEffect(() => {
    if (!hlsUrl) return;

    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [hlsUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl || !showVideo) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.play().catch(() => {});
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 15,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setReady(true);
        video.play().catch(() => {});
      });

      return () => hls.destroy();
    }
  }, [hlsUrl, showVideo]);

  if (!hlsUrl || !showVideo) return null;

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        ready ? "opacity-35" : "opacity-0"
      }`}
    />
  );
}