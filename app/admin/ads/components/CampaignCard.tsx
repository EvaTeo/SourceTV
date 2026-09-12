import { statuses } from "../constants";

import type { AdCampaign } from "../types";

import {
  formatDate,
  moneyFromCents,
  placementLabel,
  statusClass,
} from "../utils";

type CampaignCardProps = {
  campaign: AdCampaign;
  saving: boolean;

  onStatusChange: (
    campaignId: string,
    status: string
  ) => void;
};

export default function CampaignCard({
  campaign,
  saving,
  onStatusChange,
}: CampaignCardProps) {
  const impressions =
    campaign.impressions?.length || 0;

  const completed =
    campaign.impressions?.filter(
      (impression) =>
        impression.completed
    ).length || 0;

  const clicks =
    campaign.impressions?.filter(
      (impression) =>
        impression.clicked
    ).length || 0;

  const spent =
    campaign.spentCents || 0;

  const remaining =
    Math.max(
      0,
      (campaign.budgetCents || 0) -
        spent
    );

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25">
      <div className="grid md:grid-cols-[180px_1fr]">
        <div
          className="min-h-[180px] bg-zinc-950 bg-cover bg-center"
          style={{
            backgroundImage:
              campaign.imageUrl
                ? `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.25)), url(${campaign.imageUrl})`
                : "radial-gradient(circle at 70% 20%, rgba(56,189,248,0.2), transparent 34%), linear-gradient(to bottom,#020617,#000)",
          }}
        />

        <div className="p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            <div>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${statusClass(
                    campaign.status
                  )}`}
                >
                  {campaign.status}
                </span>

                <Badge>
                  {campaign.adType}
                </Badge>

                <Badge>
                  {campaign.objective}
                </Badge>

                <Badge>
                  {placementLabel(
                    campaign.placement
                  )}
                </Badge>

                <Badge>
                  {campaign.adSource ===
                  "google"
                    ? "Google / VAST"
                    : "Direct"}
                </Badge>
              </div>

              <h3 className="mt-4 text-2xl font-black">
                {campaign.name}
              </h3>

              <p className="mt-2 text-sm font-bold text-white/45">
                {campaign.advertiser ||
                  "No advertiser"}{" "}
                • CPM{" "}
                {moneyFromCents(
                  campaign.cpmCents
                )}{" "}
                • Budget{" "}
                {moneyFromCents(
                  campaign.budgetCents
                )}
              </p>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Start:{" "}
                {formatDate(
                  campaign.startDate
                )}{" "}
                • End:{" "}
                {formatDate(
                  campaign.endDate
                )}
              </p>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Target:{" "}
                {campaign.targetType}{" "}
                • Priority:{" "}
                {campaign.priority}{" "}
                • Skip:{" "}
                {campaign.skipPolicy ===
                "never"
                  ? "Never"
                  : `${campaign.skipAfterSeconds}s`}
              </p>
            </div>

            <select
              value={campaign.status}
              disabled={saving}
              onChange={(event) =>
                onStatusChange(
                  campaign.id,
                  event.target.value
                )
              }
              className="h-fit rounded-xl border border-white/10 bg-black px-3 py-2 text-xs font-black text-white outline-none"
            >
              {statuses.map(
                (status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-5">
            <MiniStat
              label="Impressions"
              value={impressions}
            />

            <MiniStat
              label="Completed"
              value={completed}
            />

            <MiniStat
              label="Clicks"
              value={clicks}
            />

            <MiniStat
              label="Spent"
              value={moneyFromCents(
                spent
              )}
            />

            <MiniStat
              label="Remaining"
              value={moneyFromCents(
                remaining
              )}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function Badge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200">
      {children}
    </span>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-lg font-black text-white">
        {value}
      </p>
    </div>
  );
}