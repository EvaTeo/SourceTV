"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function ModerationSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Moderation
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Platform Moderation
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Configure automated moderation, reporting,
            creator safety, and future community tools.
          </p>
        </div>

        <ToggleCard
          title="Moderation Enabled"
          description="Enable moderation tools across SourceTV."
          checked={settings.moderationEnabled}
          onToggle={() =>
            update(
              "moderationEnabled",
              !settings.moderationEnabled
            )
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <FeatureCard
          title="Current Moderation"
          items={[
            "Partner Review Queue",
            "Content Approval",
            "Rights Verification",
            "Metadata Review",
            "Manual Publishing",
          ]}
        />

        <FeatureCard
          title="Future Moderation"
          items={[
            "Viewer Reports",
            "Comment Reports",
            "Automatic Content Flags",
            "Copyright Detection",
            "Duplicate Detection",
          ]}
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <h3 className="text-lg font-semibold text-white">
          AI Moderation Roadmap
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <RoadmapCard title="Violence Detection" />
          <RoadmapCard title="Adult Content Review" />
          <RoadmapCard title="Hate Speech Detection" />
          <RoadmapCard title="Copyright Verification" />
          <RoadmapCard title="Audio Scanning" />
          <RoadmapCard title="Thumbnail Review" />
          <RoadmapCard title="Metadata Validation" />
          <RoadmapCard title="Spam Prevention" />
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

function FeatureCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/70"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapCard({
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