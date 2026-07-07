"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

type AdImpression = {
  id: string;
  completed: boolean;
  skipped: boolean;
  clicked: boolean;
  watchedSeconds: number;
};

type AdCampaign = {
  id: string;
  name: string;
  advertiser?: string | null;
  status: string;
  adSource: string;
  vastTagUrl?: string | null;
  adType: string;
  objective: string;
  placement: string;
  videoUrl?: string | null;
  clickUrl?: string | null;
  imageUrl?: string | null;
  skipPolicy: string;
  skipAfterSeconds: number;
  premiumCanSkip: boolean;
  durationSeconds?: number | null;
  targetType: string;
  targetGenres?: string | null;
  targetRatings?: string | null;
  targetProjectId?: string | null;
  priority: number;
  budgetCents: number;
  spentCents: number;
  cpmCents: number;
  maxImpressions?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  impressions?: AdImpression[];
};

const statuses = ["draft", "active", "paused", "ended"];

const placementOptions = [
  { label: "Pre-roll", value: "pre_roll" },
  { label: "Mid-roll", value: "mid_roll" },
  { label: "Post-roll", value: "post_roll" },
  { label: "Banner", value: "banner" },
];

const adTypeOptions = [
  { label: "Commercial", value: "commercial" },
  { label: "SourceTV House", value: "house" },
  { label: "Sponsor", value: "sponsor" },
];

const objectiveOptions = [
  { label: "Awareness", value: "awareness" },
  { label: "Traffic", value: "traffic" },
  { label: "Promotion", value: "promotion" },
  { label: "Branding", value: "branding" },
];

const targetOptions = [
  { label: "All Content", value: "all" },
  { label: "Movies Only", value: "movie" },
  { label: "Shows Only", value: "show" },
  { label: "Animation Only", value: "animation" },
  { label: "Specific Genres", value: "genre" },
  { label: "Specific Ratings", value: "rating" },
  { label: "Featured Only", value: "featured" },
  { label: "Specific Project", value: "project" },
];

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

function placementLabel(value: string) {
  return (
    placementOptions.find((placement) => placement.value === value)?.label ||
    value.replaceAll("_", " ")
  );
}

