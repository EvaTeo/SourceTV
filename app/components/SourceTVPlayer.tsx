"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

function getHlsUrl(url?: string | null) {
  if (!url) return "";
  if (url.includes("playlist.m3u8")) return url;

  const match = url.match(/(?:embed|play)\/(\d+)\/([a-zA-Z0-9-]+)/);
  if (!match) return url;

  const videoGuid = match[2];

  return `https://vz-ea77d4fd-c11.b-cdn.net/${videoGuid}/playlist.m3u8`;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";

  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M8 5.8v12.4c0 .9 1 1.4 1.7.9l9.5-6.2c.7-.4.7-1.4 0-1.8L9.7 4.9C9 4.4 8 4.9 8 5.8z" />
    </svg>
  );
}

function RewindIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.2]"
    >
      <path d="M7.5 8H4V4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.4 8A8 8 0 1 1 4 16" strokeLinecap="round" />
      <text
        x="9"
        y="15.5"
        fill="currentColor"
        stroke="none"
        fontSize="6"
        fontWeight="900"
      >
        10
      </text>
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.2]"
    >
      <path d="M16.5 8H20V4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.6 8A8 8 0 1 0 20 16" strokeLinecap="round" />
      <text
        x="9"
        y="15.5"
        fill="currentColor"
        stroke="none"
        fontSize="6"
        fontWeight="900"
      >
        10
      </text>
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.25]"
    >
      <path
        d="M4.5 9.5v5h3.1L12 18V6L7.6 9.5H4.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {muted ? (
        <>
          <path d="M16 9l4 4" strokeLinecap="round" />
          <path d="M20 9l-4 4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path
            d="M16 9.5c.8.7 1.2 1.6 1.2 2.5s-.4 1.8-1.2 2.5"
            strokeLinecap="round"
          />
          <path
  d="M18.5 7.2c1.4 1.2 2.2 2.9 2.2 4.8s-.8 3.6-2.2 4.8"
  strokeLinecap="round"
