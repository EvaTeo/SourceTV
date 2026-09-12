"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  emptyAdCampaignForm,
} from "../constants";

import {
  createAdCampaign,
  fetchAdCampaigns,
  updateAdCampaignStatus,
} from "../lib/adsApi";

import type {
  AdCampaign,
  AdCampaignForm,
} from "../types";

import {
  getAdCampaignStats,
} from "../utils";

export default function useAdsManager() {
  const [
    campaigns,
    setCampaigns,
  ] =
    useState<AdCampaign[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    form,
    setForm,
  ] =
    useState<AdCampaignForm>(
      emptyAdCampaignForm
    );

  function updateForm(
    name: keyof AdCampaignForm,
    value: string | boolean
  ) {
    setForm((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      if (
        name ===
          "placement" &&
        value === "banner"
      ) {
        next.durationSeconds =
          "15";

        next.skipPolicy =
          "never";

        next.skipAfterSeconds =
          "0";
      }

      if (
        name === "adType" &&
        value === "house"
      ) {
        next.skipPolicy =
          "never";

        next.premiumCanSkip =
          false;
      }

      return next;
    });
  }

  async function loadCampaigns() {
    try {
      setLoading(true);

      const nextCampaigns =
        await fetchAdCampaigns();

      setCampaigns(
        nextCampaigns
      );
    } catch (error) {
      console.error(
        "LOAD ADS ERROR:",
        error
      );

      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign(
    event: FormEvent
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      window.alert(
        "Campaign name is required."
      );

      return;
    }

    if (
      form.adSource ===
        "google" &&
      !form.vastTagUrl.trim()
    ) {
      window.alert(
        "Google / VAST campaigns need a VAST tag URL."
      );

      return;
    }

    if (
      form.adSource ===
        "direct" &&
      form.placement ===
        "banner" &&
      !form.imageUrl.trim() &&
      !form.videoUrl.trim()
    ) {
      window.alert(
        "Banner campaigns need an image URL or video URL."
      );

      return;
    }

    if (
      form.adSource ===
        "direct" &&
      form.placement !==
        "banner" &&
      !form.videoUrl.trim()
    ) {
      window.alert(
        "Video ad campaigns need an ad video URL."
      );

      return;
    }

    try {
      setSaving(true);

      await createAdCampaign(
        form
      );

      setForm({
        ...emptyAdCampaignForm,
      });

      await loadCampaigns();
    } catch (error) {
      console.error(
        "CREATE AD ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not create ad campaign."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    campaignId: string,
    status: string
  ) {
    try {
      setSaving(true);

      await updateAdCampaignStatus(
        campaignId,
        status
      );

      await loadCampaigns();
    } catch (error) {
      console.error(
        "UPDATE AD ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not update ad campaign."
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    void loadCampaigns();
  }, []);

  const stats =
    useMemo(
      () =>
        getAdCampaignStats(
          campaigns
        ),
      [campaigns]
    );

  return {
    campaigns,
    loading,
    saving,

    form,
    updateForm,

    stats,

    loadCampaigns,
    createCampaign,
    updateStatus,
  };
}