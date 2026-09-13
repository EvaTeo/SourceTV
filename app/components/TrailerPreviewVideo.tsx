"use client";

import type HlsType from "hls.js";
import {
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  url?: string | null;
  className?: string;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  fadeIn?: boolean;
};

function getHlsUrl(
  url?: string | null
) {
  if (!url) {
    return "";
  }

  if (
    url.includes(
      "playlist.m3u8"
    )
  ) {
    return url;
  }

  const match = url.match(
    /embed\/(\d+)\/([a-zA-Z0-9-]+)/
  );

  if (!match) {
    return "";
  }

  const libraryId =
    match[1];

  const videoGuid =
    match[2];

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
  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    );

  const hlsRef =
    useRef<HlsType | null>(
      null
    );

  const readyRef =
    useRef(false);

  const [ready, setReady] =
    useState(!fadeIn);

  useEffect(() => {
    const video =
      videoRef.current;

    if (!video) {
      return;
    }

    video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const video =
      videoRef.current;

    const hlsUrl =
      getHlsUrl(url);

    readyRef.current = false;
    setReady(!fadeIn);

    if (
      !video ||
      !hlsUrl
    ) {
      return;
    }

    let cancelled = false;

    if (
      hlsRef.current
    ) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    video.pause();

    video.removeAttribute(
      "src"
    );

    video.load();

    video.muted = muted;
    video.loop = loop;
    video.playsInline = true;

    async function revealAndPlay() {
      if (
        cancelled ||
        readyRef.current
      ) {
        return;
      }

      readyRef.current = true;
      setReady(true);

      if (!autoPlay) {
        return;
      }

      const currentVideo =
        videoRef.current;

      if (!currentVideo) {
        return;
      }

      try {
        await currentVideo.play();
      } catch {
        // Browser may block autoplay.
      }
    }

    function handleCanPlay() {
      void revealAndPlay();
    }

    video.addEventListener(
      "canplay",
      handleCanPlay
    );

    async function setupPlayback() {
      const currentVideo =
        videoRef.current;

      if (!currentVideo) {
        return;
      }

      if (
        currentVideo.canPlayType(
          "application/vnd.apple.mpegurl"
        )
      ) {
        if (cancelled) {
          return;
        }

        currentVideo.src =
          hlsUrl;

        currentVideo.load();

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
          return;
        }

        const hls =
          new Hls({
            enableWorker: true,
            maxBufferLength: 8,
            backBufferLength: 0,
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
          () => {
            if (cancelled) {
              return;
            }

            if (
              currentVideo.readyState >=
              2
            ) {
              void revealAndPlay();
            }
          }
        );
      } catch (error) {
        console.error(
          "TRAILER PREVIEW HLS LOAD ERROR:",
          error
        );
      }
    }

    void setupPlayback();

    return () => {
      cancelled = true;

      video.removeEventListener(
        "canplay",
        handleCanPlay
      );

      video.pause();

      video.removeAttribute(
        "src"
      );

      video.load();

      if (
        hlsRef.current
      ) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [
    url,
    loop,
    autoPlay,
    fadeIn,
  ]);

  if (!url) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      muted={muted}
      loop={loop}
      playsInline
      preload="auto"
      className={`${className} transition-opacity duration-700 ${
        ready
          ? "opacity-100"
          : "opacity-0"
      }`}
    />
  );
}