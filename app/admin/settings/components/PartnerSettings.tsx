"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function PartnerSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Partner Program
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Partner Settings
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Configure creator onboarding, revenue sharing,
            contracts, and submission preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ToggleCard
            title="Partner Applications"
            description="Allow creators to submit applications."
            checked={settings.partnerApplications}
            onToggle={() =>
              update(
                "partnerApplications",
                !settings.partnerApplications
              )
            }
          />

          <RevenueCard
            value={settings.defaultRevenueShare}
            onChange={(value) =>
              update("defaultRevenueShare", value)
            }
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <InfoCard
          title="Default Workflow"
          items={[
            "Application Review",
            "Content Submission",
            "Metadata Review",
            "Rights Verification",
            "Publishing",
          ]}
        />

        <InfoCard
          title="Contract Defaults"
          items={[
            "Revenue Sharing",
            "Territories",
            "License Duration",
            "Renewal Options",
            "Signature Required",
          ]}
        />

        <InfoCard
          title="Future Features"
          items={[
            "Tax Documents",
            "Automatic Payments",
            "Creator Analytics",
            "Content Scheduling",
            "Multi-User Teams",
          ]}
        />
      </section>

      <section className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6">
        <h3 className="text-lg font-semibold text-white">
          Planned Creator Portal
        </h3>

        <p className="mt-3 text-sm leading-6 text-white/40">
          Future updates will allow partners to customize
          branded pages, manage payouts, collaborate with
          multiple team members, monitor audience analytics,
          receive AI recommendations, and manage contracts
          directly from one workspace.
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

function RevenueCard({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm font-semibold text-white">
        Default Revenue Share
      </p>

      <p className="mt-2 text-sm text-white/40">
        Percentage paid to creators by default.
      </p>

      <div className="mt-5 flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) =>
            onChange(Number(e.target.value))
          }
          className="w-28 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
        />

        <span className="text-white/45">%</span>
      </div>
    </div>
  );
}

function InfoCard({
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