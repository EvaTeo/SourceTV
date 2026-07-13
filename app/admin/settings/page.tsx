"use client";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import { useState } from "react";

import SaveBar from "./components/SaveBar";
import SettingsTabs from "./components/SettingsTabs";

import GeneralSettings from "./components/GeneralSettings";
import HomepageSettings from "./components/HomepageSettings";
import AccountSettings from "./components/AccountSettings";
import PremiumSettings from "./components/PremiumSettings";
import AdvertisingSettings from "./components/AdvertisingSettings";
import PartnerSettings from "./components/PartnerSettings";
import NotificationSettings from "./components/NotificationSettings";
import ModerationSettings from "./components/ModerationSettings";
import MaintenanceSettings from "./components/MaintenanceSettings";
import AISettings from "./components/AISettings";

import useSettings from "./hooks/useSettings";
import type { SettingsSection } from "./types";

export default function SettingsPage() {
  const { settings, update } = useSettings();

  const [activeTab, setActiveTab] =
    useState<SettingsSection>("general");

  function saveSettings() {
    console.log("Save Settings", settings);
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

      <SaveBar onSave={saveSettings} />
    </main>
  );
}