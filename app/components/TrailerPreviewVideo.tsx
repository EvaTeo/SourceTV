"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

type Props = {
  url?: string | null;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  fadeIn?: boolean;
};

function getHlsUrl(url?: string | null) {
  if (!url) return "";
  if (url.includes("playlist.m3u8")) return url;

  const match = url.match(/embed\/(\d+)\/([a-zA-Z0-9-]+)/);
  if (!match) return "";

  const libraryId = match[1];
  const videoGuid = match[2];

  return `https://vz-${libraryId}.b-cdn.net/${videoGuid}/playlist.m3u8`;
}

export default function TrailerPreviewVideo({
  url,
  className = "",
  muted = true,
  loop = true,
  autoPlay = true,
  fadeIn = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const readyRef = useRef(false);

  const [ready, setReady] = useState(!fadeIn);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video = videoRef.current;
    const hlsUrl = getHlsUrl(url);

    readyRef.current = false;
    setReady(!fadeIn);

    if (!video || !hlsUrl) return;

    let cancelled = false;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.pause();
    video.removeAttribute("src");
    video.load();

    video.muted = muted;
    video.loop = loop;
    video.playsInline = true;

    async function revealAndPlay() {
      if (cancelled || readyRef.current) return;

      readyRef.current = true;
      setReady(true);

      if (!autoPlay) return;

      const currentVideo = videoRef.current;

      if (!currentVideo) return;

      try {
        await currentVideo.play();
      } catch {
        // Browser may block autoplay.
      }
    }

    function handleCanPlay() {
      revealAndPlay();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: 8,
        backBufferLength: 0,
      });

      hlsRef.current = hls;

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (video.readyState >= 2) {
          revealAndPlay();
        }
      });

      video.addEventListener("canplay", handleCanPlay);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.addEventListener("canplay", handleCanPlay);
      video.load();
    }

    return () => {
      cancelled = true;

      video.removeEventListener("canplay", handleCanPlay);
      video.pause();
      video.removeAttribute("src");
      video.load();

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, loop, autoPlay, fadeIn, muted]);

  if (!url) return null;

  return (
    <video
      ref={videoRef}
      muted={muted}
      loop={loop}
      playsInline
      preload="auto"
      className={`${className} transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}