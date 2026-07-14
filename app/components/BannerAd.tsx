"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type BannerAdCampaign = {
  id: string;
  name: string;
  placement: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  clickUrl?: string | null;
};

type AdvertisingSettings = {
  adsEnabled: boolean;
  bannerAds: boolean;
};

const defaultAdvertisingSettings: AdvertisingSettings = {
  adsEnabled: true,
  bannerAds: true,
};

export default function BannerAd({
  projectId,
  className = "",
}: {
  projectId?: string;
  className?: string;
}) {
  const trackedRef = useRef(false);

  const [ad, setAd] =
    useState<BannerAdCampaign | null>(null);

  const [hidden, setHidden] =
    useState(false);

  const [settingsLoaded, setSettingsLoaded] =
    useState(false);

  const [advertisingSettings, setAdvertisingSettings] =
    useState<AdvertisingSettings>(
      defaultAdvertisingSettings
    );

  const adsAllowed =
    advertisingSettings.adsEnabled &&
    advertisingSettings.bannerAds;

  const trackAd = useCallback(
    async ({
      clicked = false,
      completed = false,
    }: {
      clicked?: boolean;
      completed?: boolean;
    }) => {
      if (!ad || !adsAllowed) {
        return;
      }

      if (!clicked && trackedRef.current) {
        return;
      }

      if (!clicked) {
        trackedRef.current = true;
      }

      try {
        await fetch("/api/ads/impression", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            campaignId: ad.id,
            projectId: projectId || "",
            placement:
              ad.placement || "banner",
            completed,
            skipped: false,
            clicked,
            watchedSeconds: 0,
          }),
        });
      } catch (error) {
        console.error(
          "TRACK BANNER AD ERROR:",
          error
        );
      }
    },
    [ad, adsAllowed, projectId]
  );

  const handleClick =
    useCallback(async () => {
      if (
        !adsAllowed ||
        !ad?.clickUrl
      ) {
        return;
      }

      await trackAd({
        clicked: true,
      });

      window.open(
        ad.clickUrl,
        "_blank",
        "noopener,noreferrer"
      );
    }, [ad, adsAllowed, trackAd]);

  useEffect(() => {
    let cancelled = false;

    async function loadAdvertisingSettings() {
      try {
        const response = await fetch(
          "/api/settings",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data: unknown =
          await response.json();

        if (
          cancelled ||
          !data ||
          typeof data !== "object"
        ) {
          return;
        }

        const result = data as {
          adsEnabled?: unknown;
          bannerAds?: unknown;
        };

        setAdvertisingSettings({
          adsEnabled:
            typeof result.adsEnabled ===
            "boolean"
              ? result.adsEnabled
              : defaultAdvertisingSettings.adsEnabled,

          bannerAds:
            typeof result.bannerAds ===
            "boolean"
              ? result.bannerAds
              : defaultAdvertisingSettings.bannerAds,
        });
      } catch (error) {
        console.error(
          "LOAD BANNER SETTINGS ERROR:",
          error
        );
      } finally {
        if (!cancelled) {
          setSettingsLoaded(true);
        }
      }
    }

    void loadAdvertisingSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadBannerAd() {
      if (
        !settingsLoaded ||
        !adsAllowed
      ) {
        setAd(null);
        return;
      }

      try {
        const params =
          new URLSearchParams({
            placement: "banner",
          });

        if (projectId) {
          params.set(
            "projectId",
            projectId
          );
        }

        const response = await fetch(
          `/api/ads/active?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (!cancelled) {
            setAd(null);
          }

          return;
        }

        const data =
          (await response.json()) as
            | BannerAdCampaign
            | null;

        if (cancelled) {
          return;
        }

        if (
          !data?.id ||
          (!data.imageUrl &&
            !data.videoUrl)
        ) {
          setAd(null);
          return;
        }

        trackedRef.current = false;
        setHidden(false);
        setAd(data);
      } catch (error) {
        console.error(
          "LOAD BANNER AD ERROR:",
          error
        );

        if (!cancelled) {
          setAd(null);
        }
      }
    }

    void loadBannerAd();

    return () => {
      cancelled = true;
    };
  }, [
    adsAllowed,
    projectId,
    settingsLoaded,
  ]);

  useEffect(() => {
    if (
      !ad ||
      !adsAllowed ||
      trackedRef.current
    ) {
      return;
    }

    const timer = window.setTimeout(
      () => {
        void trackAd({
          completed: true,
        });
      },
      900
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [ad, adsAllowed, trackAd]);

  if (
    !settingsLoaded ||
    !adsAllowed ||
    !ad ||
    hidden
  ) {
    return null;
  }

  return (
    <section
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-blue-500/10" />

        <div className="relative flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-5">
          <button
            type="button"
            onClick={() => {
              void handleClick();
            }}
            disabled={!ad.clickUrl}
            className="group flex min-w-0 flex-1 items-center gap-4 text-left disabled:cursor-default"
          >
            <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-2xl bg-black md:h-24 md:w-44">
              {ad.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ad.imageUrl}
                  alt={ad.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <video
                  src={ad.videoUrl || ""}
                  className="h-full w-full object-cover"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </div>

            <div className="min-w-0">
              <div className="mb-2 inline-flex rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-sky-100">
                Sponsored
              </div>

              <h3 className="line-clamp-1 text-sm font-black text-white md:text-base">
                {ad.name}
              </h3>

              <p className="mt-1 line-clamp-2 text-xs font-medium text-white/55 md:text-sm">
                Discover more from this
                SourceTV partner.
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3 md:shrink-0">
            {ad.clickUrl && (
              <button
                type="button"
                onClick={() => {
                  void handleClick();
                }}
                className="rounded-full bg-white px-5 py-2.5 text-xs font-black text-black transition hover:bg-sky-200"
              >
                Learn More
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setHidden(true)
              }
              className="rounded-full border border-white/10 bg-black/35 px-4 py-2.5 text-xs font-black text-white/55 transition hover:border-white/25 hover:text-white"
              aria-label="Hide banner ad"
            >
              Hide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}