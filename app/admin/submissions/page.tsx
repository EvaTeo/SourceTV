"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import EmptyState from "@/app/components/admin/EmptyState";

import LoadingSubmissions from "./components/LoadingSubmissions";
import NoticeBanner from "./components/NoticeBanner";
import QueueMetricCard from "./components/QueueMetricCard";
import SubmissionCard from "./components/SubmissionCard";

import {
  RefreshIcon,
  SearchIcon,
  SearchLargeIcon,
} from "./components/SubmissionIcons";

import {
  fetchSubmissions as fetchSubmissionsFromApi,
  updateSubmissionStatus,
} from "./lib/submissionsApi";

import type {
  Notice,
  StatusFilter,
  Submission,
} from "./types";

import {
  STATUS_OPTIONS,
  filterSubmissions,
  getSubmissionMetrics,
  normalizeStatus,
} from "./utils";

export default function AdminSubmissionsPage() {
  const [
    submissions,
    setSubmissions,
  ] = useState<Submission[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    savingId,
    setSavingId,
  ] = useState<string | null>(
    null
  );

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "all"
    );

  const [
    expandedId,
    setExpandedId,
  ] = useState<string | null>(
    null
  );

  const [notice, setNotice] =
    useState<Notice | null>(
      null
    );

  const fetchSubmissions =
    useCallback(
      async (
        showRefreshState =
          false
      ) => {
        try {
          if (
            showRefreshState
          ) {
            setRefreshing(
              true
            );
          } else {
            setLoading(true);
          }

          setNotice(null);

          const nextSubmissions =
            await fetchSubmissionsFromApi();

          setSubmissions(
            nextSubmissions
          );
        } catch (error) {
          console.error(
            "SUBMISSIONS LOAD ERROR:",
            error
          );

          setSubmissions([]);

          setNotice({
            type: "error",

            message:
              error instanceof
              Error
                ? error.message
                : "SourceTV could not load the submission queue.",
          });
        } finally {
          setLoading(false);
          setRefreshing(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    void fetchSubmissions();
  }, [fetchSubmissions]);

  async function updateStatus(
    submission: Submission,
    status:
      | "approved"
      | "denied"
  ) {
    if (status === "denied") {
      const confirmed =
        window.confirm(
          `Deny "${submission.title}"?\n\nThis will update the submission status to denied.`
        );

      if (!confirmed) {
        return;
      }
    }

    try {
      setSavingId(
        submission.id
      );

      setNotice(null);

      await updateSubmissionStatus(
        submission.id,
        status
      );

      setSubmissions(
        (current) =>
          current.map((item) =>
            item.id ===
            submission.id
              ? {
                  ...item,
                  status,
                }
              : item
          )
      );

      setNotice({
        type: "success",

        message:
          status ===
          "approved"
            ? `"${submission.title}" was approved successfully.`
            : `"${submission.title}" was denied.`,
      });
    } catch (error) {
      console.error(
        "SUBMISSION UPDATE ERROR:",
        error
      );

      setNotice({
        type: "error",

        message:
          error instanceof
          Error
            ? error.message
            : "Could not update this submission.",
      });
    } finally {
      setSavingId(null);
    }
  }

  const metrics =
    useMemo(
      () =>
        getSubmissionMetrics(
          submissions
        ),
      [submissions]
    );

  const filteredSubmissions =
    useMemo(
      () =>
        filterSubmissions(
          submissions,
          searchQuery,
          statusFilter
        ),
      [
        searchQuery,
        statusFilter,
        submissions,
      ]
    );

  const hasActiveFilters =
    statusFilter !== "all" ||
    searchQuery.trim().length >
      0;

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Intake"
        title="Submissions"
        description="Review incoming partner projects, inspect submission details, and make the first editorial intake decision."
        actions={
          <button
            type="button"
            disabled={
              refreshing
            }
            onClick={() =>
              fetchSubmissions(
                true
              )
            }
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RefreshIcon
              spinning={
                refreshing
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh Queue"}
          </button>
        }
      />

      {notice && (
        <NoticeBanner
          notice={notice}
          onDismiss={() =>
            setNotice(null)
          }
        />
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <QueueMetricCard
          label="Total Submissions"
          value={metrics.total}
          description="All intake records"
        />

        <QueueMetricCard
          label="Awaiting Review"
          value={metrics.pending}
          description="Needs an intake decision"
          emphasis
        />

        <QueueMetricCard
          label="Approved"
          value={
            metrics.approved
          }
          description="Moved forward"
        />

        <QueueMetricCard
          label="Denied"
          value={metrics.denied}
          description="Not moving forward"
        />
      </section>

      <section className="rounded-[26px] border border-white/10 bg-white/[0.025] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.16)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <SearchIcon />

            <input
              type="search"
              value={
                searchQuery
              }
              onChange={(
                event
              ) =>
                setSearchQuery(
                  event.target
                    .value
                )
              }
              placeholder="Search titles, creators, genres..."
              className="min-h-11 w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/22 hover:border-white/16 focus:border-sky-300/50 focus:bg-black/30 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.055)]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(
              (option) => {
                const active =
                  statusFilter ===
                  option.value;

                const count =
                  option.value ===
                  "all"
                    ? metrics.total
                    : option.value ===
                        "pending"
                      ? metrics.pending
                      : option.value ===
                          "approved"
                        ? metrics.approved
                        : metrics.denied;

                return (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        option.value
                      )
                    }
                    className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                      active
                        ? "border-sky-300/35 bg-sky-300/[0.1] text-sky-200"
                        : "border-white/[0.08] bg-black/15 text-white/42 hover:border-white/15 hover:bg-white/[0.04] hover:text-white/70"
                    }`}
                  >
                    {option.label}

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        active
                          ? "bg-sky-300/15 text-sky-100"
                          : "bg-white/[0.05] text-white/30"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSubmissions />
      ) : submissions.length ===
        0 ? (
        <EmptyState
          title="No submissions found."
          description="New partner submissions will appear here when creators upload projects for SourceTV review."
        />
      ) : filteredSubmissions.length ===
        0 ? (
        <section className="rounded-[26px] border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/30">
            <SearchLargeIcon />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No matching
            submissions
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/40">
            Try changing the
            selected status or
            searching for a
            different title,
            creator, company, or
            genre.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery(
                  ""
                );

                setStatusFilter(
                  "all"
                );
              }}
              className="mt-5 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
            >
              Clear Filters
            </button>
          )}
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4 px-1">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/25">
                Intake Queue
              </p>

              <p className="mt-1 text-sm text-white/42">
                Showing{" "}
                {
                  filteredSubmissions.length
                }{" "}
                of{" "}
                {
                  submissions.length
                }{" "}
                submissions
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredSubmissions.map(
              (submission) => {
                const saving =
                  savingId ===
                  submission.id;

                const expanded =
                  expandedId ===
                  submission.id;

                const normalizedStatus =
                  normalizeStatus(
                    submission.status
                  );

                return (
                  <SubmissionCard
                    key={
                      submission.id
                    }
                    submission={
                      submission
                    }
                    saving={
                      saving
                    }
                    expanded={
                      expanded
                    }
                    normalizedStatus={
                      normalizedStatus
                    }
                    onToggle={() =>
                      setExpandedId(
                        (
                          current
                        ) =>
                          current ===
                          submission.id
                            ? null
                            : submission.id
                      )
                    }
                    onApprove={() =>
                      updateStatus(
                        submission,
                        "approved"
                      )
                    }
                    onDeny={() =>
                      updateStatus(
                        submission,
                        "denied"
                      )
                    }
                  />
                );
              }
            )}
          </div>
        </section>
      )}
    </main>
  );
}