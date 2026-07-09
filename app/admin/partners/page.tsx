"use client";

import { filters } from "./constants";
import { formatDate } from "./utils";
import PartnerReviewModal from "./components/PartnerReviewModal";
import InfoBox from "@/app/components/admin/InfoBox";
import TextBox from "@/app/components/admin/TextBox";
import { useEffect, useMemo, useState } from "react";
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

<PartnerReviewModal
  open={reviewModalOpen}
  action={reviewAction}
  application={selectedApplication}
  notes={reviewNotes}
  setNotes={setReviewNotes}
  saving={Boolean(savingId)}
  savingCurrent={
    reviewApplicationId !== null && savingId === reviewApplicationId
  }
  onClose={closeReviewModal}
  onSubmit={submitReview}
  />
</main>
  );
}