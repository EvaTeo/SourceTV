"use client";

import type { PlatformSettings } from "../types";

type Props = {
  settings: PlatformSettings;
  update: <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => void;
};

export default function PremiumSettings({
  settings,
  update,
}: Props) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
            Premium
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Subscription Settings
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Configure SourceTV Premium, pricing, trials,
            advertising behavior, and subscriber benefits.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <ToggleCard
            title="Enable Premium"
            description="Allow users to subscribe to SourceTV Premium."
            checked={settings.premiumEnabled}
            onToggle={() =>
              update(
                "premiumEnabled",
                !settings.premiumEnabled
              )
            }
          />

          <InfoCard
            title="Current Plan"
            value={
              settings.premiumEnabled
                ? "Premium Enabled"
                : "Free Platform"
            }
          />

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          <InputCard
            title="Monthly Price"
            value={settings.monthlyPrice}
            onChange={(value) =>
              update("monthlyPrice", value)
            }
            prefix="$"
          />

          <InputCard
            title="Annual Price"
            value={settings.annualPrice}
            onChange={(value) =>
              update("annualPrice", value)
            }
            prefix="$"
          />

          <InputCard
            title="Free Trial"
            value={settings.freeTrialDays}
            onChange={(value) =>
              update("freeTrialDays", value)
            }
            suffix="Days"
          />

        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">

        <FeatureCard
          title="Premium Benefits"
          items={[
            "Ad-Free Streaming",
            "Higher Quality Playback",
            "Priority Streaming Servers",
            "Future Offline Downloads",
            "Exclusive Originals",
          ]}
        />

        <FeatureCard
          title="Free Users"
          items={[
            "Advertisements",
            "Watchlists",
            "Continue Watching",
            "Profiles",
            "Standard Quality",
          ]}
        />

        <FeatureCard
          title="Coming Soon"
          items={[
            "Family Plans",
            "Student Discount",
            "Gift Memberships",
            "Annual Discounts",
            "Premium Originals",
          ]}
        />

      </section>
    </div>
  );
}

function ToggleCard({
  title,
  description,
  checked,
  onToggle,
}:{
  title:string;
  description:string;
  checked:boolean;
  onToggle:()=>void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex justify-between gap-4">

        <div>
          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="mt-2 text-sm text-white/40">
            {description}
          </p>
        </div>

        <button
          onClick={onToggle}
          className={`h-7 w-12 rounded-full transition ${
            checked
              ? "bg-sky-300"
              : "bg-white/10"
          }`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white transition ${
              checked
                ? "translate-x-6"
                : "translate-x-1"
            }`}
          />
        </button>

      </div>
    </div>
  );
}

function InputCard({
  title,
  value,
  onChange,
  prefix,
  suffix,
}:{
  title:string;
  value:number;
  onChange:(value:number)=>void;
  prefix?:string;
  suffix?:string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-sm font-semibold text-white">
        {title}
      </p>

      <div className="mt-4 flex items-center gap-2">

        {prefix && (
          <span className="text-white/50">
            {prefix}
          </span>
        )}

        <input
          type="number"
          value={value}
          onChange={(e)=>
            onChange(Number(e.target.value))
          }
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white"
        />

        {suffix && (
          <span className="text-white/50">
            {suffix}
          </span>
        )}

      </div>

    </div>
  );
}

function InfoCard({
  title,
  value,
}:{
  title:string;
  value:string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-white/45">
        {title}
      </p>

      <h3 className="mt-3 text-2xl font-semibold text-white">
        {value}
      </h3>
    </div>
  );
}

function FeatureCard({
  title,
  items,
}:{
  title:string;
  items:string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">

      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <div className="mt-5 space-y-3">

        {items.map((item)=>(
          <div
            key={item}
            className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}