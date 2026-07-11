"use client";

import PreRollAdGate from "@/app/components/PreRollAdGate";
import SourceTVPlayer from "@/app/components/SourceTVPlayer";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-6 w-6 stroke-[1.9]"
    >
      <path d="M6.5 6.5 17.5 17.5" strokeLinecap="round" />
      <path d="M17.5 6.5 6.5 17.5" strokeLinecap="round" />
    </svg>
  );
}

function HandoffLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="relative h-[3px] w-52 overflow-hidden rounded-full bg-white/10">
        <div className="absolute inset-y-0 left-0 w-1/2 animate-[playerLoadSlide_900ms_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-white shadow-[0_0_18px_rgba(56,189,248,0.75)]" />
      </div>

      <style jsx>{`
        @keyframes playerLoadSlide {
          0% {
            transform: translateX(-130%);
          }

          50% {
            transform: translateX(75%);
          }

          100% {
            transform: translateX(230%);
          }
        }
      `}</style>
    </div>
  );
}

const defaultButtonClassName =
  "inline-flex w-full max-w-[320px] items-center justify-center gap-3 rounded-md bg-white px-8 py-3.5 text-base font-black text-black shadow-[0_12px_34px_rgba(0,0,0,0.32)] transition hover:scale-[1.025] hover:bg-sky-200 md:w-auto md:min-w-[210px] md:px-10 md:py-4 md:text-lg";

