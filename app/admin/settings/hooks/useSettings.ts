"use client";

import { useEffect, useState } from "react";
import type { PlatformSettings } from "../types";

const defaults: PlatformSettings = {
  platformName: "SourceTV",
  tagline: "The Next Generation of Entertainment",
  supportEmail: "support@sourcetv.com",
  contactEmail: "contact@sourcetv.com",

  allowRegistrations: true,
  requireEmailVerification: false,
  maxProfiles: 5,

  heroAutoplay: true,
  autoplayMuted: true,
  homepageRows: 12,

  premiumEnabled: false,
  monthlyPrice: 8.99,
  annualPrice: 89.99,
  freeTrialDays: 7,

  adsEnabled: true,
  preRollAds: true,
  midRollAds: false,
  bannerAds: true,

  partnerApplications: true,
  defaultRevenueShare: 50,

  notificationsEnabled: true,
  moderationEnabled: true,
  maintenanceMode: false,

  aiRecommendations: true,
  aiEditorial: false,
  aiModeration: false,
};

export default function useSettings() {
  const [settings, setSettings] =
    useState<PlatformSettings>(defaults);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");

  async function loadSettings() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to load platform settings."
        );
      }

      setSettings({
        platformName: data.platformName,
        tagline: data.tagline,
        supportEmail: data.supportEmail,
        contactEmail: data.contactEmail,

        allowRegistrations:
          data.allowRegistrations,
        requireEmailVerification:
          data.requireEmailVerification,
        maxProfiles: data.maxProfiles,

        heroAutoplay: data.heroAutoplay,
        autoplayMuted: data.autoplayMuted,
        homepageRows: data.homepageRows,

        premiumEnabled: data.premiumEnabled,
        monthlyPrice: data.monthlyPrice,
        annualPrice: data.annualPrice,
        freeTrialDays: data.freeTrialDays,

        adsEnabled: data.adsEnabled,
        preRollAds: data.preRollAds,
        midRollAds: data.midRollAds,
        bannerAds: data.bannerAds,

        partnerApplications:
          data.partnerApplications,
        defaultRevenueShare:
          data.defaultRevenueShare,

        notificationsEnabled:
          data.notificationsEnabled,

        moderationEnabled:
          data.moderationEnabled,

        maintenanceMode:
          data.maintenanceMode,

        aiRecommendations:
          data.aiRecommendations,
        aiEditorial: data.aiEditorial,
        aiModeration: data.aiModeration,
      });

      setDirty(false);
    } catch (error) {
      console.error(
        "LOAD PLATFORM SETTINGS ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load platform settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSettings();
  }, []);

  function update<
    K extends keyof PlatformSettings
  >(
    key: K,
    value: PlatformSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setDirty(true);
    setMessage("");
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to save platform settings."
        );
      }

      setSettings({
        platformName: data.platformName,
        tagline: data.tagline,
        supportEmail: data.supportEmail,
        contactEmail: data.contactEmail,

        allowRegistrations:
          data.allowRegistrations,
        requireEmailVerification:
          data.requireEmailVerification,
        maxProfiles: data.maxProfiles,

        heroAutoplay: data.heroAutoplay,
        autoplayMuted: data.autoplayMuted,
        homepageRows: data.homepageRows,

        premiumEnabled: data.premiumEnabled,
        monthlyPrice: data.monthlyPrice,
        annualPrice: data.annualPrice,
        freeTrialDays: data.freeTrialDays,

        adsEnabled: data.adsEnabled,
        preRollAds: data.preRollAds,
        midRollAds: data.midRollAds,
        bannerAds: data.bannerAds,

        partnerApplications:
          data.partnerApplications,
        defaultRevenueShare:
          data.defaultRevenueShare,

        notificationsEnabled:
          data.notificationsEnabled,

        moderationEnabled:
          data.moderationEnabled,

        maintenanceMode:
          data.maintenanceMode,

        aiRecommendations:
          data.aiRecommendations,
        aiEditorial: data.aiEditorial,
        aiModeration: data.aiModeration,
      });

      setDirty(false);
      setMessage("Settings saved successfully.");

      return true;
    } catch (error) {
      console.error(
        "SAVE PLATFORM SETTINGS ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save platform settings."
      );

      return false;
    } finally {
      setSaving(false);
    }
  }

  function resetSettings() {
    void loadSettings();
  }

  return {
    settings,
    update,
    loading,
    saving,
    dirty,
    message,
    saveSettings,
    resetSettings,
  };
}