"use client";

import type HlsType from "hls.js";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getHlsUrl } from "./media";

type ActiveAd = {
  id: string;
  name: string;
  adSource?: string | null;
  adType?: string | null;
  placement: string;
  videoUrl?: string | null;
  vastTagUrl?: string | null;
  clickUrl?: string | null;
  skipAfterSeconds?: number | null;
  canSkip?: boolean;
  isHouseAd?: boolean;
  isGoogleAd?: boolean;
};

function getAdLabel(ad: ActiveAd) {
  if (
    ad.isHouseAd ||
    ad.adType === "house"
  ) {
    return "SourceTV";
  }

  if (ad.adType === "sponsor") {
    return "Sponsored";
  }

  return "Advertisement";
}

export default function MidRollAdGate({
  projectId,
  onFinished,
}: {
  projectId?: string;
  onFinished: () => void;
}) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const hlsRef =
    useRef<HlsType | null>(null);

  const trackedRef =
    useRef(false);

  const finishedRef =
    useRef(false);

  const secondsWatchedRef =
    useRef(0);

  const onFinishedRef =
    useRef(onFinished);

  const [ad, setAd] =
    useState<ActiveAd | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    secondsWatched,
    setSecondsWatched,
  ] = useState(0);

  const [skipReady, setSkipReady] =
    useState(false);

  useEffect(() => {
    onFinishedRef.current =
      onFinished;
  }, [onFinished]);

  const cleanupVideo =
    useCallback(() => {
      const video =
        videoRef.current;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (video) {
        video.pause();
        video.removeAttribute(
          "src"
        );
        video.load();
      }
    }, []);

  const trackAd = useCallback(
    async ({
      completed,
      skipped,
      clicked = false,
      watchedSecondsOverride,
    }: {
      completed: boolean;
      skipped: boolean;
      clicked?: boolean;
      watchedSecondsOverride?: number;
    }) => {
      if (
        !ad ||
        trackedRef.current
      ) {
        return;
      }

      trackedRef.current = true;

      try {
        await fetch(
          "/api/ads/impression",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              campaignId: ad.id,
              projectId:
                projectId || "",
              placement:
                ad.placement ||
                "mid_roll",
              completed,
              skipped,
              clicked,
              watchedSeconds:
                watchedSecondsOverride ??
                secondsWatchedRef.current,
            }),
          }
        );
      } catch (error) {
        console.error(
          "TRACK MIDROLL AD ERROR:",
          error
        );
      }
    },
    [ad, projectId]
  );

  const finishAd = useCallback(
    (
      completed: boolean,
      skipped: boolean
    ) => {
      if (finishedRef.current) {
        return;
      }

      finishedRef.current = true;

      const watched =
        Math.floor(
          videoRef.current
            ?.currentTime ||
            secondsWatchedRef.current
        );

      cleanupVideo();

      void trackAd({
        completed,
        skipped,
        watchedSecondsOverride:
          watched,
      });

      onFinishedRef.current();
    },
    [
      cleanupVideo,
      trackAd,
    ]
  );

  const clickAd =
    useCallback(() => {
      if (!ad?.clickUrl) {
        return;
      }

      window.open(
        ad.clickUrl,
        "_blank",
        "noopener,noreferrer"
      );

      void trackAd({
        completed: false,
        skipped: false,
        clicked: true,
      });
    }, [ad, trackAd]);

  useEffect(() => {
    let cancelled = false;

    async function loadAd() {
      try {
        setLoading(true);

        const params =
          new URLSearchParams({
            placement: "mid_roll",
          });

        if (projectId) {
          params.set(
            "projectId",
            projectId
          );
        }

        const response =
          await fetch(
            `/api/ads/active?${params.toString()}`,
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          if (
            !cancelled &&
            !finishedRef.current
          ) {
            finishedRef.current =
              true;

            onFinishedRef.current();
          }

          return;
        }

        const data =
          (await response.json()) as
            | ActiveAd
            | null;

        if (cancelled) {
          return;
        }

        if (!data?.id) {
          if (
            !finishedRef.current
          ) {
            finishedRef.current =
              true;

            onFinishedRef.current();
          }

          return;
        }

        const creativeUrl =
          data.adSource ===
          "google"
            ? data.vastTagUrl
            : data.videoUrl;

        if (!creativeUrl) {
          if (
            !finishedRef.current
          ) {
            finishedRef.current =
              true;

            onFinishedRef.current();
          }

          return;
        }

        trackedRef.current =
          false;

        finishedRef.current =
          false;

        secondsWatchedRef.current =
          0;

        setSecondsWatched(0);
        setSkipReady(false);
        setAd(data);
      } catch (error) {
        console.error(
          "LOAD MIDROLL AD ERROR:",
          error
        );

        if (
          !cancelled &&
          !finishedRef.current
        ) {
          finishedRef.current =
            true;

          onFinishedRef.current();
        }
      }
    }

    void loadAd();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  useEffect(() => {
    const creativeUrl =
      ad?.adSource === "google"
        ? ad?.vastTagUrl
        : ad?.videoUrl;

    if (!ad || !creativeUrl) {
      return;
    }

    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    const hlsUrl =
      getHlsUrl(creativeUrl);

    if (!hlsUrl) {
      onFinishedRef.current();
      return;
    }

    let cancelled = false;

    const failTimer =
      window.setTimeout(() => {
        if (!cancelled) {
          finishAd(
            false,
            true
          );
        }
      }, 9000);

    async function tryPlay() {
      if (cancelled) {
        return;
      }

      const currentVideo =
        videoRef.current;

      if (!currentVideo) {
        return;
      }

      try {
        await currentVideo.play();

        window.clearTimeout(
          failTimer
        );

        setLoading(false);
      } catch {
        currentVideo.muted =
          true;

        try {
          await currentVideo.play();

          window.clearTimeout(
            failTimer
          );

          setLoading(false);
        } catch {
          finishAd(
            false,
            true
          );
        }
      }
    }

    async function setupPlayback() {
      const currentVideo =
        videoRef.current;

      if (
        !currentVideo ||
        cancelled
      ) {
        return;
      }

      cleanupVideo();

      currentVideo.muted =
        false;

      currentVideo.playsInline =
        true;

      currentVideo.controls =
        false;

      if (
        currentVideo.canPlayType(
          "application/vnd.apple.mpegurl"
        )
      ) {
        currentVideo.src =
          hlsUrl;

        currentVideo.load();

        currentVideo.addEventListener(
          "canplay",
          tryPlay
        );

        currentVideo.addEventListener(
          "loadedmetadata",
          tryPlay
        );

        return;
      }

      try {
        const hlsModule =
          await import(
            "hls.js"
          );

        if (cancelled) {
          return;
        }

        const Hls =
          hlsModule.default;

        if (
          !Hls.isSupported()
        ) {
          onFinishedRef.current();
          return;
        }

        const hls =
          new Hls({
            enableWorker: true,
            maxBufferLength: 12,
          });

        if (cancelled) {
          hls.destroy();
          return;
        }

        hlsRef.current =
          hls;

        hls.loadSource(
          hlsUrl
        );

        hls.attachMedia(
          currentVideo
        );

        hls.on(
          Hls.Events
            .MANIFEST_PARSED,
          tryPlay
        );

        hls.on(
          Hls.Events.ERROR,
          (_event, data) => {
            if (
              data.fatal
            ) {
              finishAd(
                false,
                true
              );
            }
          }
        );
      } catch (error) {
        console.error(
          "LOAD MIDROLL HLS ERROR:",
          error
        );

        if (!cancelled) {
          finishAd(
            false,
            true
          );
        }
      }
    }

    void setupPlayback();

    return () => {
      cancelled = true;

      window.clearTimeout(
        failTimer
      );

      video.removeEventListener(
        "canplay",
        tryPlay
      );

      video.removeEventListener(
        "loadedmetadata",
        tryPlay
      );

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [
    ad,
    cleanupVideo,
    finishAd,
  ]);

  useEffect(() => {
    return () => {
      cleanupVideo();
    };
  }, [cleanupVideo]);

  if (!ad) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
        <div className="relative h-1 w-64 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 w-1/2 animate-[playerLoadSlide_1.1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-white shadow-[0_0_22px_rgba(56,189,248,0.8)]" />
        </div>
      </div>
    );
  }

  const skipAfterSeconds =
    ad.skipAfterSeconds ??
    5;

  const backendAllowsSkip =
    ad.canSkip === true;

  const showSkipButton =
    !ad.isHouseAd &&
    backendAllowsSkip;

  const remainingSkipSeconds =
    Math.max(
      0,
      skipAfterSeconds -
        secondsWatched
    );

  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-black">
      <video
        ref={videoRef}
        onTimeUpdate={() => {
          const video =
            videoRef.current;

          if (!video) {
            return;
          }

          const watched =
            Math.floor(
              video.currentTime
            );

          secondsWatchedRef.current =
            watched;

          setSecondsWatched(
            watched
          );

          if (
            backendAllowsSkip &&
            watched >=
              skipAfterSeconds
          ) {
            setSkipReady(true);
          }
        }}
        onEnded={() => {
          finishAd(
            true,
            false
          );
        }}
        onClick={clickAd}
        className="h-full w-full bg-black object-contain"
        playsInline
      />

      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/75 backdrop-blur-xl md:left-7 md:top-6">
        {getAdLabel(ad)}
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

      {showSkipButton ? (
        <button
          type="button"
          disabled={!skipReady}
          onClick={() => {
            finishAd(
              false,
              true
            );
          }}
          className="absolute bottom-8 right-4 z-20 rounded-full border border-white/15 bg-black/65 px-5 py-2.5 text-xs font-black text-white/80 backdrop-blur-xl transition hover:border-sky-300/40 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-45 md:right-10"
        >
          {skipReady
            ? "Skip Ad"
            : `Skip in ${remainingSkipSeconds}`}
        </button>
      ) : (
        <div className="absolute bottom-8 right-4 z-20 rounded-full border border-white/10 bg-black/55 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-white/50 backdrop-blur-xl md:right-10">
          {ad.isHouseAd
            ? "SourceTV Preview"
            : "Ad Playing"}
        </div>
      )}
    </div>
  );
}