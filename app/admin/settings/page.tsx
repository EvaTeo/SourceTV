"use client";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { useState } from "react";

import AccountSettings from "./components/AccountSettings";
import AdvertisingSettings from "./components/AdvertisingSettings";
import AISettings from "./components/AISettings";
import GeneralSettings from "./components/GeneralSettings";
import HomepageSettings from "./components/HomepageSettings";
import MaintenanceSettings from "./components/MaintenanceSettings";
import ModerationSettings from "./components/ModerationSettings";
import NotificationSettings from "./components/NotificationSettings";
import PartnerSettings from "./components/PartnerSettings";
import PremiumSettings from "./components/PremiumSettings";
import SaveBar from "./components/SaveBar";
import SettingsTabs from "./components/SettingsTabs";

import useSettings from "./hooks/useSettings";
import type { SettingsSection } from "./types";

export default function SettingsPage() {
  const {
  settings,
  update,
  loading,
  saving,
  message,
  saveSettings,
} = useSettings();

  const [activeTab, setActiveTab] =
    useState<SettingsSection>("general");

  if (loading) {
    return (
      <main className="space-y-6">
        <AdminPageHeader
          eyebrow="SourceTV Platform"
          title="Settings"
          description="Configure SourceTV platform behavior, accounts, advertising, AI, maintenance, and launch preferences."
        />

        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-8">
          <p className="text-sm text-white/50">
            Loading platform settings...
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Platform"
        title="Settings"
        description="Configure SourceTV platform behavior, accounts, advertising, AI, maintenance, and launch preferences."
      />

      <SettingsTabs
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "general" && (
        <GeneralSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "homepage" && (
        <HomepageSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "accounts" && (
        <AccountSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "premium" && (
        <PremiumSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "advertising" && (
        <AdvertisingSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "partners" && (
        <PartnerSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "notifications" && (
        <NotificationSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "moderation" && (
        <ModerationSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "maintenance" && (
        <MaintenanceSettings
          settings={settings}
          update={update}
        />
      )}

      {activeTab === "ai" && (
        <AISettings
          settings={settings}
          update={update}
        />
      )}

      {message && (
        <div
          className={`rounded-2xl border px-5 py-4 text-sm font-semibold ${
            message
              .toLowerCase()
              .includes("success")
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-red-400/20 bg-red-400/10 text-red-300"
          }`}
        >
          {message}
        </div>
      )}

     <SaveBar
  saving={saving}
  onSave={() => {
    void saveSettings();
  }}
/>
    </main>
  );
}