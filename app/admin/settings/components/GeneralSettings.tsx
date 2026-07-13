"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function GeneralSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Platform Identity
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            General Settings
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Configure the basic identity of SourceTV including its
            public branding, contact information, localization,
            and global platform preferences.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">

          <SettingField
            label="Platform Name"
            description="Displayed throughout the application."
          >
            <input
              value={settings.platformName}
              onChange={(e) =>
                update("platformName", e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-sky-300"
            />
          </SettingField>

          <SettingField
            label="Tagline"
            description="Shown on landing pages and marketing."
          >
            <input
              value={settings.tagline}
              onChange={(e) =>
                update("tagline", e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-sky-300"
            />
          </SettingField>

          <SettingField
            label="Support Email"
            description="Customer support contact."
          >
            <input
              value={settings.supportEmail}
              onChange={(e) =>
                update("supportEmail", e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-sky-300"
            />
          </SettingField>

          <SettingField
            label="Contact Email"
            description="General business inquiries."
          >
            <input
              value={settings.contactEmail}
              onChange={(e) =>
                update("contactEmail", e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-sky-300"
            />
          </SettingField>

        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">

        <InfoCard
          title="Brand Assets"
          description="These will be connected later to the media library."
        >
          <div className="space-y-4">

            <PlaceholderUpload label="Platform Logo" />

            <PlaceholderUpload label="Favicon" />

            <PlaceholderUpload label="App Icon" />

            <PlaceholderUpload label="Default Social Image" />

          </div>
        </InfoCard>

        <InfoCard
          title="Platform Status"
          description="Current environment information."
        >

          <StatusRow
            label="Environment"
            value="Production"
          />

          <StatusRow
            label="Version"
            value="v1.0 Beta"
          />

          <StatusRow
            label="Region"
            value="United States"
          />

          <StatusRow
            label="Timezone"
            value="America/Los_Angeles"
          />

          <StatusRow
            label="Default Language"
            value="English"
          />

        </InfoCard>

      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

        <h3 className="text-xl font-semibold text-white">
          Legal Information
        </h3>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">

          <SettingField
            label="Copyright"
            description="Displayed in the footer."
          >
            <input
              defaultValue="© 2026 SourceTV. All rights reserved."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white"
            />
          </SettingField>

          <SettingField
            label="Company Name"
            description="Legal entity."
          >
            <input
              defaultValue="SourceTV Inc."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white"
            />
          </SettingField>

        </div>

      </section>

    </div>
  );
}

function SettingField({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white">
        {label}
      </label>

      <p className="mt-1 mb-3 text-xs text-white/40">
        {description}
      </p>

      {children}
    </div>
  );
}

function InfoCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

      <h3 className="text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-white/45">
        {description}
      </p>

      <div className="mt-6">
        {children}
      </div>

    </section>
  );
}

function PlaceholderUpload({
  label,
}: {
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex h-24 w-full items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-sm font-medium text-white/45 transition hover:border-sky-300 hover:text-sky-300"
    >
      {label}
    </button>
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
    <div className="flex items-center justify-between border-b border-white/5 py-3">

      <span className="text-white/45">
        {label}
      </span>

      <span className="font-medium text-white">
        {value}
      </span>

    </div>
  );
}