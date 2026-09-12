"use client";

import type {
  MouseEvent,
  RefObject,
} from "react";
import {
  ForwardIcon,
  PlayPauseIcon,
  RewindIcon,
  SettingsIcon,
  VolumeIcon,
} from "./icons";
import { formatTime } from "./media";

type PlayerControlsProps = {
  title?: string;
  type?: string;
  playing: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  controlsVisible: boolean;
  settingsOpen: boolean;
  audioLanguage: string;
  captions: string;
  settingsRef: RefObject<HTMLDivElement | null>;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onToggleMute: () => void;
  onSeek: (
    event: MouseEvent<HTMLDivElement>
  ) => void;
  onShowControls: () => void;
  onToggleSettings: () => void;
  onAudioLanguageChange: (
    language: string
  ) => void;
  onCaptionsChange: (
    option: string
  ) => void;
};

export default function PlayerControls({
  title,
  type,
  playing,
  muted,
  currentTime,
  duration,
  progress,
  controlsVisible,
  settingsOpen,
  audioLanguage,
  captions,
  settingsRef,
  onTogglePlay,
  onSkip,
  onToggleMute,
  onSeek,
  onShowControls,
  onToggleSettings,
  onAudioLanguageChange,
  onCaptionsChange,
}: PlayerControlsProps) {
  return (
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
            {type || "Now Playing"}
          </p>
        </div>

        <div className="hidden shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-bold text-white/58 backdrop-blur-xl md:block">
          {formatTime(currentTime)} /{" "}
          {formatTime(duration)}
        </div>
      </div>

      <div
        onClick={onSeek}
        onMouseMove={onShowControls}
        className="group/progress relative h-[3px] cursor-pointer overflow-visible rounded-full bg-white/12 transition-all duration-300 hover:h-[8px]"
      >
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-sky-700 via-sky-300 to-white shadow-[0_0_24px_rgba(56,189,248,0.8)] transition-[width] duration-150 ease-linear"
          style={{
            width: `${progress}%`,
          }}
        >
          <span className="absolute inset-y-0 right-0 w-16 translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-white/85 to-transparent opacity-90 blur-[2px]" />

          <span className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-white opacity-0 shadow-[0_0_22px_rgba(255,255,255,0.95)] transition group-hover/progress:opacity-100" />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 md:gap-3">
          <button
            onClick={onTogglePlay}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition hover:bg-sky-200"
            aria-label={
              playing
                ? "Pause"
                : "Play"
            }
          >
            <PlayPauseIcon
              playing={playing}
            />
          </button>

          <button
            onClick={() => onSkip(-10)}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] text-white/85 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:flex"
            aria-label="Rewind 10 seconds"
          >
            <RewindIcon />
          </button>

          <button
            onClick={() => onSkip(10)}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] text-white/85 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100 md:flex"
            aria-label="Forward 10 seconds"
          >
            <ForwardIcon />
          </button>

          <button
            onClick={onToggleMute}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.045] text-white/85 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-100"
            aria-label={
              muted
                ? "Unmute"
                : "Mute"
            }
          >
            <VolumeIcon muted={muted} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="block shrink-0 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-bold text-white/58 backdrop-blur-xl md:hidden">
            {formatTime(currentTime)} /{" "}
            {formatTime(duration)}
          </div>

          <div
            ref={settingsRef}
            className="relative"
          >
            <button
              onClick={onToggleSettings}
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
                    {[
                      "English",
                      "Spanish",
                      "Original",
                    ].map(
                      (language) => (
                        <button
                          key={language}
                          onClick={() =>
                            onAudioLanguageChange(
                              language
                            )
                          }
                          className={`rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                            audioLanguage ===
                            language
                              ? "bg-sky-400 text-black shadow-[0_0_22px_rgba(56,189,248,0.28)]"
                              : "text-white/70 hover:bg-white/[0.07] hover:text-white"
                          }`}
                        >
                          {language}
                        </button>
                      )
                    )}
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
                        onClick={() =>
                          onCaptionsChange(
                            option
                          )
                        }
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
  );
}