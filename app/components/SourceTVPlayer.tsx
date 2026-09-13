"use client";

import type HlsType from "hls.js";
import { useEffect, useRef, useState } from "react";
import MidRollAdGate from "./source-tv-player/MidRollAdGate";
import PlayerControls from "./source-tv-player/PlayerControls";
import { getHlsUrl } from "./source-tv-player/media";

const PROGRESS_SAVE_INTERVAL = 5000;

export default function SourceTVPlayer({
  url,
  poster,
  title,
  slug,
  type,
  projectId,
  autoPlay = false,
}: {
  url: string;
  poster?: string | null;
  title?: string;
  slug?: string;
  type?: string;
  projectId?: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const midRollPlayedRef = useRef(false);
  const lastProgressSaveRef = useRef(0);

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
  const [showingMidRoll, setShowingMidRoll] = useState(false);
  const [resumeAfterMidRoll, setResumeAfterMidRoll] = useState(false);

  const hlsUrl = getHlsUrl(url);

  function showControls() {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    setControlsVisible(true);

    if (!settingsOpen) {
      hideTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
        hideTimerRef.current = null;
      }, 2600);
    }
  }

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const nearBottom =
        event.clientY >= window.innerHeight - 230;

      if (nearBottom || settingsOpen) {
        showControls();
        return;
      }

      if (
        !settingsOpen &&
        hideTimerRef.current === null
      ) {
        setControlsVisible(false);
      }
    }

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, [settingsOpen]);

  useEffect(() => {
    function closeSettings(event: MouseEvent) {
      const target = event.target as Node;

      if (
        settingsRef.current &&
        !settingsRef.current.contains(target)
      ) {
        setSettingsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      closeSettings
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        closeSettings
      );
    };
  }, []);

  useEffect(() => {
    if (settingsOpen) {
      setControlsVisible(true);

      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    }
  }, [settingsOpen]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !hlsUrl) {
      return;
    }

    let cancelled = false;
    let hls: HlsType | null = null;
    let readyMarked = false;
    let playRequested = false;
    let sourceAssigned = false;

    const isHlsStream =
      hlsUrl.includes("playlist.m3u8") ||
      hlsUrl.endsWith(".m3u8");

    midRollPlayedRef.current = false;
    lastProgressSaveRef.current = 0;

    setShowingMidRoll(false);
    setResumeAfterMidRoll(false);
    setLoading(true);
    setStarted(false);
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    async function tryAutoplay() {
      if (!autoPlay || playRequested) {
        return;
      }

      playRequested = true;

      const currentVideo =
        videoRef.current;

      if (!currentVideo || cancelled) {
        return;
      }

      try {
        await currentVideo.play();

        if (cancelled) {
          return;
        }

        setPlaying(true);
        setStarted(true);
        setLoading(false);
      } catch {
        currentVideo.muted = true;
        setMuted(true);

        try {
          await currentVideo.play();

          if (cancelled) {
            return;
          }

          setPlaying(true);
          setStarted(true);
          setLoading(false);
        } catch {
          if (cancelled) {
            return;
          }

          setPlaying(false);
          setStarted(true);
          setLoading(false);
        }
      }
    }

    function markReady() {
      if (cancelled || readyMarked) {
        return;
      }

      readyMarked = true;

      setLoading(false);
      setStarted(true);

      const currentVideo =
        videoRef.current;

      setDuration(
        currentVideo?.duration || 0
      );

      void tryAutoplay();
    }

    function handleFatalLoadFailure(
      error?: unknown
    ) {
      if (
        cancelled ||
        !sourceAssigned
      ) {
        return;
      }

      console.error(
        "SOURCE TV VIDEO LOAD ERROR:",
        {
          error,
          source: hlsUrl,
          originalUrl: url,
        }
      );

      setLoading(false);
      setStarted(false);
      setPlaying(false);
    }

    video.pause();
    video.removeAttribute("src");
    video.load();
    video.muted = false;

    setMuted(false);

    video.addEventListener(
      "loadedmetadata",
      markReady
    );

    video.addEventListener(
      "loadeddata",
      markReady
    );

    video.addEventListener(
      "canplay",
      markReady
    );

    video.addEventListener(
      "playing",
      markReady
    );

    video.addEventListener(
      "error",
      handleFatalLoadFailure
    );

    async function setupPlayback() {
      const currentVideo =
        videoRef.current;

      if (!currentVideo || cancelled) {
        return;
      }

      if (
        isHlsStream &&
        currentVideo.canPlayType(
          "application/vnd.apple.mpegurl"
        )
      ) {
        sourceAssigned = true;
        currentVideo.src = hlsUrl;
        currentVideo.load();
        return;
      }

      if (isHlsStream) {
        try {
          const hlsModule =
            await import("hls.js");

          if (cancelled) {
            return;
          }

          const Hls =
            hlsModule.default;

          if (Hls.isSupported()) {
            const nextHls =
              new Hls({
                enableWorker: true,
                maxBufferLength: 20,
                backBufferLength: 10,
              });

            if (cancelled) {
              nextHls.destroy();
              return;
            }

            hls = nextHls;

            nextHls.attachMedia(
              currentVideo
            );

            nextHls.on(
              Hls.Events.MEDIA_ATTACHED,
              () => {
                if (
                  cancelled ||
                  hls !== nextHls
                ) {
                  return;
                }

                sourceAssigned = true;

                nextHls.loadSource(
                  hlsUrl
                );
              }
            );

            nextHls.on(
              Hls.Events.MANIFEST_PARSED,
              () => {
                markReady();
              }
            );

            nextHls.on(
              Hls.Events.ERROR,
              (_event, data) => {
                console.error(
                  "SOURCE TV HLS ERROR:",
                  data
                );

                if (data.fatal) {
                  handleFatalLoadFailure(
                    data
                  );
                }
              }
            );

            return;
          }
        } catch (error) {
          if (!cancelled) {
            console.error(
              "SOURCE TV HLS LOAD ERROR:",
              error
            );
          }
        }
      }

      if (cancelled) {
        return;
      }

      sourceAssigned = true;
      currentVideo.src = hlsUrl;
      currentVideo.load();
    }

    void setupPlayback();

    return () => {
      cancelled = true;

      video.removeEventListener(
        "loadedmetadata",
        markReady
      );

      video.removeEventListener(
        "loadeddata",
        markReady
      );

      video.removeEventListener(
        "canplay",
        markReady
      );

      video.removeEventListener(
        "playing",
        markReady
      );

      video.removeEventListener(
        "error",
        handleFatalLoadFailure
      );

      if (hls) {
        hls.destroy();
        hls = null;
      }
    };
  }, [hlsUrl, autoPlay, url]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !slug) {
      return;
    }

    try {
      const activeProfile =
        JSON.parse(
          localStorage.getItem(
            "sourcetv_active_profile"
          ) || '{"id":"main"}'
        );

      const storageKey =
        `sourcetv_continue_${activeProfile.id}`;

      const existing =
        JSON.parse(
          localStorage.getItem(
            storageKey
          ) || "[]"
        );

      const oldItem =
        existing.find(
          (item: {
            slug?: string;
            currentTime?: number;
            duration?: number;
            progress?: number;
          }) => item.slug === slug
        );

      if (!oldItem?.currentTime) {
        return;
      }

      const savedDuration =
        Number(
          oldItem.duration || 0
        );

      const savedCurrentTime =
        Number(
          oldItem.currentTime || 0
        );

      const savedProgress =
        Number(
          oldItem.progress || 0
        );

      const isBasicallyFinished =
        savedProgress >= 95 ||
        (savedDuration > 0 &&
          savedCurrentTime >=
            savedDuration - 10);

      if (isBasicallyFinished) {
        const filtered =
          existing.filter(
            (item: {
              slug?: string;
            }) =>
              item.slug !== slug
          );

        localStorage.setItem(
          storageKey,
          JSON.stringify(filtered)
        );

        video.currentTime = 0;
        setCurrentTime(0);
        setProgress(0);

        return;
      }

      video.currentTime =
        savedCurrentTime;

      setCurrentTime(
        savedCurrentTime
      );
    } catch (error) {
      console.error(
        "RESTORE CONTINUE WATCHING ERROR:",
        error
      );
    }
  }, [slug]);

  function triggerMidRollIfNeeded(
    video: HTMLVideoElement
  ) {
    if (
      midRollPlayedRef.current ||
      showingMidRoll ||
      !video.duration ||
      video.duration < 180 ||
      video.currentTime <
        video.duration * 0.5
    ) {
      return;
    }

    midRollPlayedRef.current = true;

    setResumeAfterMidRoll(
      !video.paused
    );

    video.pause();

    setPlaying(false);
    setSettingsOpen(false);
    setControlsVisible(false);
    setShowingMidRoll(true);
  }

  function updatePlayerProgress(
    video: HTMLVideoElement
  ) {
    if (!video.duration) {
      return;
    }

    const percent =
      (video.currentTime /
        video.duration) *
      100;

    setProgress(percent);

    setCurrentTime(
      video.currentTime
    );

    if (
      duration !==
      video.duration
    ) {
      setDuration(
        video.duration
      );
    }

    triggerMidRollIfNeeded(
      video
    );
  }

  function persistProgress(
    force = false
  ) {
    const video =
      videoRef.current;

    if (
      !video ||
      !video.duration ||
      !slug ||
      !title
    ) {
      return;
    }

    const now =
      Date.now();

    if (
      !force &&
      now -
        lastProgressSaveRef.current <
        PROGRESS_SAVE_INTERVAL
    ) {
      return;
    }

    lastProgressSaveRef.current =
      now;

    const percent =
      (video.currentTime /
        video.duration) *
      100;

    try {
      const activeProfile =
        JSON.parse(
          localStorage.getItem(
            "sourcetv_active_profile"
          ) || '{"id":"main"}'
        );

      const storageKey =
        `sourcetv_continue_${activeProfile.id}`;

      const existing =
        JSON.parse(
          localStorage.getItem(
            storageKey
          ) || "[]"
        );

      const filtered =
        existing.filter(
          (item: {
            slug?: string;
          }) =>
            item.slug !== slug
        );

      if (
        percent >= 95 ||
        video.currentTime >=
          video.duration - 10
      ) {
        localStorage.setItem(
          storageKey,
          JSON.stringify(filtered)
        );

        return;
      }

      const updated = [
        {
          title,
          slug,
          thumbnailUrl:
            poster || "",
          type: type || "",
          progress:
            Math.floor(
              percent
            ),
          currentTime:
            video.currentTime,
          duration:
            video.duration,
          watchedAt: now,
        },
        ...filtered,
      ].slice(0, 12);

      localStorage.setItem(
        storageKey,
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error(
        "SAVE CONTINUE WATCHING ERROR:",
        error
      );
    }
  }

  function handleTimeUpdate() {
    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    updatePlayerProgress(
      video
    );

    persistProgress(false);
  }

  async function finishMidRoll() {
    setShowingMidRoll(false);

    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    if (
      resumeAfterMidRoll
    ) {
      try {
        await video.play();

        setPlaying(true);
        setStarted(true);
        setLoading(false);
      } catch {
        setPlaying(false);
      }
    }
  }

  async function togglePlay() {
    const video =
      videoRef.current;

    if (
      !video ||
      showingMidRoll
    ) {
      return;
    }

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

      persistProgress(true);

      setPlaying(false);
    }
  }

  function seek(
    event: React.MouseEvent<HTMLDivElement>
  ) {
    const video =
      videoRef.current;

    if (
      !video ||
      !video.duration ||
      showingMidRoll
    ) {
      return;
    }

    showControls();

    const rect =
      event.currentTarget.getBoundingClientRect();

    const percent =
      Math.min(
        1,
        Math.max(
          0,
          (event.clientX -
            rect.left) /
            rect.width
        )
      );

    video.currentTime =
      percent *
      video.duration;

    updatePlayerProgress(
      video
    );

    persistProgress(true);
  }

  function skip(
    seconds: number
  ) {
    const video =
      videoRef.current;

    if (
      !video ||
      !video.duration ||
      showingMidRoll
    ) {
      return;
    }

    showControls();

    video.currentTime =
      Math.min(
        video.duration,
        Math.max(
          0,
          video.currentTime +
            seconds
        )
      );

    updatePlayerProgress(
      video
    );

    persistProgress(true);
  }

  function toggleMute() {
    const video =
      videoRef.current;

    if (
      !video ||
      showingMidRoll
    ) {
      return;
    }

    showControls();

    video.muted =
      !video.muted;

    setMuted(
      video.muted
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        onLoadedMetadata={() => {
          const video =
            videoRef.current;

          if (!video) {
            return;
          }

          setDuration(
            video.duration ||
              0
          );

          setMuted(
            video.muted
          );
        }}
        onTimeUpdate={
          handleTimeUpdate
        }
        onWaiting={() =>
          setLoading(true)
        }
        onCanPlay={() =>
          setLoading(false)
        }
        onPlay={() => {
          if (
            showingMidRoll
          ) {
            return;
          }

          setPlaying(true);
          setStarted(true);
          setLoading(false);
        }}
        onPause={() => {
          setPlaying(false);

          if (
            !showingMidRoll
          ) {
            persistProgress(
              true
            );
          }
        }}
        onEnded={() => {
          persistProgress(true);
          setPlaying(false);
        }}
        onClick={
          togglePlay
        }
        className={`h-full w-full bg-black object-contain transition-opacity duration-500 ${
          started ||
          !autoPlay
            ? "opacity-100"
            : "opacity-0"
        }`}
        playsInline
        autoPlay={autoPlay}
        poster={
          poster ||
          undefined
        }
      />

      {loading &&
        !showingMidRoll && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
              <div className="absolute inset-y-0 left-0 w-1/2 animate-[playerLoadSlide_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-white shadow-[0_0_22px_rgba(56,189,248,0.8)]" />
            </div>
          </div>
        )}

      {showingMidRoll && (
        <MidRollAdGate
          projectId={
            projectId
          }
          onFinished={
            finishMidRoll
          }
        />
      )}

      {!showingMidRoll && (
        <PlayerControls
          title={title}
          type={type}
          playing={playing}
          muted={muted}
          currentTime={
            currentTime
          }
          duration={
            duration
          }
          progress={
            progress
          }
          controlsVisible={
            controlsVisible
          }
          settingsOpen={
            settingsOpen
          }
          audioLanguage={
            audioLanguage
          }
          captions={
            captions
          }
          settingsRef={
            settingsRef
          }
          onTogglePlay={
            togglePlay
          }
          onSkip={skip}
          onToggleMute={
            toggleMute
          }
          onSeek={seek}
          onShowControls={
            showControls
          }
          onToggleSettings={() => {
            setSettingsOpen(
              (value) =>
                !value
            );

            showControls();
          }}
          onAudioLanguageChange={(
            language
          ) => {
            setAudioLanguage(
              language
            );

            showControls();
          }}
          onCaptionsChange={(
            option
          ) => {
            setCaptions(
              option
            );

            showControls();
          }}
        />
      )}

      <style jsx>{`
        @keyframes playerLoadSlide {
          0% {
            transform: translateX(
              -120%
            );
          }

          50% {
            transform: translateX(
              80%
            );
          }

          100% {
            transform: translateX(
              220%
            );
          }
        }

        @keyframes playerMenuIn {
          from {
            opacity: 0;
            transform: translateY(
                8px
              )
              scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(
                0
              )
              scale(1);
          }
        }
      `}</style>
    </div>
  );
}