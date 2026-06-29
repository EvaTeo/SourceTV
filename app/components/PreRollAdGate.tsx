"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

type ActiveAd = {
  id: string;
  name: string;
  placement: string;
  videoUrl?: string | null;
  clickUrl?: string | null;
  skipAfterSeconds?: number | null;
};

function getHlsUrl(url?: string | null) {
  if (!url) return "";
  if (url.includes("playlist.m3u8")) return url;

  const match = url.match(/(?:embed|play)\/(\d+)\/([a-zA-Z0-9-]+)/);
  if (!match) return url;

  const libraryId = match[1];
  const videoGuid = match[2];

  return `https://vz-${libraryId}.b-cdn.net/${videoGuid}/playlist.m3u8`;
}

export default function PreRollAdGate({
  projectId,
  onFinished,
}: {
  projectId?: string;
  onFinished: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackedRef = useRef(false);

  const [ad, setAd] = useState<ActiveAd | null>(null);
  const [loading, setLoading] = useState(true);
  const [secondsWatched, setSecondsWatched] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  async function trackAd({
    completed,
    skipped,
    clicked = false,
  }: {
    completed: boolean;
    skipped: boolean;
    clicked?: boolean;
  }) {
    if (!ad || trackedRef.current) return;

    trackedRef.current = true;

    try {
      await fetch("/api/ads/impression", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId: ad.id,
          projectId: projectId || "",
          placement: ad.placement || "pre_roll",
          completed,
          skipped,
          clicked,
          watchedSeconds: secondsWatched,
        }),
      });
    } catch (error) {
      console.error("TRACK AD ERROR:", error);
    }
  }

  async function finishAd(completed: boolean, skipped: boolean) {
  const video = videoRef.current;

  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  await trackAd({ completed, skipped });

  setTimeout(() => {
  onFinished();
}, 75);
}

  async function clickAd() {
    if (!ad?.clickUrl) return;

    await trackAd({
      completed: false,
      skipped: false,
      clicked: true,
    });

    window.open(ad.clickUrl, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    let cancelled = false;

    async function loadAd() {
      try {
        const res = await fetch("/api/ads/active", {
          cache: "no-store",
        });

        const data = await res.json();

        if (cancelled) return;

        if (!data?.id || !data?.videoUrl) {
          onFinished();
          return;
        }

        setAd(data);
      } catch (error) {
        console.error("LOAD PREROLL AD ERROR:", error);
        onFinished();
      }
    }

    loadAd();

    return () => {
      cancelled = true;
    };
  }, [onFinished]);

  useEffect(() => {
    if (!ad?.videoUrl) return;

    const video = videoRef.current;
    if (!video) return;

    const hlsUrl = getHlsUrl(ad.videoUrl);

    if (!hlsUrl) {
      onFinished();
      return;
    }

    let cancelled = false;
    let hls: Hls | null = null;

    const failTimer = setTimeout(() => {
      if (cancelled) return;
      finishAd(false, true);
    }, 9000);

    async function tryPlay() {
      if (cancelled) return;

      const currentVideo = videoRef.current;
      if (!currentVideo) return;

      try {
        await currentVideo.play();
        setLoading(false);
      } catch {
        currentVideo.muted = true;

        try {
          await currentVideo.play();
          setLoading(false);
        } catch {
          finishAd(false, true);
        }
      }
    }

    video.pause();
    video.removeAttribute("src");
    video.load();
    video.muted = false;
    video.playsInline = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.load();

      video.addEventListener("canplay", tryPlay);
      video.addEventListener("loadedmetadata", tryPlay);

      return () => {
        cancelled = true;
        clearTimeout(failTimer);
        video.removeEventListener("canplay", tryPlay);
        video.removeEventListener("loadedmetadata", tryPlay);
      };
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        maxBufferLength: 12,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          finishAd(false, true);
        }
      });
    } else {
      onFinished();
    }

    return () => {
      cancelled = true;
      clearTimeout(failTimer);

      if (hls) {
        hls.destroy();
      }
    };
  }, [ad]);

  if (!ad) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-black">
        <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 w-1/2 animate-[playerLoadSlide_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-white shadow-[0_0_22px_rgba(56,189,248,0.8)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        onTimeUpdate={() => {
          const video = videoRef.current;
          if (!video) return;

          const watched = Math.floor(video.currentTime);
          setSecondsWatched(watched);

          if (watched >= (ad.skipAfterSeconds ?? 5)) {
            setCanSkip(true);
          }
        }}
        onEnded={() => finishAd(true, false)}
        onClick={clickAd}
        className="h-full w-full bg-black object-contain"
        playsInline
      />

      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/75 backdrop-blur-xl md:left-7 md:top-6">
        Advertisement
      </div>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
            <div className="absolute inset-y-0 left-0 w-1/2 animate-[playerLoadSlide_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-white shadow-[0_0_22px_rgba(56,189,248,0.8)]" />
          </div>
        </div>
      )}

      {ad.clickUrl && (
        <button
          type="button"
          onClick={clickAd}
          className="absolute bottom-8 left-4 z-20 rounded-full border border-sky-300/35 bg-sky-300/10 px-4 py-2 text-xs font-black text-sky-100 backdrop-blur-xl transition hover:bg-sky-300 hover:text-black md:left-10"
        >
          Learn More
        </button>
      )}

      <button
        type="button"
        disabled={!canSkip}
        onClick={() => finishAd(false, true)}
        className="absolute bottom-8 right-4 z-20 rounded-full border border-white/15 bg-black/65 px-5 py-2.5 text-xs font-black text-white/80 backdrop-blur-xl transition hover:border-sky-300/40 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-45 md:right-10"
      >
        {canSkip
          ? "Skip Ad"
          : `Skip in ${Math.max(0, (ad.skipAfterSeconds ?? 5) - secondsWatched)}`}
      </button>

      <style jsx>{`
        @keyframes playerLoadSlide {
          0% {
            transform: translateX(-120%);
          }

          50% {
            transform: translateX(80%);
          }

          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
    </div>
  );
}