/>
        </>
      )}
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.2]"
    >
      <path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z" />
      <path
        d="M19.4 13.4c.1-.5.1-.9.1-1.4s0-.9-.1-1.4l2-1.5-2-3.4-2.4 1a8 8 0 0 0-2.4-1.4L14.3 2h-4.6l-.4 3.3A8 8 0 0 0 7 6.7l-2.4-1-2 3.4 2 1.5c-.1.5-.1.9-.1 1.4s0 .9.1 1.4l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 2.3 1.4l.4 3.3h4.6l.4-3.3a8 8 0 0 0 2.3-1.4l2.4 1 2-3.4-2-1.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SourceTVPlayer({
  url,
  poster,
  title,
  slug,
  type,
  autoPlay = false,
}: {
  url: string;
  poster?: string | null;
  title?: string;
  slug?: string;
  type?: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState("English");
  const [captions, setCaptions] = useState("Off");

  const hlsUrl = getHlsUrl(url);

  function showControls() {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    setControlsVisible(true);

    if (!settingsOpen) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 2600);
    }
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const nearBottom = event.clientY >= window.innerHeight - 230;

      if (nearBottom || settingsOpen) {
        showControls();
        return;
      }

      if (!settingsOpen && hideTimerRef.current === null) {
        setControlsVisible(false);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [settingsOpen]);

  useEffect(() => {
    function closeSettings(event: MouseEvent) {
      const target = event.target as Node;

      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setSettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeSettings);

    return () => {
      document.removeEventListener("mousedown", closeSettings);
    };
  }, []);

  useEffect(() => {
    if (settingsOpen) {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [settingsOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl) return;

    let cancelled = false;
    let hls: Hls | null = null;

    setLoading(true);
    setStarted(false);
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    const readyTimeout = setTimeout(() => {
      if (cancelled) return;
      setLoading(false);
      setStarted(true);
    }, 7000);

    async function tryAutoplay() {
      if (!autoPlay) return;

      const currentVideo = videoRef.current;
      if (!currentVideo || cancelled) return;

      try {
        await currentVideo.play();
        setPlaying(true);
        setStarted(true);
        setLoading(false);
      } catch {
        currentVideo.muted = true;
        setMuted(true);

        try {
          await currentVideo.play();
          setPlaying(true);
          setStarted(true);
          setLoading(false);
        } catch {
          setPlaying(false);
          setStarted(true);
          setLoading(false);
        }
      }
    }

    function markReady() {
      if (cancelled) return;

      clearTimeout(readyTimeout);
      setLoading(false);
      setStarted(true);
const currentVideo = videoRef.current;
setDuration(currentVideo?.duration || 0);
      tryAutoplay();
    }

    video.pause();
    video.removeAttribute("src");
    video.load();

    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("canplaythrough", markReady);
    video.addEventListener("playing", markReady);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
      video.load();
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        maxBufferLength: 20,
        backBufferLength: 10,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, markReady);
      hls.on(Hls.Events.LEVEL_LOADED, markReady);
      hls.on(Hls.Events.BUFFER_APPENDED, markReady);

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error("SOURCE TV HLS ERROR:", data);

        if (data.fatal) {
          clearTimeout(readyTimeout);
          setLoading(false);
          setStarted(true);
        }
      });
    } else {
      clearTimeout(readyTimeout);
      setLoading(false);
      setStarted(true);
    }

    return () => {
      cancelled = true;
      clearTimeout(readyTimeout);

      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("canplaythrough", markReady);
      video.removeEventListener("playing", markReady);

      if (hls) {
        hls.destroy();
      }
    };
  }, [hlsUrl, autoPlay]);

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
      setCurrentTime(oldItem.currentTime);
    }
  }, [slug]);

  function saveProgress() {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const percent = (video.currentTime / video.duration) * 100;

    setProgress(percent);
    setCurrentTime(video.currentTime);
    setDuration(video.duration);

    if (!slug || !title) return;

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
        progress: Math.floor(percent),
        currentTime: video.currentTime,
        duration: video.duration,
        watchedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, 12);

    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    showControls();

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
        setStarted(true);
      } catch {
        setPlaying(false);
      }
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function seek(event: React.MouseEvent<HTMLDivElement>) {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    showControls();

    const rect = event.currentTarget.getBoundingClientRect();
    const percent = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width)
    );

    video.currentTime = percent * video.duration;
    saveProgress();
  }

  function skip(seconds: number) {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    showControls();

    video.currentTime = Math.min(
      video.duration,
      Math.max(0, video.currentTime + seconds)
    );

    saveProgress();
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    showControls();

    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (!video) return;

          setDuration(video.duration || 0);
          setMuted(video.muted);
        }}
        onTimeUpdate={saveProgress}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
          setLoading(false);
        }}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
        className={`h-full w-full bg-black object-contain transition-opacity duration-500 ${
          started || !autoPlay ? "opacity-100" : "opacity-0"
        }`}
        playsInline
        autoPlay={autoPlay}
        poster={poster || undefined}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
            <div className="absolute inset-y-0 left-0 w-1/2 animate-[playerLoadSlide_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-white shadow-[0_0_22px_rgba(56,189,248,0.8)]" />
          </div>
        </div>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/88 via-black/42 to-transparent px-4 pb-5 pt-32 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-10 md:pb-8 ${
          controlsVisible || settingsOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-20 opacity-0"
        }`}
      >
        <div className="mb-5 flex items-end justify-between gap-6">
          <div className="min-w-0">
            <p className="line-clamp-1 text-base font-black tracking-tight text-white md:text-xl">
              {title || "SourceTV"}
            </p>

            <p className="mt-1 line-clamp-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/42 md:text-xs">
              {type ? `${type}` : "Now Playing"}
            </p>
          </div>

          <div className="hidden shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-bold text-white/58 backdrop-blur-xl md:block">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div
          onClick={seek}
          onMouseMove={showControls}
          className="group/progress relative h-[3px] cursor-pointer overflow-visible rounded-full bg-white/12 transition-all duration-300 hover:h-[8px]"
        >
          <div
            className="relative h-full rounded-full bg-gradient-to-r from-sky-700 via-sky-300 to-white shadow-[0_0_24px_rgba(56,189,248,0.8)] transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          >
            <span className="absolute inset-y-0 right-0 w-16 translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-white/85 to-transparent opacity-90 blur-[2px]" />

            <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-white opacity-0 shadow-[0_0_22px_rgba(255,255,255,0.95)] transition group-hover/progress:opacity-100" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 md:gap-3">
            <button
              onClick={togglePlay}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:bg-sky-200"
              aria-label={playing ? "Pause" : "Play"}
            >
              <PlayPauseIcon playing={playing} />
            </button>

            <button
              onClick={() => skip(-10)}
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] text-white/85 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:flex"
              aria-label="Rewind 10 seconds"
            >
              <RewindIcon />
            </button>

            <button
              onClick={() => skip(10)}
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] text-white/85 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:flex"
              aria-label="Forward 10 seconds"
            >
              <ForwardIcon />
            </button>

            <button
              onClick={toggleMute}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] text-white/85 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              <VolumeIcon muted={muted} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="block shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-bold text-white/58 backdrop-blur-xl md:hidden">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div ref={settingsRef} className="relative">
              <button
                onClick={() => {
                  setSettingsOpen((value) => !value);
                  showControls();
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] text-white/85 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100"
                aria-label="Audio and accessibility settings"
              >
                <SettingsIcon />
              </button>

              {settingsOpen && (
                <div className="absolute bottom-full right-0 mb-4 w-80 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/88 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-[playerMenuIn_180ms_ease-out]">
                  <div className="mb-5">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                      Audio Language
                    </p>

                    <div className="grid gap-1">
                      {["English", "Spanish", "Original"].map((language) => (
                        <button
                          key={language}
                          onClick={() => {
                            setAudioLanguage(language);
                            showControls();
                          }}
                          className={`rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                            audioLanguage === language
                              ? "bg-sky-400 text-black shadow-[0_0_22px_rgba(56,189,248,0.28)]"
                              : "text-white/70 hover:bg-white/[0.07] hover:text-white"
                          }`}
                        >
                          {language}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                      Accessibility
                    </p>

                    <div className="grid gap-1">
                      {[
                        "Off",
                        "English CC",
                        "Spanish CC",
                        "Audio Description",
                      ].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setCaptions(option);
                            showControls();
                          }}
                          className={`rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                            captions === option
                              ? "bg-sky-400 text-black shadow-[0_0_22px_rgba(56,189,248,0.28)]"
                              : "text-white/70 hover:bg-white/[0.07] hover:text-white"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

        @keyframes playerMenuIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}