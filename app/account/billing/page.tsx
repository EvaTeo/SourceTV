"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type PlatformSettings = {
  platformName: string;
  premiumEnabled: boolean;
  monthlyPrice: number;
  annualPrice: number;
  freeTrialDays: number;
};

type SubscriptionStatus = {
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionPriceId?: string | null;
  subscriptionEndsAt?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  isPremium: boolean;
  error?: string;
};

const defaultSettings: PlatformSettings = {
  platformName: "SourceTV",
  premiumEnabled: false,
  monthlyPrice: 8.99,
  annualPrice: 89.99,
  freeTrialDays: 7,
};

function formatDate(value?: string | null) {
  if (!value) {
    return "Not active";
  }

  try {
    return new Date(value).toLocaleDateString(
      undefined,
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  } catch {
    return "Not active";
  }
}

function formatStatus(value?: string | null) {
  if (!value) {
    return "Inactive";
  }

  return value.replaceAll("_", " ");
}

export default function BillingPage() {
  const [settings, setSettings] =
    useState<PlatformSettings>(
      defaultSettings
    );

  const [subscription, setSubscription] =
    useState<SubscriptionStatus | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [working, setWorking] =
    useState(false);

  async function loadSubscription() {
    try {
      const response = await fetch(
        "/api/stripe/subscription",
        {
          cache: "no-store",
        }
      );

      const data: unknown =
        await response.json();

      setSubscription(
        data as SubscriptionStatus
      );
    } catch (error) {
      console.error(
        "LOAD SUBSCRIPTION ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSubscription();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const response = await fetch(
          "/api/settings",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data: unknown =
          await response.json();

        if (
          cancelled ||
          !data ||
          typeof data !== "object"
        ) {
          return;
        }

        const result = data as {
          platformName?: unknown;
          premiumEnabled?: unknown;
          monthlyPrice?: unknown;
          annualPrice?: unknown;
          freeTrialDays?: unknown;
        };

        setSettings({
          platformName:
            typeof result.platformName ===
              "string" &&
            result.platformName.trim()
              ? result.platformName.trim()
              : defaultSettings.platformName,

          premiumEnabled:
            typeof result.premiumEnabled ===
            "boolean"
              ? result.premiumEnabled
              : defaultSettings.premiumEnabled,

          monthlyPrice:
            typeof result.monthlyPrice ===
              "number" &&
            Number.isFinite(
              result.monthlyPrice
            )
              ? result.monthlyPrice
              : defaultSettings.monthlyPrice,

          annualPrice:
            typeof result.annualPrice ===
              "number" &&
            Number.isFinite(
              result.annualPrice
            )
              ? result.annualPrice
              : defaultSettings.annualPrice,

          freeTrialDays:
            typeof result.freeTrialDays ===
              "number" &&
            Number.isFinite(
              result.freeTrialDays
            )
              ? Math.max(
                  0,
                  Math.round(
                    result.freeTrialDays
                  )
                )
              : defaultSettings.freeTrialDays,
        });
      } catch (error) {
        console.error(
          "LOAD PREMIUM SETTINGS ERROR:",
          error
        );
      }
    }

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  async function upgradeToPremium() {
    if (!settings.premiumEnabled) {
      return;
    }

    try {
      setWorking(true);

      const response = await fetch(
        "/api/stripe/create-checkout-session",
        {
          method: "POST",
        }
      );

      const data: unknown =
        await response.json();

      const result = data as {
        url?: string;
        error?: string;
      };

      if (
        !response.ok ||
        !result.url
      ) {
        throw new Error(
          result.error ||
            "Could not start checkout."
        );
      }

      window.location.href =
        result.url;
    } catch (error) {
      console.error(
        "UPGRADE ERROR:",
        error
      );

      alert(
        "Could not start Premium checkout."
      );
    } finally {
      setWorking(false);
    }
  }

  async function manageBilling() {
    try {
      setWorking(true);

      const response = await fetch(
        "/api/stripe/customer-portal",
        {
          method: "POST",
        }
      );

      const data: unknown =
        await response.json();

      const result = data as {
        url?: string;
        error?: string;
      };

      if (
        !response.ok ||
        !result.url
      ) {
        throw new Error(
          result.error ||
            "Could not open billing portal."
        );
      }

      window.location.href =
        result.url;
    } catch (error) {
      console.error(
        "BILLING PORTAL ERROR:",
        error
      );

      alert(
        "Could not open billing portal."
      );
    } finally {
      setWorking(false);
    }
  }

  const isPremium =
    subscription?.isPremium === true;

  const renewalDate = formatDate(
    subscription?.subscriptionEndsAt
  );

  const statusLabel = formatStatus(
    subscription?.subscriptionStatus
  );

  const planName = loading
    ? "Loading..."
    : isPremium
      ? "Premium"
      : "Free";

  const premiumFeatures = useMemo(
    () => [
      "Skip eligible commercial ads",
      "Premium streaming quality",
      "Early access to new SourceTV features",
      "Support independent creators",
    ],
    []
  );

  const trialDescription =
    settings.freeTrialDays > 0
      ? `Start your ${settings.freeTrialDays}-day free trial, then continue for $${settings.monthlyPrice.toFixed(2)}/month.`
      : `Upgrade for $${settings.monthlyPrice.toFixed(2)}/month. Cancel anytime.`;

  return (
    <main className="min-h-screen overflow-hidden bg-black px-4 pb-24 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.18),transparent_34%),radial-gradient(circle_at_82%_15%,rgba(250,204,21,0.1),transparent_28%),linear-gradient(to_bottom,#020617,black_48%,black)]" />

      <div className="relative mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.65)] backdrop-blur-2xl md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 left-16 h-72 w-72 rounded-full bg-yellow-300/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-yellow-100">
                <span>👑</span>
                {settings.platformName} Membership
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[0.92] tracking-tight md:text-7xl">
                Billing, Premium, and your{" "}
                {settings.platformName} account.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
                {settings.platformName} is free to
                join. Premium is optional and
                unlocks a smoother viewing
                experience with skippable eligible
                commercial ads, premium streaming
                quality, and future member perks.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <Link
                  href="/browse"
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200"
                >
                  Back to Browse
                </Link>

                <Link
                  href="/watchlist"
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200"
                >
                  Watchlist
                </Link>

                <Link
                  href="/profiles"
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200"
                >
                  Profiles
                </Link>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-[2rem] border border-sky-300/20 bg-sky-400/10 p-5 shadow-[0_0_55px_rgba(56,189,248,0.12)]">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-200">
                Current Plan
              </p>

              <p className="mt-3 text-3xl font-black">
                {planName}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isPremium
                      ? "bg-emerald-300"
                      : "bg-white/35"
                  }`}
                />

                <p className="text-sm font-bold capitalize text-white/60">
                  {loading
                    ? "Checking status"
                    : isPremium
                      ? "Premium active"
                      : "Free account"}
                </p>
              </div>

              <p className="mt-3 text-xs leading-5 text-white/45">
                {isPremium
                  ? "Your Premium benefits are active on this account."
                  : "No credit card required for the free plan."}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-2xl md:p-8">
            <div className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-yellow-300/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-yellow-200">
                    Membership
                  </p>

                  <h2 className="mt-2 text-3xl font-black md:text-4xl">
                    {loading
                      ? "Checking account..."
                      : isPremium
                        ? "Premium Membership"
                        : "Free Membership"}
                  </h2>
                </div>

                <div
                  className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] ${
                    isPremium
                      ? "border-yellow-300/35 bg-yellow-300/12 text-yellow-100"
                      : "border-white/10 bg-white/[0.04] text-white/45"
                  }`}
                >
                  {isPremium
                    ? "Active"
                    : "Free"}
                </div>
              </div>

              <div className="mt-7 rounded-[2rem] border border-white/10 bg-black/30 p-5">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/35">
                      Plan
                    </p>

                    <p className="mt-2 text-2xl font-black">
                      {isPremium
                        ? "Premium Monthly"
                        : `${settings.platformName} Free`}
                    </p>
                  </div>

                  <p className="text-right text-3xl font-black text-sky-300">
                    {isPremium
                      ? `$${settings.monthlyPrice.toFixed(2)}`
                      : "$0"}

                    <span className="text-sm font-bold text-white/35">
                      /mo
                    </span>
                  </p>
                </div>

                <div className="mt-5 grid gap-3">
                  <StatusRow
                    label="Tier"
                    value={
                      subscription?.subscriptionTier ||
                      "free"
                    }
                  />

                  <StatusRow
                    label="Status"
                    value={
                      loading
                        ? "checking"
                        : statusLabel
                    }
                  />

                  <StatusRow
                    label={
                      isPremium
                        ? "Next Billing"
                        : "Renewal / Ends"
                    }
                    value={renewalDate}
                  />

                  <StatusRow
                    label="Auto Renew"
                    value={
                      isPremium
                        ? "On"
                        : "Not active"
                    }
                  />
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                {isPremium ? (
                  <button
                    type="button"
                    onClick={() => {
                      void manageBilling();
                    }}
                    disabled={working}
                    className="rounded-full bg-white px-6 py-4 text-sm font-black text-black shadow-[0_16px_38px_rgba(255,255,255,0.13)] transition hover:scale-[1.015] hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {working
                      ? "Opening..."
                      : "Manage Membership"}
                  </button>
                ) : settings.premiumEnabled ? (
                  <button
                    type="button"
                    onClick={() => {
                      void upgradeToPremium();
                    }}
                    disabled={working}
                    className="rounded-full bg-sky-400 px-6 py-4 text-sm font-black text-black shadow-[0_0_38px_rgba(56,189,248,0.35)] transition hover:scale-[1.015] hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {working
                      ? "Starting Checkout..."
                      : `Upgrade for $${settings.monthlyPrice.toFixed(2)}`}
                  </button>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center text-sm font-semibold text-white/55">
                    Premium memberships are
                    currently unavailable.
                  </div>
                )}

                <p className="text-center text-xs leading-5 text-white/40">
                  Free accounts remain free
                  forever. Premium is optional.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-gradient-to-br from-sky-950/35 via-white/[0.045] to-black p-6 shadow-2xl backdrop-blur-2xl md:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-400/18 blur-3xl" />

            <div className="relative">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
                Premium Benefits
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                {settings.premiumEnabled
                  ? `Upgrade for $${settings.monthlyPrice.toFixed(2)}/month.`
                  : "Premium is currently unavailable."}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
                {settings.premiumEnabled
                  ? trialDescription
                  : `${settings.platformName} Premium upgrades are temporarily closed. Existing Premium members can still manage their memberships.`}
              </p>

              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/50">
                Annual plan:{" "}
                <span className="font-black text-sky-300">
                  $
                  {settings.annualPrice.toFixed(
                    2
                  )}
                  /year
                </span>
              </div>

              <div className="mt-7 grid gap-3">
                {premiumFeatures.map(
                  (feature, index) => (
                    <BenefitRow
                      key={feature}
                      number={index + 1}
                      title={feature}
                      active={isPremium}
                    />
                  )
                )}
              </div>

              <div className="mt-7 rounded-[1.7rem] border border-white/10 bg-black/30 p-5">
                <p className="text-sm font-black text-white/80">
                  Premium is built for
                  convenience.
                </p>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  The free{" "}
                  {settings.platformName}{" "}
                  experience stays available.
                  Premium simply gives members a
                  smoother viewing experience and
                  helps fund future features,
                  original content, and partner
                  tools.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <MiniCard
            label="Free accounts"
            title="Always available"
            text="Create profiles, save titles, and continue watching without a credit card."
          />

          <MiniCard
            label="Premium"
            title={
              settings.premiumEnabled
                ? "Optional upgrade"
                : "Currently unavailable"
            }
            text={
              settings.premiumEnabled
                ? `Upgrade for $${settings.monthlyPrice.toFixed(2)}/month when you want skippable eligible ads and member benefits.`
                : "Premium upgrades are currently closed, but free streaming remains available."
            }
          />

          <MiniCard
            label="Billing"
            title="Managed securely"
            text="Membership payments and subscription management are handled through Stripe."
          />
        </section>
      </div>
    </main>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
      <p className="font-bold text-white/48">
        {label}
      </p>

      <p className="text-right font-black capitalize text-sky-300">
        {value}
      </p>
    </div>
  );
}

function BenefitRow({
  number,
  title,
  active,
}: {
  number: number;
  title: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
          active
            ? "bg-yellow-300 text-black"
            : "bg-sky-400 text-black"
        }`}
      >
        {active ? "✓" : number}
      </div>

      <p className="font-bold text-white/78">
        {title}
      </p>
    </div>
  );
}

function MiniCard({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
        {label}
      </p>

      <h3 className="mt-2 text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-white/45">
        {text}
      </p>
    </div>
  );
}