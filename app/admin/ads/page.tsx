"use client";

import { useEffect, useMemo, useState } from "react";

type AdCampaign = {
  id: string;
  name: string;
  advertiser?: string | null;
  status: string;
  placement: string;
  videoUrl?: string | null;
  clickUrl?: string | null;
  imageUrl?: string | null;
  skipAfterSeconds?: number | null;
  durationSeconds?: number | null;
  budgetCents: number;
  cpmCents: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  impressions?: {
    id: string;
    completed: boolean;
    skipped: boolean;
    clicked: boolean;
    watchedSeconds: number;
  }[];
};

const placements = [
  { label: "Pre-roll", value: "pre_roll" },
  { label: "Mid-roll", value: "mid_roll" },
  { label: "Post-roll", value: "post_roll" },
  { label: "Banner", value: "banner" },
];

const statuses = ["draft", "active", "paused", "ended"];

function moneyFromCents(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status: string) {
  if (status === "active")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (status === "paused")
    return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
  if (status === "ended")
    return "border-red-400/40 bg-red-500/12 text-red-200";

  return "border-white/15 bg-white/[0.05] text-white/65";
}

export default function AdminAdsPage() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    advertiser: "",
    placement: "pre_roll",
    videoUrl: "",
    imageUrl: "",
    clickUrl: "",
    skipAfterSeconds: "5",
    durationSeconds: "30",
    budgetDollars: "0",
    cpmDollars: "12",
    startDate: "",
    endDate: "",
  });

  async function loadCampaigns() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/ads", {
        cache: "no-store",
      });

      if (res.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD ADS ERROR:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Campaign name is required.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/admin/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          advertiser: form.advertiser,
          placement: form.placement,
          videoUrl: form.videoUrl,
          imageUrl: form.imageUrl,
          clickUrl: form.clickUrl,
          skipAfterSeconds: Number(form.skipAfterSeconds || 5),
          durationSeconds: Number(form.durationSeconds || 30),
          budgetCents: Math.round(Number(form.budgetDollars || 0) * 100),
          cpmCents: Math.round(Number(form.cpmDollars || 12) * 100),
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not create ad campaign.");
        return;
      }

      setForm({
        name: "",
        advertiser: "",
        placement: "pre_roll",
        videoUrl: "",
        imageUrl: "",
        clickUrl: "",
        skipAfterSeconds: "5",
        durationSeconds: "30",
        budgetDollars: "0",
        cpmDollars: "12",
        startDate: "",
        endDate: "",
      });

      await loadCampaigns();
    } catch (error) {
      console.error("CREATE AD ERROR:", error);
      alert("Could not create ad campaign.");
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(campaignId: string, status: string) {
    try {
      setSaving(true);

      const res = await fetch("/api/admin/ads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not update ad campaign.");
        return;
      }

      await loadCampaigns();
    } catch (error) {
      console.error("UPDATE AD ERROR:", error);
      alert("Could not update ad campaign.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  const stats = useMemo(() => {
    const impressions = campaigns.reduce(
      (sum, campaign) => sum + (campaign.impressions?.length || 0),
      0
    );

    const completed = campaigns.reduce(
      (sum, campaign) =>
        sum +
        (campaign.impressions?.filter((impression) => impression.completed)
          .length || 0),
      0
    );

    const clicks = campaigns.reduce(
      (sum, campaign) =>
        sum +
        (campaign.impressions?.filter((impression) => impression.clicked)
          .length || 0),
      0
    );

    const active = campaigns.filter((campaign) => campaign.status === "active")
      .length;

    return {
      total: campaigns.length,
      active,
      impressions,
      completed,
      clicks,
    };
  }, [campaigns]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.14),transparent_30%),linear-gradient(to_bottom,#020617_0%,#000_46%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="rounded-[2.4rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            SourceTV Ads
          </p>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black leading-[0.95] md:text-7xl">
                Ad Campaigns
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 md:text-base">
                Manage pre-roll, mid-roll, post-roll, and banner campaigns
                before they are connected to the SourceTV player.
              </p>
            </div>

            <button
              onClick={loadCampaigns}
              className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 transition hover:border-sky-300/45 hover:text-sky-200"
            >
              Refresh
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Campaigns" value={stats.total} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Impressions" value={stats.impressions} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Clicks" value={stats.clicks} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
          <form
            onSubmit={createCampaign}
            className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
              Create Campaign
            </p>

            <h2 className="mt-2 text-2xl font-black">New Ad</h2>

            <Field label="Campaign Name">
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className="input"
                placeholder="Summer launch campaign"
              />
            </Field>

            <Field label="Advertiser">
              <input
                value={form.advertiser}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    advertiser: event.target.value,
                  }))
                }
                className="input"
                placeholder="Brand or sponsor name"
              />
            </Field>

            <Field label="Placement">
              <select
                value={form.placement}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    placement: event.target.value,
                  }))
                }
                className="input"
              >
                {placements.map((placement) => (
                  <option key={placement.value} value={placement.value}>
                    {placement.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ad Video URL">
              <input
                value={form.videoUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    videoUrl: event.target.value,
                  }))
                }
                className="input"
                placeholder="https://..."
              />
            </Field>

            <Field label="Image / Banner URL">
              <input
                value={form.imageUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    imageUrl: event.target.value,
                  }))
                }
                className="input"
                placeholder="https://..."
              />
            </Field>

            <Field label="Click URL">
              <input
                value={form.clickUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    clickUrl: event.target.value,
                  }))
                }
                className="input"
                placeholder="https://advertiser.com"
              />
            </Field>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Skip After Seconds">
                <input
                  type="number"
                  value={form.skipAfterSeconds}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      skipAfterSeconds: event.target.value,
                    }))
                  }
                  className="input"
                />
              </Field>

              <Field label="Duration Seconds">
                <input
                  type="number"
                  value={form.durationSeconds}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      durationSeconds: event.target.value,
                    }))
                  }
                  className="input"
                />
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Budget Dollars">
                <input
                  type="number"
                  value={form.budgetDollars}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      budgetDollars: event.target.value,
                    }))
                  }
                  className="input"
                />
              </Field>

              <Field label="CPM Dollars">
                <input
                  type="number"
                  value={form.cpmDollars}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      cpmDollars: event.target.value,
                    }))
                  }
                  className="input"
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {saving ? "Saving..." : "Create Campaign"}
            </button>
          </form>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
              Campaign Library
            </p>

            <h2 className="mt-2 text-2xl font-black">Active & Draft Ads</h2>

            {loading ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-6 text-white/45">
                Loading campaigns...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-6 text-white/45">
                No ad campaigns created yet.
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {campaigns.map((campaign) => {
                  const impressions = campaign.impressions?.length || 0;
                  const completed =
                    campaign.impressions?.filter(
                      (impression) => impression.completed
                    ).length || 0;
                  const clicks =
                    campaign.impressions?.filter((impression) => impression.clicked)
                      .length || 0;

                  return (
                    <article
                      key={campaign.id}
                      className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25"
                    >
                      <div className="grid md:grid-cols-[180px_1fr]">
                        <div
                          className="min-h-[160px] bg-zinc-950 bg-cover bg-center"
                          style={{
                            backgroundImage: campaign.imageUrl
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

                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/60">
                                  {campaign.placement.replaceAll("_", " ")}
                                </span>
                              </div>

                              <h3 className="mt-4 text-2xl font-black">
                                {campaign.name}
                              </h3>

                              <p className="mt-2 text-sm font-bold text-white/45">
                                {campaign.advertiser || "No advertiser"} • CPM{" "}
                                {moneyFromCents(campaign.cpmCents)} • Budget{" "}
                                {moneyFromCents(campaign.budgetCents)}
                              </p>

                              <p className="mt-2 text-xs leading-5 text-white/35">
                                Start: {formatDate(campaign.startDate)} • End:{" "}
                                {formatDate(campaign.endDate)}
                              </p>
                            </div>

                            <select
                              value={campaign.status}
                              disabled={saving}
                              onChange={(event) =>
                                updateStatus(campaign.id, event.target.value)
                              }
                              className="h-fit rounded-xl border border-white/10 bg-black px-3 py-2 text-xs font-black text-white outline-none"
                            >
                              {statuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-5 grid gap-3 md:grid-cols-3">
                            <MiniStat label="Impressions" value={impressions} />
                            <MiniStat label="Completed" value={completed} />
                            <MiniStat label="Clicks" value={clicks} />
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-5 block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </span>
      {children}
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}