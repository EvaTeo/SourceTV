"use client";

import { useEffect, useMemo, useState } from "react";

type PartnerApplication = {
  id: string;
  fullName: string;
  email: string;
  company?: string | null;
  roleTitle?: string | null;
  website?: string | null;
  portfolio?: string | null;
  workType?: string | null;
  bio?: string | null;
  reason?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  user: {
    id: string;
    name?: string | null;
    email: string;
    role: string;
  };
};

const filters = ["all", "pending", "approved", "rejected"];

function formatDate(date?: string | null) {
  if (!date) return "Not reviewed";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function badgeClass(status: string) {
  if (status === "approved")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (status === "rejected")
    return "border-red-400/40 bg-red-500/12 text-red-200";

  return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
}

export default function AdminPartnersPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function loadApplications() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/partner-applications", {
        cache: "no-store",
      });

      if (res.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("PARTNER APPLICATION LOAD ERROR:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const counts = useMemo(() => {
    return {
      all: applications.length,
      pending: applications.filter((app) => app.status === "pending").length,
      approved: applications.filter((app) => app.status === "approved").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    };
  }, [applications]);

  const stats = useMemo(() => {
    return [
      { label: "Total", value: applications.length },
      { label: "Pending", value: counts.pending },
      { label: "Approved", value: counts.approved },
      { label: "Rejected", value: counts.rejected },
    ];
  }, [applications.length, counts]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return applications;
    return applications.filter((app) => app.status === activeFilter);
  }, [applications, activeFilter]);

  async function updateApplication(applicationId: string, action: string) {
    try {
      setSavingId(applicationId);

      const adminNotes =
        window.prompt(
          action === "approve"
            ? "Approval notes for this partner?"
            : "Why is this application being rejected?"
        ) || "";

      const res = await fetch("/api/admin/partner-applications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId,
          action,
          adminNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not update application");
        return;
      }

      await loadApplications();
    } catch (error) {
      console.error("PARTNER APPLICATION UPDATE ERROR:", error);
      alert("Could not update partner application.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              SourceTV Operations
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
              Partner Applications
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
              Review filmmakers, studios, producers, documentarians, and
              distributors applying to become SourceTV partners.
            </p>
          </div>

          <button
            onClick={loadApplications}
            className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200"
          >
            Refresh
          </button>
        </div>

        <section className="mt-8 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <AdminStat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </section>

        <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex gap-5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 border-b-2 pb-2 text-[11px] font-black uppercase tracking-[0.15em] transition ${
                    active
                      ? "border-sky-300 text-sky-300"
                      : "border-transparent text-white/38 hover:text-white/72"
                  }`}
                >
                  {filter} ({counts[filter as keyof typeof counts]})
                </button>
              );
            })}
          </div>
        </section>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            Loading partner applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            No applications found for this view.
          </div>
        ) : (
          <section className="mt-8 grid gap-5">
            {filtered.map((application) => {
              const saving = savingId === application.id;
              const expanded = expandedId === application.id;

              return (
                <article
                  key={application.id}
                  className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-sky-300/20 md:p-6"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] backdrop-blur-xl ${badgeClass(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                        <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/60">
                          Current Role: {application.user.role}
                        </span>

                        {application.workType && (
                          <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200">
                            {application.workType}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 text-2xl font-black leading-tight md:text-4xl">
                        {application.fullName}
                      </h2>

                      <p className="mt-2 break-words text-sm font-bold text-sky-300">
                        {application.email}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-white/45">
                        {application.company && (
                          <span>Company: {application.company}</span>
                        )}
                        {application.roleTitle && (
                          <span>• Role: {application.roleTitle}</span>
                        )}
                        <span>• Submitted {formatDate(application.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 md:flex-col">
                      {application.status === "pending" && (
                        <>
                          <button
                            disabled={saving}
                            onClick={() =>
                              updateApplication(application.id, "approve")
                            }
                            className="rounded-md bg-sky-400 px-5 py-3 text-xs font-black text-black transition hover:bg-sky-300 disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Approve"}
                          </button>

                          <button
                            disabled={saving}
                            onClick={() =>
                              updateApplication(application.id, "reject")
                            }
                            className="rounded-md border border-red-400/30 bg-red-500/10 px-5 py-3 text-xs font-black text-red-300 transition hover:border-red-400/60 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(expanded ? null : application.id)
                        }
                        className="rounded-md border border-white/10 bg-white/[0.035] px-5 py-3 text-xs font-black text-white/50 transition hover:border-white/25 hover:text-white"
                      >
                        {expanded ? "Hide Details" : "Details"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-4">
                    <InfoBox
                      label="Website"
                      value={application.website || "Not provided"}
                    />
                    <InfoBox
                      label="Portfolio / IMDb / Reel"
                      value={application.portfolio || "Not provided"}
                    />
                    <InfoBox
                      label="Reviewed"
                      value={formatDate(application.reviewedAt)}
                    />
                    <InfoBox
                      label="User Account"
                      value={application.user.email}
                    />
                  </div>

                  <div
                    className={`grid transition-all duration-300 ${
                      expanded
                        ? "mt-6 grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextBox
                          label="Bio"
                          value={application.bio || "No bio provided."}
                        />
                        <TextBox
                          label="Reason"
                          value={application.reason || "No reason provided."}
                        />
                      </div>

                      {application.adminNotes && (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                            Admin Notes
                          </p>
                          <p className="mt-3 text-sm leading-7 text-white/60">
                            {application.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-bold text-white/70">
        {value}
      </p>
    </div>
  );
}

function TextBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/60">{value}</p>
    </div>
  );
}