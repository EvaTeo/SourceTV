"use client";

import { useState } from "react";
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
    useState(defaults);

  function update<K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return {
    settings,
    update,
  };
}