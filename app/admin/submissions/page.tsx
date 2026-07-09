"use client";

import { useEffect, useState } from "react";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import EmptyState from "@/app/components/admin/EmptyState";
import StatusBadge from "@/app/components/admin/StatusBadge";

type Submission = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  status: string;
};

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function fetchSubmissions() {
    try {
      setLoading(true);

      const res = await fetch("/api/submissions", {
        cache: "no-store",
      });

      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("SUBMISSIONS LOAD ERROR:", error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      setSavingId(id);

      await fetch("/api/submissions/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      await fetchSubmissions();
    } catch (error) {
      console.error("SUBMISSION UPDATE ERROR:", error);
      alert("Could not update submission.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Intake"
        title="Submissions"
        description="Review incoming project submissions and make quick approval decisions before deeper content review."
        actions={
          <button
            type="button"
            onClick={fetchSubmissions}
            className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
          >
            Refresh
          </button>
        }
      />

      {loading ? (
        <EmptyState title="Loading submissions..." />
      ) : submissions.length === 0 ? (
        <EmptyState
          title="No submissions found."
          description="New submissions will appear here when creators send projects for review."
        />
      ) : (
        <section className="grid gap-4">
          {submissions.map((submission) => {
            const saving = savingId === submission.id;

            return (
              <article
                key={submission.id}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/20 hover:bg-white/[0.045] md:p-6"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={submission.status} />

                      {(submission.type || submission.genre) && (
                        <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[11px] font-semibold text-white/50">
                          {submission.type || "Title"}
                          {submission.genre ? ` • ${submission.genre}` : ""}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-4 text-xl font-semibold tracking-tight text-white md:text-2xl">
                      {submission.title}
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
                      {submission.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 md:flex-col">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => updateStatus(submission.id, "approved")}
                      className="rounded-xl bg-sky-300 px-4 py-2 text-xs font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => updateStatus(submission.id, "denied")}
                      className="rounded-xl border border-red-300/25 bg-red-300/10 px-4 py-2 text-xs font-semibold text-red-300 transition hover:border-red-300/45 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}