"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function NotificationSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Notifications
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Notification Settings
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Control emails, push notifications, creator alerts,
            and platform announcements.
          </p>
        </div>

        <ToggleCard
          title="Platform Notifications"
          description="Enable all notification services."
          checked={settings.notificationsEnabled}
          onToggle={() =>
            update(
              "notificationsEnabled",
              !settings.notificationsEnabled
            )
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <CategoryCard
          title="User Emails"
          items={[
            "Welcome Email",
            "Password Reset",
            "Account Verification",
            "Subscription Updates",
            "Watchlist Reminders",
          ]}
        />

        <CategoryCard
          title="Partner Emails"
          items={[
            "Application Status",
            "Content Review",
            "Contract Updates",
            "Revenue Reports",
            "Publishing Complete",
          ]}
        />

        <CategoryCard
          title="Administrator Alerts"
          items={[
            "New Partner Application",
            "New Submission",
            "Contract Signed",
            "Ad Campaign Expired",
            "System Errors",
          ]}
        />

        <CategoryCard
          title="Future Notifications"
          items={[
            "Mobile Push",
            "SMS Alerts",
            "Slack",
            "Discord",
            "Webhook Integrations",
          ]}
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <h3 className="text-lg font-semibold text-white">
          Planned Notification Center
        </h3>

        <p className="mt-3 text-sm leading-6 text-white/40">
          Future versions will include an in-app notification
          center with read status, live alerts, batch actions,
          and customizable notification preferences.
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

function CategoryCard({
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