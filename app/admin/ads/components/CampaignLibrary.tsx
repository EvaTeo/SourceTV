import EmptyState from "@/app/components/admin/EmptyState";

import type { AdCampaign } from "../types";

import CampaignCard from "./CampaignCard";

type CampaignLibraryProps = {
  campaigns: AdCampaign[];
  loading: boolean;
  saving: boolean;

  onStatusChange: (
    campaignId: string,
    status: string
  ) => void;
};

export default function CampaignLibrary({
  campaigns,
  loading,
  saving,
  onStatusChange,
}: CampaignLibraryProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
        Campaign Library
      </p>

      <h2 className="mt-2 text-2xl font-black">
        Campaigns
      </h2>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-6 text-white/45">
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No ad campaigns yet."
            description="Create a campaign to begin testing SourceTV advertising delivery."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {campaigns.map(
            (campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                saving={saving}
                onStatusChange={
                  onStatusChange
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}