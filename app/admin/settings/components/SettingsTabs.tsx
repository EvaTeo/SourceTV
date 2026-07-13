"use client";

import type { SettingsSection } from "../types";

const tabs: {
  id: SettingsSection;
  label: string;
}[] = [
  { id: "general", label: "General" },
  { id: "homepage", label: "Homepage" },
  { id: "accounts", label: "Accounts" },
  { id: "premium", label: "Premium" },
  { id: "advertising", label: "Advertising" },
  { id: "partners", label: "Partners" },
  { id: "notifications", label: "Notifications" },
  { id: "moderation", label: "Moderation" },
  { id: "maintenance", label: "Maintenance" },
  { id: "ai", label: "AI" },
];

type Props = {
  active: SettingsSection;
  onChange: (tab: SettingsSection) => void;
};

export default function SettingsTabs({
  active,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            active === tab.id
              ? "bg-white/[0.08] text-sky-300"
              : "text-white/45 hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}