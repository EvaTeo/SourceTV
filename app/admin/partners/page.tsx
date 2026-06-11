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
  if (status === "approved") return "bg-green-400 text-black";
  if (status === "rejected") return "bg-red-500 text-white";
  return "bg-yellow-400 text-black";
}

export default function AdminPartnersPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [savingId, setSavingId] = useState<string | null>(null);

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
    <main className="min-h-screen bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
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

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl md:p-5">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full border px-5 py-3 text-xs font-black uppercase tracking-[0.14em] transition ${
                  activeFilter === filter
                    ? "border-sky-300 bg-sky-400 text-black shadow-[0_0_24px_rgba(56,189,248,0.35)]"
                    : "border-white/10 bg-white/[0.04] text-white/55 hover:border-sky-300/40 hover:text-sky-200"
                }`}
              >
                {filter} ({counts[filter as keyof typeof counts]})
              </button>
            ))}
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

              return (
                <article
                  key={application.id}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${badgeClass(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                        <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                          Current Role: {application.user.role}
                        </span>
                      </div>

                      <h2 className="mt-4 text-2xl font-black md:text-4xl">
                        {application.fullName}
                      </h2>

                      <p className="mt-2 text-sm font-bold text-sky-300">
                        {application.email}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-white/45">
                        {application.company && (
                          <span>Company: {application.company}</span>
                        )}
                        {application.roleTitle && (
                          <span>• Role: {application.roleTitle}</span>
                        )}
                        {application.workType && (
                          <span>• Work: {application.workType}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-row gap-2 md:flex-col">
                      {application.status === "pending" && (
                        <>
                          <button
                            disabled={saving}
                            onClick={() =>
                              updateApplication(application.id, "approve")
                            }
                            className="rounded-full bg-sky-400 px-5 py-3 text-xs font-black text-black transition hover:bg-sky-300 disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Approve Partner"}
                          </button>

                          <button
                            disabled={saving}
                            onClick={() =>
                              updateApplication(application.id, "reject")
                            }
                            className="rounded-full border border-red-400/30 bg-red-500/10 px-5 py-3 text-xs font-black text-red-300 transition hover:border-red-400/60 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <InfoBox
                      label="Website"
                      value={application.website || "Not provided"}
                    />
                    <InfoBox
                      label="Portfolio / IMDb / Reel"
                      value={application.portfolio || "Not provided"}
                    />
                    <InfoBox
                      label="Submitted"
                      value={formatDate(application.createdAt)}
                    />
                    <InfoBox
                      label="Reviewed"
                      value={formatDate(application.reviewedAt)}
                    />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
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
                    <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                        Admin Notes
                      </p>
                      <p className="mt-3 text-sm leading-7 text-white/60">
                        {application.adminNotes}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
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