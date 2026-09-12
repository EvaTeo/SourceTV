"use client";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import MetricCard from "@/app/components/admin/MetricCard";

import CampaignLibrary from "./components/CampaignLibrary";
import CreateCampaignForm from "./components/CreateCampaignForm";

import useAdsManager from "./hooks/useAdsManager";

export default function AdminAdsPage() {
  const ads =
    useAdsManager();

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Advertising"
        title="Campaign Manager"
        description="Create commercial ads, SourceTV house campaigns, sponsor placements, targeting rules, skip rules, budgets, and schedules."
        actions={
          <button
            type="button"
            onClick={
              ads.loadCampaigns
            }
            className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
          >
            Refresh
          </button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Campaigns"
          value={ads.stats.total}
        />

        <MetricCard
          label="Active"
          value={ads.stats.active}
        />

        <MetricCard
          label="Impressions"
          value={
            ads.stats.impressions
          }
        />

        <MetricCard
          label="Completed"
          value={
            ads.stats.completed
          }
        />

        <MetricCard
          label="Clicks"
          value={ads.stats.clicks}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <CreateCampaignForm
          form={ads.form}
          saving={ads.saving}
          updateForm={
            ads.updateForm
          }
          onSubmit={
            ads.createCampaign
          }
        />

        <CampaignLibrary
          campaigns={
            ads.campaigns
          }
          loading={ads.loading}
          saving={ads.saving}
          onStatusChange={
            ads.updateStatus
          }
        />
      </section>
    </main>
  );
}