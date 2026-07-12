"use client";

import Link from "next/link";
import AccountAction from "./AccountAction";
import AccountCard from "./AccountCard";
import AccountSection from "./AccountSection";

type AccountUser = {
  id: string;
  name?: string | null;
  email: string;
  subscriptionTier?: string | null;
  subscriptionStatus?: string | null;
};

function getDisplayName(user: AccountUser) {
  const accountName = user.name?.trim();

  if (accountName) {
    return accountName;
  }

  const emailName = user.email
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  if (!emailName) {
    return "SourceTV Member";
  }

  return emailName.replace(/\b\w/g, (letter) =>
    letter.toUpperCase()
  );
}

function getPlanLabel(user: AccountUser) {
  const tier = user.subscriptionTier?.trim();

  if (!tier || tier.toLowerCase() === "free") {
    return "Free";
  }

  return tier.replace(/\b\w/g, (letter) =>
    letter.toUpperCase()
  );
}

function getStatusLabel(user: AccountUser) {
  const status = user.subscriptionStatus?.trim();

  if (!status) {
    return "Active";
  }

  return status.replace(/\b\w/g, (letter) =>
    letter.toUpperCase()
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />

      <path
        d="M5 20c.7-4 3-6 7-6s6.3 2 7 6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />

      <path
        d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.5 1a8 8 0 0 0-2-1.2L14 3h-4l-.4 2.7a8 8 0 0 0-2 1.2l-2.5-1-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.5-1a8 8 0 0 0 2 1.2L10 21h4l.4-2.7a8 8 0 0 0 2-1.2l2.5 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BillingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
      />

      <path d="M3.5 10h17" />

      <path
        d="M7 14h4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="11"
        rx="2"
      />

      <path
        d="M9 20h6"
        strokeLinecap="round"
      />

      <path
        d="M12 15v5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PrivacyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[1.8]"
      aria-hidden="true"
    >
      <path
        d="M12 3 5 6v5c0 4.6 2.7 8 7 10 4.3-2 7-5.4 7-10V6l-7-3Z"
        strokeLinejoin="round"
      />

      <path
        d="m9.5 12 1.7 1.7 3.6-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AccountOverview({
  user,
}: {
  user: AccountUser;
}) {
  const displayName = getDisplayName(user);
  const planLabel = getPlanLabel(user);
  const statusLabel = getStatusLabel(user);

  const initial =
    displayName.charAt(0).toUpperCase() || "S";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-24 pt-28 text-white md:px-12 md:pb-20 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.06),transparent_28%),linear-gradient(to_bottom,#020617_0%,#000_68%)]" />

      <div className="pointer-events-none absolute inset-x-0 bottom-[-18vh] h-[42vh] bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.11),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.36em] text-sky-300 md:text-xs">
            SourceTV Account
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
            Account
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
            Manage your account, viewing preferences,
            profiles, subscription, and privacy settings.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <AccountCard>
            <AccountSection
              eyebrow="Membership"
              title="Account Details"
              description="Your SourceTV account information and profile access."
            />

            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.35rem] border border-sky-300/30 bg-gradient-to-br from-sky-300 to-blue-700 text-3xl font-black text-white shadow-[0_0_30px_rgba(56,189,248,0.25)]">
                {initial}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xl font-black text-white">
                  {displayName}
                </p>

                <p className="mt-1 truncate text-sm text-white/42">
                  {user.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-white/52">
                    Member
                  </span>

                  <span className="rounded-full border border-sky-300/25 bg-sky-300/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-sky-200">
                    {planLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 grid gap-3">
              <AccountAction
                href="/profiles"
                label="Manage Profiles"
                description="Edit profile names, photos, and viewing identities."
                icon={<UserIcon />}
              />

              <AccountAction
                href="/account/settings"
                label="Viewing Settings"
                description="Autoplay, previews, accessibility, and playback preferences."
                icon={<SettingsIcon />}
              />
            </div>
          </AccountCard>

          <AccountCard>
            <AccountSection
              eyebrow="Plan"
              title={`${planLabel} Plan`}
              description={`Your subscription is currently ${statusLabel.toLowerCase()}.`}
              action={
                <span className="rounded-full border border-sky-300/25 bg-sky-300/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200">
                  {statusLabel}
                </span>
              }
            />

            <div className="mt-6 rounded-[1.2rem] border border-white/[0.07] bg-black/25 p-5">
              <p className="text-sm font-bold text-white/45">
                Current plan
              </p>

              <p className="mt-2 text-3xl font-black tracking-tight text-white">
                {planLabel}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/38">
                Free viewing remains available. Premium is
                an optional upgrade for enhanced features
                and fewer interruptions.
              </p>
            </div>

            <div className="mt-4">
              <AccountAction
                href="/account/billing"
                label="Manage Subscription"
                description="Review plans, billing, and payment details."
                icon={<BillingIcon />}
              />
            </div>
          </AccountCard>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <AccountCard>
            <AccountSection
              eyebrow="Security"
              title="Devices & Access"
              description="Review the devices currently connected to your SourceTV account."
            />

            <div className="mt-6">
              <AccountAction
                label="Connected Devices"
                description="Device management will appear here when session tracking is enabled."
                icon={<DeviceIcon />}
              />
            </div>

            <button
              type="button"
              disabled
              className="mt-4 w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm font-bold text-white/25"
            >
              Sign Out of All Devices
            </button>
          </AccountCard>

          <AccountCard>
            <AccountSection
              eyebrow="Privacy"
              title="Your Data"
              description="Manage your privacy and SourceTV account data."
            />

            <div className="mt-6 grid gap-3">
              <AccountAction
                label="Download My Data"
                description="Data export will be available before public launch."
                icon={<PrivacyIcon />}
              />

              <AccountAction
                label="Delete Account"
                description="Permanent account deletion will require identity confirmation."
                danger
              />
            </div>
          </AccountCard>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/browse"
            className="rounded-md bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-sky-200"
          >
            Back to Browse
          </Link>

          <Link
            href="/account/settings"
            className="rounded-md border border-white/12 bg-white/[0.04] px-6 py-3 text-sm font-black text-white/62 transition hover:border-sky-300/35 hover:bg-sky-300/[0.07] hover:text-sky-100"
          >
            Open Settings
          </Link>
        </div>
      </div>
    </main>
  );
}