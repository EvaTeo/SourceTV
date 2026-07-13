"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function MaintenanceSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Maintenance
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Platform Maintenance
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Control maintenance mode, emergency tools,
            system status, and platform availability.
          </p>
        </div>

        <ToggleCard
          title="Maintenance Mode"
          description="Prevent viewers from accessing SourceTV while maintenance is being performed."
          checked={settings.maintenanceMode}
          onToggle={() =>
            update(
              "maintenanceMode",
              !settings.maintenanceMode
            )
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <StatusCard
          title="Platform Status"
          value={
            settings.maintenanceMode
              ? "Maintenance"
              : "Online"
          }
          color={
            settings.maintenanceMode
              ? "amber"
              : "emerald"
          }
        />

        <StatusCard
          title="Streaming"
          value="Operational"
          color="emerald"
        />

        <StatusCard
          title="Database"
          value="Healthy"
          color="emerald"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ActionCard
          title="Emergency Controls"
          description="Future administrator tools."
          actions={[
            "Force logout all users",
            "Disable new registrations",
            "Disable uploads",
            "Read-only mode",
            "Emergency homepage banner",
          ]}
        />

        <ActionCard
          title="Maintenance Checklist"
          description="Recommended workflow before deployment."
          actions={[
            "Backup database",
            "Run migrations",
            "Deploy application",
            "Verify analytics",
            "Re-enable platform",
          ]}
        />
      </section>

      <section className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6">
        <h3 className="text-lg font-semibold text-white">
          Planned System Monitoring
        </h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FutureCard title="Server Health" />
          <FutureCard title="CDN Status" />
          <FutureCard title="API Monitoring" />
          <FutureCard title="Storage Usage" />
          <FutureCard title="Email Queue" />
          <FutureCard title="Background Jobs" />
          <FutureCard title="Video Encoding" />
          <FutureCard title="Database Performance" />
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

function StatusCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: "emerald" | "amber";
}) {
  const badge =
    color === "emerald"
      ? "bg-emerald-500/10 text-emerald-300"
      : "bg-amber-500/10 text-amber-300";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
        {title}
      </p>

      <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${badge}`}>
        {value}
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-white/40">
        {description}
      </p>

      <div className="mt-5 space-y-3">
        {actions.map((action) => (
          <div
            key={action}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/70"
          >
            {action}
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