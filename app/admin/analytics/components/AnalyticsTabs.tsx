"use client";

import { useState, type ReactNode } from "react";

type AnalyticsTab =
  | "overview"
  | "editorial"
  | "audience"
  | "advertising"
  | "revenue"
  | "activity"
  | "ai";

type AnalyticsTabsProps = {
  overview: ReactNode;
  editorial: ReactNode;
  audience: ReactNode;
  advertising: ReactNode;
  revenue: ReactNode;
  activity: ReactNode;
  ai: ReactNode;
};

const tabs: Array<{
  id: AnalyticsTab;
  label: string;
}> = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "editorial",
    label: "Editorial",
  },
  {
    id: "audience",
    label: "Audience",
  },
  {
    id: "advertising",
    label: "Advertising",
  },
  {
    id: "revenue",
    label: "Revenue",
  },
  {
    id: "activity",
    label: "Live Activity",
  },
  {
    id: "ai",
    label: "AI Insights",
  },
];

export default function AnalyticsTabs({
  overview,
  editorial,
  audience,
  advertising,
  revenue,
  activity,
  ai,
}: AnalyticsTabsProps) {
  const [activeTab, setActiveTab] =
    useState<AnalyticsTab>("overview");

  const content: Record<AnalyticsTab, ReactNode> = {
    overview,
    editorial,
    audience,
    advertising,
    revenue,
    activity,
    ai,
  };

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.025] p-1.5">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-white/[0.08] text-sky-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "text-white/45 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div>{content[activeTab]}</div>
    </div>
  );
}