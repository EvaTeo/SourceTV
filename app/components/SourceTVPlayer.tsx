"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

function getHlsUrl(url?: string | null) {
  if (!url) return "";

  const match = url.match(/embed\/(\d+)\/([a-zA-Z0-9-]+)/);
  if (!match) return url;

  const videoGuid = match[2];

  return `https://vz-ea77d4fd-c11.b-cdn.net/${videoGuid}/playlist.m3u8`;
}

export default function SourceTVPlayer({
  url,
  poster,
  title,
  slug,
  type,
}: {
  url: string;
  poster?: string | null;
  title?: string;
  slug?: string;
  type?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const hlsUrl = getHlsUrl(url);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      setLoading(false);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
      });

      return () => hls.destroy();
    }
  }, [hlsUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !slug) return;

    const activeProfile = JSON.parse(
      localStorage.getItem("sourcetv_active_profile") || '{"id":"main"}'
    );

    const storageKey = `sourcetv_continue_${activeProfile.id}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const oldItem = existing.find((item: any) => item.slug === slug);

    if (oldItem?.currentTime) {
      video.currentTime = oldItem.currentTime;
    }
  }, [slug]);

  function saveProgress() {
    const video = videoRef.current;
    if (!video || !video.duration || !slug || !title) return;

    const percent = Math.floor((video.currentTime / video.duration) * 100);
    setProgress(percent);

    const activeProfile = JSON.parse(
      localStorage.getItem("sourcetv_active_profile") || '{"id":"main"}'
    );

    const storageKey = `sourcetv_continue_${activeProfile.id}`;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");

    const filtered = existing.filter((item: any) => item.slug !== slug);

    const updated = [
      {
        title,
        slug,
        thumbnailUrl: poster || "",
        type: type || "",
        progress: percent,
        currentTime: video.currentTime,
        duration: video.duration,
        watchedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, 12);

    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;

    video.currentTime = percent * video.duration;
    saveProgress();
  }

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-[2rem] border border-sky-300/20 bg-black shadow-[0_0_55px_rgba(14,165,233,0.25)]">
      <video
        ref={videoRef}
        poster={poster || undefined}
        onTimeUpdate={saveProgress}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
        className="h-full w-full bg-black object-contain"
        playsInline
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-sky-400" />
          </div>
        </div>
      )}

      {!playing && !loading && (
        <button
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sky-400 text-3xl font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.65)] transition hover:scale-105"
        >
          ▶
        </button>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-6 pb-5 pt-14 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
        <div
          onClick={seek}
          className="h-2 cursor-pointer overflow-hidden rounded-full bg-white/15"
        >
          <div
            className="h-full rounded-full bg-sky-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}