export default function FullscreenPlayButton({
  url,
  poster,
  title,
  slug,
  type,
  autoOpen = false,
  buttonClassName,
  buttonContent,
}: {
  url: string;
  poster?: string | null;
  title: string;
  slug: string;
  type: string;
  autoOpen?: boolean;
  buttonClassName?: string;
  buttonContent?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [phase, setPhase] = useState<"ad" | "handoff" | "movie">("ad");
  const [playerKey, setPlayerKey] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);

  const playerWrapRef = useRef<HTMLDivElement>(null);

  const entranceFrameRef = useRef<number | null>(null);
  const handoffTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showPlayerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const fullscreenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chromeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autoOpenedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
      entranceFrameRef.current = null;
    }

    if (handoffTimerRef.current) {
      clearTimeout(handoffTimerRef.current);
      handoffTimerRef.current = null;
    }

    if (showPlayerTimerRef.current) {
      clearTimeout(showPlayerTimerRef.current);
      showPlayerTimerRef.current = null;
    }

    if (fullscreenTimerRef.current) {
      clearTimeout(fullscreenTimerRef.current);
      fullscreenTimerRef.current = null;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (chromeTimerRef.current) {
      clearTimeout(chromeTimerRef.current);
      chromeTimerRef.current = null;
    }
  }, []);

  const scheduleChromeHide = useCallback(() => {
    if (chromeTimerRef.current) {
      clearTimeout(chromeTimerRef.current);
    }

    chromeTimerRef.current = setTimeout(() => {
      setChromeVisible(false);
      chromeTimerRef.current = null;
    }, 2400);
  }, []);

  const openPlayer = useCallback(async () => {
    if (!url) {
      console.error(`No playable video URL found for "${title}".`);
      return;
    }

    clearTimers();

    setOpen(true);
    setEntered(false);
    setClosing(false);
    setShowPlayer(false);
    setPhase("ad");
    setPlayerKey((current) => current + 1);
    setChromeVisible(true);

    entranceFrameRef.current = requestAnimationFrame(() => {
      entranceFrameRef.current = requestAnimationFrame(() => {
        setEntered(true);
        entranceFrameRef.current = null;
      });
    });

    showPlayerTimerRef.current = setTimeout(() => {
      setShowPlayer(true);
      showPlayerTimerRef.current = null;
    }, 260);

    fullscreenTimerRef.current = setTimeout(async () => {
      try {
        if (
          playerWrapRef.current &&
          !document.fullscreenElement
        ) {
          await playerWrapRef.current.requestFullscreen();
        }
      } catch {
        // The portal overlay still covers the browser window if native
        // fullscreen is blocked.
      } finally {
        fullscreenTimerRef.current = null;
      }
    }, 180);

    scheduleChromeHide();
  }, [clearTimers, scheduleChromeHide, title, url]);

  const closePlayer = useCallback(async () => {
    clearTimers();

    setClosing(true);
    setEntered(false);
    setChromeVisible(false);

    closeTimerRef.current = setTimeout(async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch {
        // Ignore fullscreen exit errors.
      }

      setOpen(false);
      setShowPlayer(false);
      setPhase("ad");
      setChromeVisible(true);
      setClosing(false);
      setEntered(false);

      closeTimerRef.current = null;
    }, 420);
  }, [clearTimers]);

  const finishAd = useCallback(() => {
    setPhase("handoff");

    if (handoffTimerRef.current) {
      clearTimeout(handoffTimerRef.current);
    }

    handoffTimerRef.current = setTimeout(() => {
      setPlayerKey((current) => current + 1);
      setPhase("movie");
      handoffTimerRef.current = null;
    }, 220);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!autoOpen || autoOpenedRef.current || !url) {
      return;
    }

    autoOpenedRef.current = true;
    openPlayer();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleMouseMove() {
      if (closing) {
        return;
      }

      setChromeVisible(true);
      scheduleChromeHide();
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [closing, open, scheduleChromeHide]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !document.fullscreenElement) {
        closePlayer();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePlayer, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const playerOverlay =
    mounted && open
      ? createPortal(
          <div
            ref={playerWrapRef}
            className={`fixed inset-0 z-[99999] h-screen w-screen overflow-hidden bg-black transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              entered && !closing
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <div
              className={`absolute inset-0 h-full w-full bg-black transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                entered && !closing
                  ? "scale-100 opacity-100 blur-0"
                  : "scale-[1.035] opacity-0 blur-md"
              }`}
            >
              {!showPlayer && (
                <div className="absolute inset-0 bg-black">
                  {poster && (
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-all duration-[900ms] ${
                        entered
                          ? "scale-100 opacity-30"
                          : "scale-[1.06] opacity-0"
                      }`}
                      style={{
                        backgroundImage: `url(${poster})`,
                      }}
                    />
                  )}

                  <div className="absolute inset-0 bg-black/75" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.08),transparent_42%)]" />
                </div>
              )}

              {showPlayer && phase === "ad" && (
                <div className="absolute inset-0 h-full w-full bg-black">
                  <PreRollAdGate
                    projectId={slug}
                    onFinished={finishAd}
                  />
                </div>
              )}

              {showPlayer && phase === "handoff" && (
                <div className="absolute inset-0 h-full w-full bg-black">
                  <HandoffLoader />
                </div>
              )}

              {showPlayer && phase === "movie" && (
                <div className="absolute inset-0 h-full w-full bg-black">
                  <SourceTVPlayer
                    key={`movie-${slug}-${playerKey}`}
                    url={url}
                    poster={poster}
                    title={title}
                    slug={slug}
                    type={type}
                    autoPlay
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={closePlayer}
              className={`absolute left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/35 text-white/90 shadow-[0_12px_34px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-100 md:left-7 md:top-6 md:h-12 md:w-12 ${
                chromeVisible && entered && !closing
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-2 opacity-0"
              }`}
              aria-label="Close player"
            >
              <CloseIcon />
            </button>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={openPlayer}
        disabled={!url}
        className={`${
          buttonClassName || defaultButtonClassName
        } ${!url ? "cursor-not-allowed opacity-50 hover:scale-100" : ""}`}
        aria-label={`Play ${title}`}
      >
        {buttonContent || (
          <>
            <span className="text-sm md:text-base">▶</span>
            <span>Play</span>
          </>
        )}
      </button>

      {playerOverlay}
    </>
  );
}