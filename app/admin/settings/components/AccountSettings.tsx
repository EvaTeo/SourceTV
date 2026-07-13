"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function AccountSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Accounts
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            User Account Settings
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Configure registration, profile creation, authentication,
            and default account behavior.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ToggleSetting
            title="Allow New Registrations"
            description="Allow new viewers to create SourceTV accounts."
            checked={settings.allowRegistrations}
            onToggle={() =>
              update(
                "allowRegistrations",
                !settings.allowRegistrations
              )
            }
          />

          <ToggleSetting
            title="Require Email Verification"
            description="Require users to verify their email before accessing SourceTV."
            checked={settings.requireEmailVerification}
            onToggle={() =>
              update(
                "requireEmailVerification",
                !settings.requireEmailVerification
              )
            }
          />
        </div>

        <div className="mt-8 max-w-sm">
          <label className="block text-sm font-semibold text-white">
            Maximum Profiles Per Account
          </label>

          <p className="mt-1 mb-3 text-xs text-white/40">
            Number of household profiles each account can create.
          </p>

          <input
            type="number"
            min={1}
            max={10}
            value={settings.maxProfiles}
            onChange={(e) =>
              update(
                "maxProfiles",
                Number(e.target.value)
              )
            }
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-sky-300"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <InfoCard
          title="Registration"
          text="Viewer sign-up behavior and account creation."
        />

        <InfoCard
          title="Profiles"
          text="Household profiles and profile limits."
        />

        <InfoCard
          title="Authentication"
          text="Email verification and future MFA controls."
        />
      </section>
    </div>
  );
}

function ToggleSetting({
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

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-white/40">
        {text}
      </p>
    </div>
  );
}