function toNullableNumber(value: string) {
  if (!value.trim()) return null;

  const number = Number(value);

  if (Number.isNaN(number) || number < 0) return null;

  return Math.floor(number);
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
    status: "draft",
    adSource: "direct",
    vastTagUrl: "",
    adType: "commercial",
    objective: "awareness",
    placement: "pre_roll",
    videoUrl: "",
    imageUrl: "",
    clickUrl: "",
    skipPolicy: "after_delay",
    skipAfterSeconds: "5",
    premiumCanSkip: true,
    durationSeconds: "30",
    targetType: "all",
    targetGenres: "",
    targetRatings: "",
    targetProjectId: "",
    priority: "1",
    budgetDollars: "0",
    spentDollars: "0",
    cpmDollars: "12",
    maxImpressions: "",
    startDate: "",
    endDate: "",
  });

  function updateForm(name: string, value: string | boolean) {
    setForm((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      if (name === "placement" && value === "banner") {
        next.durationSeconds = "15";
        next.skipPolicy = "never";
        next.skipAfterSeconds = "0";
      }

      if (name === "adType" && value === "house") {
        next.skipPolicy = "never";
        next.premiumCanSkip = false;
      }

      return next;
    });
  }

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

    if (form.adSource === "google" && !form.vastTagUrl.trim()) {
      alert("Google / VAST campaigns need a VAST tag URL.");
      return;
    }

    if (form.adSource === "direct" && form.placement === "banner" && !form.imageUrl.trim() && !form.videoUrl.trim()) {
      alert("Banner campaigns need an image URL or video URL.");
      return;
    }

    if (form.adSource === "direct" && form.placement !== "banner" && !form.videoUrl.trim()) {
      alert("Video ad campaigns need an ad video URL.");
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
          status: form.status,
          adSource: form.adSource,
          vastTagUrl: form.vastTagUrl,
          adType: form.adType,
          objective: form.objective,
          placement: form.placement,
          videoUrl: form.videoUrl,
          imageUrl: form.imageUrl,
          clickUrl: form.clickUrl,
          skipPolicy: form.skipPolicy,
          skipAfterSeconds: Number(form.skipAfterSeconds || 5),
          premiumCanSkip: form.premiumCanSkip,
          durationSeconds: Number(form.durationSeconds || 30),
          targetType: form.targetType,
          targetGenres: form.targetGenres,
          targetRatings: form.targetRatings,
          targetProjectId: form.targetProjectId,
          priority: Number(form.priority || 1),
          budgetCents: Math.round(Number(form.budgetDollars || 0) * 100),
          spentCents: Math.round(Number(form.spentDollars || 0) * 100),
          cpmCents: Math.round(Number(form.cpmDollars || 12) * 100),
          maxImpressions: toNullableNumber(form.maxImpressions),
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
        status: "draft",
        adSource: "direct",
        vastTagUrl: "",
        adType: "commercial",
        objective: "awareness",
        placement: "pre_roll",
        videoUrl: "",
        imageUrl: "",
        clickUrl: "",
        skipPolicy: "after_delay",
        skipAfterSeconds: "5",
        premiumCanSkip: true,
        durationSeconds: "30",
        targetType: "all",
        targetGenres: "",
        targetRatings: "",
        targetProjectId: "",
        priority: "1",
        budgetDollars: "0",
        spentDollars: "0",
        cpmDollars: "12",
        maxImpressions: "",
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
                Campaign Manager
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 md:text-base">
                Create commercial ads, SourceTV house promotions, sponsor
                campaigns, targeting rules, skip rules, budgets, and schedules.
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

        <section className="mt-8 grid gap-6 xl:grid-cols-[460px_1fr]">
          <form
            onSubmit={createCampaign}
            className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
              Create Campaign
            </p>

            <h2 className="mt-2 text-2xl font-black">New Campaign</h2>

            <FormSection title="Campaign">
              <Field label="Campaign Name">
                <input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  className="input"
                  placeholder="Summer launch campaign"
                />
              </Field>

              <Field label="Advertiser">
                <input
                  value={form.advertiser}
                  onChange={(event) =>
                    updateForm("advertiser", event.target.value)
                  }
                  className="input"
                  placeholder="Brand, sponsor, or SourceTV"
                />
              </Field>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Ad Type">
                  <select
                    value={form.adType}
                    onChange={(event) =>
                      updateForm("adType", event.target.value)
                    }
                    className="input"
                  >
                    {adTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Objective">
                  <select
                    value={form.objective}
                    onChange={(event) =>
                      updateForm("objective", event.target.value)
                    }
                    className="input"
                  >
                    {objectiveOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </FormSection>

            <FormSection title="Media">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Ad Source">
                  <select
                    value={form.adSource}
                    onChange={(event) =>
                      updateForm("adSource", event.target.value)
                    }
                    className="input"
                  >
                    <option value="direct">SourceTV Direct</option>
                    <option value="google">Google / VAST</option>
                  </select>
                </Field>

                <Field label="Placement">
                  <select
                    value={form.placement}
                    onChange={(event) =>
                      updateForm("placement", event.target.value)
                    }
                    className="input"
                  >
                    {placementOptions.map((placement) => (
                      <option key={placement.value} value={placement.value}>
                        {placement.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {form.placement === "banner" && (
                <div className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-4 text-xs font-bold leading-6 text-sky-100/75">
                  Banner campaigns are meant for browse, home, search, and watch-page placements. Use an image URL for the cleanest launch-ready banner; video URL is supported for animated sponsored banners.
                </div>
              )}

              {form.adSource === "google" ? (
                <Field label="Google / VAST Tag URL">
                  <input
                    value={form.vastTagUrl}
                    onChange={(event) =>
                      updateForm("vastTagUrl", event.target.value)
                    }
                    className="input"
                    placeholder="https://pubads.g.doubleclick.net/gampad/ads?..."
                  />
                </Field>
              ) : (
                <>
                  <Field label="Ad Video URL">
                    <input
                      value={form.videoUrl}
                      onChange={(event) =>
                        updateForm("videoUrl", event.target.value)
                      }
                      className="input"
                      placeholder="Bunny HLS or Bunny embed URL"
                    />
                  </Field>

                  <Field label={form.placement === "banner" ? "Banner Image URL" : "Image / Banner URL"}>
                    <input
                      value={form.imageUrl}
                      onChange={(event) =>
                        updateForm("imageUrl", event.target.value)
                      }
                      className="input"
                      placeholder={form.placement === "banner" ? "https://.../banner.jpg" : "Banner, thumbnail, or poster URL"}
                    />
                  </Field>
                </>
              )}

              <Field label="Click URL">
                <input
                  value={form.clickUrl}
                  onChange={(event) =>
                    updateForm("clickUrl", event.target.value)
                  }
                  className="input"
                  placeholder="https://advertiser.com"
                />
              </Field>
            </FormSection>

            <FormSection title="Audience">
              <Field label="Target Type">
                <select
                  value={form.targetType}
                  onChange={(event) =>
                    updateForm("targetType", event.target.value)
                  }
                  className="input"
                >
                  {targetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              {form.targetType === "project" && (
                <Field label="Target Project ID">
                  <input
                    value={form.targetProjectId}
                    onChange={(event) =>
                      updateForm("targetProjectId", event.target.value)
                    }
                    className="input"
                    placeholder="ProjectSubmission ID"
                  />
                </Field>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Target Genres">
                  <input
                    value={form.targetGenres}
                    onChange={(event) =>
                      updateForm("targetGenres", event.target.value)
                    }
                    className="input"
                    placeholder="Drama, Horror, Comedy"
                  />
                </Field>

                <Field label="Target Ratings">
                  <input
                    value={form.targetRatings}
                    onChange={(event) =>
                      updateForm("targetRatings", event.target.value)
                    }
                    className="input"
                    placeholder="PG-13, TV-MA, R"
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Skip Rules">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Skip Policy">
                  <select
                    value={form.skipPolicy}
                    onChange={(event) =>
                      updateForm("skipPolicy", event.target.value)
                    }
                    className="input"
                  >
                    <option value="after_delay">After Delay</option>
                    <option value="never">Never Skippable</option>
                  </select>
                </Field>

                <Field label="Skip After Seconds">
                  <input
                    type="number"
                    value={form.skipAfterSeconds}
                    onChange={(event) =>
                      updateForm("skipAfterSeconds", event.target.value)
                    }
                    className="input"
                  />
                </Field>
              </div>

              <label className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
                <input
                  type="checkbox"
                  checked={form.premiumCanSkip}
                  onChange={(event) =>
                    updateForm("premiumCanSkip", event.target.checked)
                  }
                  className="h-4 w-4 accent-sky-300"
                />
                <span className="text-sm font-bold text-white/65">
                  Premium users can skip commercial ads after delay
                </span>
              </label>
            </FormSection>

            <FormSection title="Budget">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Budget Dollars">
                  <input
                    type="number"
                    value={form.budgetDollars}
                    onChange={(event) =>
                      updateForm("budgetDollars", event.target.value)
                    }
                    className="input"
                  />
                </Field>

                <Field label="CPM Dollars">
                  <input
                    type="number"
                    value={form.cpmDollars}
                    onChange={(event) =>
                      updateForm("cpmDollars", event.target.value)
                    }
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Priority">
                  <input
                    type="number"
                    value={form.priority}
                    onChange={(event) =>
                      updateForm("priority", event.target.value)
                    }
                    className="input"
                  />
                </Field>

                <Field label="Max Impressions">
                  <input
                    type="number"
                    value={form.maxImpressions}
                    onChange={(event) =>
                      updateForm("maxImpressions", event.target.value)
                    }
                    className="input"
                    placeholder="Optional"
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Schedule">
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Start Date">
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(event) =>
                      updateForm("startDate", event.target.value)
                    }
                    className="input"
                  />
                </Field>

                <Field label="End Date">
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(event) =>
                      updateForm("endDate", event.target.value)
                    }
                    className="input"
                  />
                </Field>
              </div>
            </FormSection>

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

            <h2 className="mt-2 text-2xl font-black">Campaigns</h2>

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
                    campaign.impressions?.filter(
                      (impression) => impression.clicked
                    ).length || 0;

                  const spent = campaign.spentCents || 0;
                  const remaining = Math.max(
                    0,
                    (campaign.budgetCents || 0) - spent
                  );

                  return (
                    <article
                      key={campaign.id}
                      className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25"
                    >
                      <div className="grid md:grid-cols-[180px_1fr]">
                        <div
                          className="min-h-[180px] bg-zinc-950 bg-cover bg-center"
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

                                <Badge>{campaign.adType}</Badge>
                                <Badge>{campaign.objective}</Badge>
                                <Badge>{placementLabel(campaign.placement)}</Badge>
                                <Badge>
                                  {campaign.adSource === "google"
                                    ? "Google / VAST"
                                    : "Direct"}
                                </Badge>
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

                              <p className="mt-2 text-xs leading-5 text-white/35">
                                Target: {campaign.targetType} • Priority:{" "}
                                {campaign.priority} • Skip:{" "}
                                {campaign.skipPolicy === "never"
                                  ? "Never"
                                  : `${campaign.skipAfterSeconds}s`}
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

                          <div className="mt-5 grid gap-3 md:grid-cols-5">
                            <MiniStat label="Impressions" value={impressions} />
                            <MiniStat label="Completed" value={completed} />
                            <MiniStat label="Clicks" value={clicks} />
                            <MiniStat
                              label="Spent"
                              value={moneyFromCents(spent)}
                            />
                            <MiniStat
                              label="Remaining"
                              value={moneyFromCents(remaining)}
                            />
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

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        {title}
      </p>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
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

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200">
      {children}
    </span>
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

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}