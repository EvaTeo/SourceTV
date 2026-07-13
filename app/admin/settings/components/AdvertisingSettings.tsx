"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function AdvertisingSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Advertising
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Advertising Settings
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Configure advertising across SourceTV including
            pre-rolls, banners, frequency, and viewer experience.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ToggleCard
            title="Advertising Enabled"
            description="Globally enable or disable all advertising."
            checked={settings.adsEnabled}
            onToggle={() =>
              update("adsEnabled", !settings.adsEnabled)
            }
          />

          <ToggleCard
            title="Pre-roll Ads"
            description="Play an advertisement before content."
            checked={settings.preRollAds}
            onToggle={() =>
              update("preRollAds", !settings.preRollAds)
            }
          />

          <ToggleCard
            title="Mid-roll Ads"
            description="Insert ads during long-form playback."
            checked={settings.midRollAds}
            onToggle={() =>
              update("midRollAds", !settings.midRollAds)
            }
          />

          <ToggleCard
            title="Banner Ads"
            description="Display banner ads throughout SourceTV."
            checked={settings.bannerAds}
            onToggle={() =>
              update("bannerAds", !settings.bannerAds)
            }
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <StatCard
          title="Current Strategy"
          value={
            settings.adsEnabled
              ? "Advertising Enabled"
              : "Ads Disabled"
          }
        />

        <StatCard
          title="Free Users"
          value="Supported by Ads"
        />

        <StatCard
          title="Premium"
          value="Ad-Free Experience"
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <h3 className="text-xl font-semibold text-white">
          Future Advertising Controls
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FutureFeature title="Frequency Caps" />
          <FutureFeature title="Regional Campaigns" />
          <FutureFeature title="Age Targeting" />
          <FutureFeature title="Genre Targeting" />
          <FutureFeature title="Interactive Ads" />
          <FutureFeature title="Companion Banners" />
          <FutureFeature title="House Ads" />
          <FutureFeature title="Ad Scheduling" />
        </div>
      </section>
    </div>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onToggle,
}: {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm text-white/40">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`h-7 w-12 rounded-full transition ${
            checked
              ? "bg-sky-300"
              : "bg-white/10"
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white transition ${
              checked
                ? "translate-x-6"
                : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
        {title}
      </p>

      <h3 className="mt-3 text-2xl font-semibold text-white">
        {value}
      </h3>
    </div>
  );
}

function FutureFeature({
  title,
}: {
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-center text-sm text-white/45">
      {title}
    </div>
  );
}