"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function AISettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Artificial Intelligence
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            AI Platform Settings
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Configure the artificial intelligence systems that power
            SourceTV recommendations, moderation, editorial tools,
            analytics, and future automation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ToggleCard
            title="AI Recommendations"
            description="Generate personalized recommendations for every viewer."
            checked={settings.aiRecommendations}
            onToggle={() =>
              update(
                "aiRecommendations",
                !settings.aiRecommendations
              )
            }
          />

          <ToggleCard
            title="AI Editorial"
            description="Allow AI to suggest homepage collections, hero rotation, and scheduling."
            checked={settings.aiEditorial}
            onToggle={() =>
              update(
                "aiEditorial",
                !settings.aiEditorial
              )
            }
          />

          <ToggleCard
            title="AI Moderation"
            description="Use AI to assist with content moderation and review."
            checked={settings.aiModeration}
            onToggle={() =>
              update(
                "aiModeration",
                !settings.aiModeration
              )
            }
          />

          <StatusCard />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <FeatureCard
          title="Recommendation Engine"
          items={[
            "Personalized Homepage",
            "Continue Watching Ranking",
            "Similar Titles",
            "Genre Discovery",
            "Trending Predictions",
          ]}
        />

        <FeatureCard
          title="Editorial Assistant"
          items={[
            "Collection Suggestions",
            "Hero Rotation",
            "Programming Calendar",
            "Seasonal Programming",
            "Metadata Improvements",
          ]}
        />

        <FeatureCard
          title="Business Intelligence"
          items={[
            "Revenue Forecasting",
            "Audience Trends",
            "Catalog Optimization",
            "Advertising Insights",
            "Partner Recommendations",
          ]}
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <h3 className="text-xl font-semibold text-white">
          Future AI Capabilities
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FutureCard title="Thumbnail Generation" />
          <FutureCard title="Trailer Creation" />
          <FutureCard title="Subtitle Translation" />
          <FutureCard title="Automatic Chapters" />
          <FutureCard title="Scene Detection" />
          <FutureCard title="Voice Search" />
          <FutureCard title="Predictive Analytics" />
          <FutureCard title="Content Quality Score" />
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-sky-300/15 bg-sky-300/[0.04] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
          Vision
        </p>

        <h3 className="mt-3 text-xl font-semibold text-white">
          AI will become the operating system of SourceTV.
        </h3>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/45">
          Long-term, AI will help curate the homepage, optimize
          recommendations, forecast advertising revenue, assist
          creators during submissions, improve moderation, detect
          catalog issues, and surface actionable insights for the
          SourceTV team while keeping final publishing decisions
          under human control.
        </p>
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

          <p className="mt-2 text-sm leading-6 text-white/40">
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

function StatusCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm font-semibold text-white">
        Current AI Status
      </p>

      <div className="mt-5 space-y-3">
        <StatusRow label="Recommendations" value="Enabled" />
        <StatusRow label="Analytics" value="Learning" />
        <StatusRow label="Moderation" value="Optional" />
        <StatusRow label="Editorial" value="Assist Mode" />
      </div>
    </div>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2">
      <span className="text-sm text-white/45">
        {label}
      </span>

      <span className="rounded-full bg-sky-300/10 px-3 py-1 text-xs font-semibold text-sky-300">
        {value}
      </span>
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

function FutureCard({
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