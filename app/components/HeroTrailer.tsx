"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

function getHlsUrl(url?: string | null) {
  if (!url) return "";

  if (url.includes("playlist.m3u8")) {
    return url;
  }

  const match = url.match(/embed\/(\d+)\/([a-zA-Z0-9-]+)/);
  if (!match) return "";

  const libraryId = match[1];
  const videoGuid = match[2];

  return `https://vz-${libraryId}.b-cdn.net/${videoGuid}/playlist.m3u8`;
}

export default function HeroTrailer({
  videoUrl,
  thumbnailUrl,
}: {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  const hlsUrl = getHlsUrl(videoUrl);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    let hls: Hls | null = null;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 15,
        enableWorker: true,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setReady(true);
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;

      video.addEventListener(
        "loadedmetadata",
        () => {
          setReady(true);
          video.play().catch(() => {});
        },
        { once: true }
      );
    }

    return () => {
      if (hls) hls.destroy();

      video.pause();
      video.removeAttribute("src");
      video.load();
      setReady(false);
    };
  }, [hlsUrl]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {thumbnailUrl && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.98), rgba(0,0,0,0.72), rgba(0,0,0,0.2)), url(${thumbnailUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {hlsUrl && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full scale-110 object-cover transition-opacity duration-1000 ${
            ready ? "opacity-35" : "opacity-0"
          }`}
        />
      )}

      {!thumbnailUrl && !hlsUrl && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(14,165,233,0.35),transparent_34%),linear-gradient(to_right,black,#020617)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
    </div>
  );
}