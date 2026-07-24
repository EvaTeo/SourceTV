"use client";

import Link from "next/link";
import AttentionPanel from "./components/AttentionPanel";
import DashboardHeader from "./components/DashboardHeader";
import EmptyProjects from "./components/EmptyProjects";
import ProjectRow from "./components/ProjectRow";
import QuickLink from "./components/QuickLink";
import StatCard from "./components/StatCard";
import usePartnerDashboard from "./hooks/usePartnerDashboard";

export default function PartnerDashboardClient() {
  const {
    loading,
    stats,
    recentProjects,
    attentionProjects,
  } = usePartnerDashboard();

  return (
    <div className="mx-auto w-full max-w-[1180px] pb-16">
      <DashboardHeader />

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Works"
          value={stats.total}
        />

        <StatCard
          label="In Review"
          value={stats.inReview}
        />

        <StatCard
          label="Scheduled"
          value={stats.scheduled}
        />

        <StatCard
          label="Published"
          value={stats.published}
        />
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <QuickLink
          title="Projects"
          description="Manage your submitted work"
          href="/partner/projects"
        />

        <QuickLink
          title="Contracts"
          description="Review agreements and updates"
          href="/partner/contracts"
        />

        <QuickLink
          title="Inbox"
          description="Read messages from SourceTV"
          href="/partner/inbox"
        />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_340px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-sky-300">
                My Work
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Recent projects
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Your latest submissions and publishing
                updates.
              </p>
            </div>

            <Link
              href="/partner/projects"
              className="w-fit rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-black text-white/60 transition hover:border-sky-300/30 hover:text-white"
            >
              View All
            </Link>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-sm text-white/40">
                Loading projects...
              </div>
            ) : recentProjects.length === 0 ? (
              <EmptyProjects />
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <AttentionPanel
          loading={loading}
          projects={attentionProjects}
        />
      </section>
    </div>
  );
}