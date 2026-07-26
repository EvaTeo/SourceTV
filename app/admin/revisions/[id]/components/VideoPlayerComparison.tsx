"use client";

import { useState } from "react";

type VideoPlayerComparisonProps = {
  title: string;
  live: string | null;
  proposed: string | null;
};

type VideoPreviewCardProps = {
  label: string;
  videoUrl: string | null;
  changed?: boolean;
};

function isDirectVideoUrl(url: string) {
  const cleanUrl = url.toLowerCase().split("?")[0];

  return (
    cleanUrl.endsWith(".mp4") ||
    cleanUrl.endsWith(".webm") ||
    cleanUrl.endsWith(".ogg") ||
    cleanUrl.endsWith(".mov") ||
    cleanUrl.endsWith(".m3u8")
  );
}

function getBunnyEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("iframe.mediadelivery.net")) {
      return url;
    }

    if (parsedUrl.hostname.includes("video.bunnycdn.com")) {
      const pathParts = parsedUrl.pathname
        .split("/")
        .filter(Boolean);

      const libraryId = pathParts[0];
      const videoId = pathParts[1];

      if (libraryId && videoId) {
        return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}

function VideoPreviewCard({
  label,
  videoUrl,
  changed = false,
}: VideoPreviewCardProps) {
  const [playerError, setPlayerError] = useState(false);

  return (
    <article
      className={
        changed
          ? "overflow-hidden rounded-2xl border border-sky-300/25 bg-sky-300/[0.05]"
          : "overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
      }
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <p
          className={
            changed
              ? "text-xs font-black uppercase tracking-[0.15em] text-sky-200"
              : "text-xs font-black uppercase tracking-[0.15em] text-white/40"
          }
        >
          {label}
        </p>

        {videoUrl && (
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
            Video Attached
          </span>
        )}
      </div>

      <div className="relative aspect-video bg-black">
        {!videoUrl ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-white/25">
                ▶
              </div>

              <p className="mt-4 text-sm font-bold text-white/35">
                No video available
              </p>
            </div>
          </div>
        ) : playerError ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <p className="text-sm font-bold text-red-200">
                The video preview could not be loaded.
              </p>

              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
              >
                Open Video
              </a>
            </div>
          </div>
        ) : isDirectVideoUrl(videoUrl) ? (
          <video
            controls
            preload="metadata"
            playsInline
            className="h-full w-full bg-black object-contain"
            onError={() => setPlayerError(true)}
          >
            <source src={videoUrl} />

            Your browser does not support video playback.
          </video>
        ) : (
          <iframe
            src={getBunnyEmbedUrl(videoUrl)}
            title={`${label} video preview`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
            onError={() => setPlayerError(true)}
          />
        )}
      </div>

      {videoUrl && (
        <div className="border-t border-white/10 px-5 py-4">
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-black uppercase tracking-[0.12em] text-sky-300 transition hover:text-sky-200"
          >
            Open source video ↗
          </a>
        </div>
      )}
    </article>
  );
}

export default function VideoPlayerComparison({
  title,
  live,
  proposed,
}: VideoPlayerComparisonProps) {
  const changed = live !== proposed;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-black text-white">
          {title}
        </h3>

        {changed ? (
          <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-sky-200">
            Updated
          </span>
        ) : (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/35">
            Unchanged
          </span>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <VideoPreviewCard
          label="Live Project"
          videoUrl={live}
        />

        <VideoPreviewCard
          label="Proposed Revision"
          videoUrl={proposed}
          changed={changed}
        />
      </div>
    </div>
  );
}