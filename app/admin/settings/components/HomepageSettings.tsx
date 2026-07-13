"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function HomepageSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Viewer Experience
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Homepage Settings
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Control how SourceTV looks when viewers first open the
            platform.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ToggleCard
            title="Hero Autoplay"
            description="Automatically play hero trailers."
            checked={settings.heroAutoplay}
            onChange={(value) =>
              update("heroAutoplay", value)
            }
          />

          <ToggleCard
            title="Autoplay Muted"
            description="Start hero trailers muted."
            checked={settings.autoplayMuted}
            onChange={(value) =>
              update("autoplayMuted", value)
            }
          />
        </div>

        <div className="mt-8">
          <label className="block text-sm font-semibold text-white">
            Homepage Rows
          </label>

          <p className="mt-1 mb-3 text-xs text-white/40">
            Number of editorial rows displayed.
          </p>

          <input
            type="number"
            min={1}
            max={30}
            value={settings.homepageRows}
            onChange={(e) =>
              update(
                "homepageRows",
                Number(e.target.value)
              )
            }
            className="w-40 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <PreviewCard
          title="Hero"
          description="Large cinematic banner with autoplay trailer."
        />

        <PreviewCard
          title="Editorial Rows"
          description="Trending, Featured, Originals and curated collections."
        />

        <PreviewCard
          title="Continue Watching"
          description="Resume playback across every device."
        />
      </section>
    </div>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-4">
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
          onClick={() => onChange(!checked)}
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

function PreviewCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <div className="mb-4 h-32 rounded-2xl bg-gradient-to-br from-sky-400/20 to-white/5" />

      <h3 className="font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/40">
        {description}
      </p>
    </div>
  );
}