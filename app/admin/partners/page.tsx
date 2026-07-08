"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import EmptyState from "@/app/components/admin/EmptyState";
import MetricCard from "@/app/components/admin/MetricCard";
import StatusBadge from "@/app/components/admin/StatusBadge";
import Toolbar from "@/app/components/admin/Toolbar";

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

export default function AdminPartnersPage() {
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(
    null
  );
  const [reviewApplicationId, setReviewApplicationId] = useState<string | null>(
    null
  );
  const [reviewNotes, setReviewNotes] = useState("");

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

  const selectedApplication = applications.find(
    (application) => application.id === reviewApplicationId
  );

  function openReviewModal(
    applicationId: string,
    action: "approve" | "reject"
  ) {
    setReviewApplicationId(applicationId);
    setReviewAction(action);
    setReviewNotes("");
    setReviewModalOpen(true);
  }

  function closeReviewModal() {
    if (savingId) return;

    setReviewModalOpen(false);
    setReviewApplicationId(null);
    setReviewAction(null);
    setReviewNotes("");
  }

  async function updateApplication(
    applicationId: string,
    action: string,
    adminNotes: string
  ) {
    try {
      setSavingId(applicationId);

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
      closeReviewModal();
    } catch (error) {
      console.error("PARTNER APPLICATION UPDATE ERROR:", error);
      alert("Could not update partner application.");
    } finally {
      setSavingId(null);
    }
  }

  async function submitReview() {
    if (!reviewApplicationId || !reviewAction) return;

    if (reviewAction === "reject" && !reviewNotes.trim()) {
      alert("Please add a rejection reason.");
      return;
    }

    await updateApplication(
      reviewApplicationId,
      reviewAction,
      reviewNotes.trim()
    );
  }

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Operations"
        title="Partner Applications"
        description="Review filmmakers, studios, producers, documentarians, and distributors applying to become SourceTV partners."
        actions={
          <button
            onClick={loadApplications}
            className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
          >
            Refresh
          </button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <Toolbar>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`h-11 rounded-xl px-3 text-sm font-medium capitalize transition ${
                  active
                    ? "bg-sky-300 text-[#05070d]"
                    : "border border-white/10 bg-white/[0.035] text-white/55 hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
                }`}
              >
                {filter} ({counts[filter as keyof typeof counts]})
              </button>
            );
          })}
        </div>
      </Toolbar>

      {loading ? (
        <EmptyState title="Loading partner applications..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No applications found."
          description="Try changing the selected application filter."
        />
      ) : (
        <section className="grid gap-4">
          {filtered.map((application) => {
            const saving = savingId === application.id;
            const expanded = expandedId === application.id;

            return (
              <article
                key={application.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/20 hover:bg-white/[0.045] md:p-6"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={application.status} />

                      <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[11px] font-semibold capitalize text-white/55">
                        Current Role: {application.user.role}
                      </span>

                      {application.workType && (
                        <span className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
                          {application.workType}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
                      {application.fullName}
                    </h2>

                    <p className="mt-2 break-words text-sm font-medium text-sky-300">
                      {application.email}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-white/40">
                      {application.company && (
                        <span>Company: {application.company}</span>
                      )}
                      {application.roleTitle && (
                        <span>· Role: {application.roleTitle}</span>
                      )}
                      <span>· Submitted {formatDate(application.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 md:flex-col">
                    {application.status === "pending" && (
                      <>
                        <button
                          disabled={saving}
                          onClick={() =>
                            openReviewModal(application.id, "approve")
                          }
                          className="rounded-xl bg-sky-300 px-4 py-2 text-xs font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Approve"}
                        </button>

                        <button
                          disabled={saving}
                          onClick={() => openReviewModal(application.id, "reject")}
                          className="rounded-xl border border-red-300/25 bg-red-300/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:border-red-300/45 disabled:opacity-50"
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
                      className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
                    >
                      {expanded ? "Hide Details" : "Details"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <InfoBox label="Website" value={application.website || "Not provided"} />
                  <InfoBox label="Portfolio" value={application.portfolio || "Not provided"} />
                  <InfoBox label="Reviewed" value={formatDate(application.reviewedAt)} />
                  <InfoBox label="User Account" value={application.user.email} />
                </div>

                {expanded && (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <TextBox label="Bio" value={application.bio || "No bio provided."} />
                    <TextBox label="Reason" value={application.reason || "No reason provided."} />

                    {application.adminNotes && (
                      <div className="md:col-span-2">
                        <TextBox label="Admin Notes" value={application.adminNotes} />
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {reviewModalOpen && reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#05070d] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
            <div className="border-b border-white/10 px-6 py-5">
              <p
                className={`text-xs font-semibold uppercase tracking-[0.22em] ${
                  reviewAction === "approve" ? "text-sky-300" : "text-red-300"
                }`}
              >
                {reviewAction === "approve"
                  ? "Approve Partner"
                  : "Reject Application"}
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {selectedApplication?.fullName || "Partner Application"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/45">
                {reviewAction === "approve"
                  ? "Add optional approval notes before granting partner access."
                  : "Add a clear rejection reason so the decision is documented."}
              </p>
            </div>

            <div className="px-6 py-6">
              <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                {reviewAction === "approve"
                  ? "Approval Notes"
                  : "Rejection Reason"}
              </label>

              <textarea
                value={reviewNotes}
                onChange={(event) => setReviewNotes(event.target.value)}
                rows={6}
                placeholder={
                  reviewAction === "approve"
                    ? "Example: Approved for partner access. Strong portfolio and clear fit for SourceTV."
                    : "Example: Application rejected because portfolio or rights information was incomplete."
                }
                className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/45 focus:bg-white/[0.055]"
              />

              {reviewAction === "reject" && (
                <p className="mt-2 text-xs font-medium text-red-300/80">
                  Rejection reason is required.
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={!!savingId}
                  onClick={closeReviewModal}
                  className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-xs font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!!savingId}
                  onClick={submitReview}
                  className={`rounded-xl px-5 py-3 text-xs font-semibold transition disabled:opacity-50 ${
                    reviewAction === "approve"
                      ? "bg-sky-300 text-[#05070d] hover:bg-sky-200"
                      : "border border-red-300/25 bg-red-300/10 text-red-300 hover:border-red-300/45"
                  }`}
                >
                  {savingId
                    ? "Saving..."
                    : reviewAction === "approve"
                    ? "Approve Partner"
                    : "Reject Partner"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-white/65">
        {value}
      </p>
    </div>
  );
}

function TextBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/55">{value}</p>
    </div>
  );
}
