"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

  year?: string | number | null;
  runtime?: string | null;
  maturityRating?: string | null;

  creatorName?: string | null;
  creatorCompany?: string | null;

  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  titleLogoUrl?: string | null;

  videoUrl?: string | null;
mainVideoUrl?: string | null;
trailerUrl?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
};

type StatusFilter =
  | "all"
  | "pending"
  | "approved"
  | "denied";

type Notice = {
  type: "success" | "error";
  message: string;
};

const STATUS_OPTIONS: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "approved",
    label: "Approved",
  },
  {
    value: "denied",
    label: "Denied",
  },
];

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [expandedId, setExpandedId] = useState<string | null>(
    null
  );

  const [notice, setNotice] = useState<Notice | null>(null);

  const fetchSubmissions = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setNotice(null);

        const response = await fetch("/api/submissions", {
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          const message = await readErrorMessage(response);

          throw new Error(
            message || "Could not load submissions."
          );
        }

        const data = await response.json();

        setSubmissions(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.submissions)
              ? data.submissions
              : []
        );
      } catch (error) {
        console.error("SUBMISSIONS LOAD ERROR:", error);

        setSubmissions([]);

        setNotice({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "SourceTV could not load the submission queue.",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function updateStatus(
    submission: Submission,
    status: "approved" | "denied"
  ) {
    const statusLabel =
      status === "approved" ? "approve" : "deny";

    if (status === "denied") {
      const confirmed = window.confirm(
        `Deny "${submission.title}"?\n\nThis will update the submission status to denied.`
      );

      if (!confirmed) {
        return;
      }
    }

    try {
      setSavingId(submission.id);
      setNotice(null);

      const response = await fetch(
        "/api/submissions/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: submission.id,
            status,
          }),
        }
      );

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        const message = await readErrorMessage(response);

        throw new Error(
          message ||
            `SourceTV could not ${statusLabel} this submission.`
        );
      }

      setSubmissions((current) =>
        current.map((item) =>
          item.id === submission.id
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
          status === "approved"
            ? `"${submission.title}" was approved successfully.`
            : `"${submission.title}" was denied.`,
      });
    } catch (error) {
      console.error("SUBMISSION UPDATE ERROR:", error);

      setNotice({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Could not update this submission.",
      });
    } finally {
      setSavingId(null);
    }
  }

  const metrics = useMemo(() => {
    const pending = submissions.filter((submission) =>
      isPendingStatus(submission.status)
    ).length;

    const approved = submissions.filter(
      (submission) =>
        normalizeStatus(submission.status) === "approved"
    ).length;

    const denied = submissions.filter(
      (submission) =>
        normalizeStatus(submission.status) === "denied"
    ).length;

    return {
      total: submissions.length,
      pending,
      approved,
      denied,
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return submissions.filter((submission) => {
      const normalizedStatus = normalizeStatus(
        submission.status
      );

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "pending"
            ? isPendingStatus(normalizedStatus)
            : normalizedStatus === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        submission.title,
        submission.description,
        submission.type,
        submission.genre,
        submission.creatorName,
        submission.creatorCompany,
        submission.year,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [searchQuery, statusFilter, submissions]);

  const hasActiveFilters =
    statusFilter !== "all" || searchQuery.trim().length > 0;

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Intake"
        title="Submissions"
        description="Review incoming partner projects, inspect submission details, and make the first editorial intake decision."
        actions={
          <button
            type="button"
            disabled={refreshing}
            onClick={() => fetchSubmissions(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-semibold text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RefreshIcon spinning={refreshing} />

            {refreshing ? "Refreshing..." : "Refresh Queue"}
          </button>
        }
      />

      {notice && (
        <NoticeBanner
          notice={notice}
          onDismiss={() => setNotice(null)}
        />
      )}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Submissions"
          value={metrics.total}
          description="All intake records"
        />

        <MetricCard
          label="Awaiting Review"
          value={metrics.pending}
          description="Needs an intake decision"
          emphasis
        />

        <MetricCard
          label="Approved"
          value={metrics.approved}
          description="Moved forward"
        />

        <MetricCard
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
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search titles, creators, genres..."
              className="min-h-11 w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/22 hover:border-white/16 focus:border-sky-300/50 focus:bg-black/30 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.055)]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => {
              const active =
                statusFilter === option.value;

              const count =
                option.value === "all"
                  ? metrics.total
                  : option.value === "pending"
                    ? metrics.pending
                    : option.value === "approved"
                      ? metrics.approved
                      : metrics.denied;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(option.value)
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
            })}
          </div>
        </div>
      </section>

      {loading ? (
        <LoadingSubmissions />
      ) : submissions.length === 0 ? (
        <EmptyState
          title="No submissions found."
          description="New partner submissions will appear here when creators upload projects for SourceTV review."
        />
      ) : filteredSubmissions.length === 0 ? (
        <section className="rounded-[26px] border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-white/30">
            <SearchLargeIcon />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            No matching submissions
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/40">
            Try changing the selected status or searching for a
            different title, creator, company, or genre.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
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
                Showing {filteredSubmissions.length} of{" "}
                {submissions.length} submissions
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredSubmissions.map((submission) => {
              const saving =
                savingId === submission.id;

              const expanded =
                expandedId === submission.id;

              const normalizedStatus = normalizeStatus(
                submission.status
              );

              return (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  saving={saving}
                  expanded={expanded}
                  normalizedStatus={normalizedStatus}
                  onToggle={() =>
                    setExpandedId((current) =>
                      current === submission.id
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
                    updateStatus(submission, "denied")
                  }
                />
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

function SubmissionCard({
  submission,
  saving,
  expanded,
  normalizedStatus,
  onToggle,
  onApprove,
  onDeny,
}: {
  submission: Submission;
  saving: boolean;
  expanded: boolean;
  normalizedStatus: string;
  onToggle: () => void;
  onApprove: () => void;
  onDeny: () => void;
}) {
  const creator =
    submission.creatorCompany ||
    submission.creatorName ||
    "Creator information unavailable";

  const hasArtwork = Boolean(
    submission.backdropUrl || submission.thumbnailUrl
  );

  const metadata = [
    submission.type,
    submission.genre,
    submission.year
      ? String(submission.year)
      : null,
    submission.runtime,
    submission.maturityRating &&
    submission.maturityRating !== "Not Rated"
      ? submission.maturityRating
      : null,
  ].filter(Boolean) as string[];

  return (
    <article className="group overflow-hidden rounded-[26px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.018] shadow-[0_20px_70px_rgba(0,0,0,0.16)] transition hover:border-white/16">
      <div className="grid md:grid-cols-[190px_minmax(0,1fr)]">
        <div
          className="relative min-h-[190px] overflow-hidden border-b border-white/10 bg-[#090c12] bg-cover bg-center md:min-h-full md:border-b-0 md:border-r"
          style={{
            backgroundImage: submission.backdropUrl
              ? `url("${submission.backdropUrl}")`
              : submission.thumbnailUrl
                ? `url("${submission.thumbnailUrl}")`
                : "radial-gradient(circle at 70% 20%, rgba(56,189,248,0.14), transparent 35%), linear-gradient(145deg, #111827, #07090e)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 to-black/55 md:bg-gradient-to-t md:from-black/75 md:via-black/15 md:to-black/20" />

          {!hasArtwork && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <ArtworkIcon />

                <p className="mt-3 text-[9px] font-black uppercase tracking-[0.18em] text-white/22">
                  Artwork unavailable
                </p>
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4">
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/35">
              Submitted
            </p>

            <p className="mt-1 text-xs font-semibold text-white/76">
              {formatSubmissionDate(
                submission.createdAt
              )}
            </p>
          </div>
        </div>

        <div className="min-w-0 p-5 md:p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status={submission.status}
                />

                {metadata.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.08] bg-black/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/38"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-white md:text-2xl">
                {submission.title}
              </h2>

              <p className="mt-1.5 text-xs font-semibold text-white/32">
                {creator}
              </p>

              <p className="mt-4 line-clamp-2 max-w-3xl text-sm leading-6 text-white/48">
                {submission.description ||
                  "No project description was provided."}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <AssetIndicator
  label="Main Video"
  ready={Boolean(
    submission.mainVideoUrl || submission.videoUrl
  )}
  unknown={
    submission.mainVideoUrl === undefined &&
    submission.videoUrl === undefined
  }
/>

                <AssetIndicator
                  label="Trailer"
                  ready={Boolean(
                    submission.trailerUrl
                  )}
                  unknown={
                    submission.trailerUrl === undefined
                  }
                />

                <AssetIndicator
                  label="Poster"
                  ready={Boolean(
                    submission.thumbnailUrl
                  )}
                  unknown={
                    submission.thumbnailUrl ===
                    undefined
                  }
                />

                <AssetIndicator
                  label="Backdrop"
                  ready={Boolean(
                    submission.backdropUrl
                  )}
                  unknown={
                    submission.backdropUrl ===
                    undefined
                  }
                />
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap content-start gap-2 xl:w-[158px] xl:flex-col">
              {normalizedStatus !== "approved" && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={onApprove}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-2 text-xs font-black text-[#05070d] shadow-[0_12px_30px_rgba(56,189,248,0.14)] transition hover:-translate-y-0.5 hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 xl:w-full"
                >
                  {saving ? (
                    <>
                      <Spinner dark />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApproveIcon />
                      Approve
                    </>
                  )}
                </button>
              )}

              {normalizedStatus !== "denied" && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={onDeny}
                  className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-red-300/20 bg-red-300/[0.065] px-4 py-2 text-xs font-bold text-red-200 transition hover:border-red-300/35 hover:bg-red-300/[0.1] disabled:cursor-not-allowed disabled:opacity-45 xl:w-full"
                >
                  <DenyIcon />
                  Deny
                </button>
              )}

              <button
                type="button"
                onClick={onToggle}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2 text-xs font-bold text-white/48 transition hover:border-white/18 hover:bg-white/[0.045] hover:text-white/75 xl:w-full"
              >
                {expanded
                  ? "Hide Details"
                  : "Review Details"}

                <ChevronIcon expanded={expanded} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-white/10 bg-black/15 p-5 md:p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                  Full Description
                </p>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/52">
                  {submission.description ||
                    "No project description was provided."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Project Type"
                  value={submission.type || "Not provided"}
                />

                <DetailItem
                  label="Genre"
                  value={submission.genre || "Not provided"}
                />

                <DetailItem
                  label="Release Year"
                  value={
                    submission.year
                      ? String(submission.year)
                      : "Not provided"
                  }
                />

                <DetailItem
                  label="Runtime"
                  value={
                    submission.runtime ||
                    "Not provided"
                  }
                />

                <DetailItem
                  label="Maturity Rating"
                  value={
                    submission.maturityRating ||
                    "Not rated"
                  }
                />

                <DetailItem
                  label="Current Status"
                  value={formatStatus(
                    submission.status
                  )}
                />

                <DetailItem
                  label="Creator"
                  value={
                    submission.creatorName ||
                    "Not provided"
                  }
                />

                <DetailItem
                  label="Company"
                  value={
                    submission.creatorCompany ||
                    "Not provided"
                  }
                />

                <DetailItem
                  label="Submission ID"
                  value={submission.id}
                  mono
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                Submitted Assets
              </p>

              <div className="mt-4 space-y-2">
               <AssetLink
  label="Main Project Video"
  url={
    submission.mainVideoUrl ||
    submission.videoUrl
  }
  unknown={
    submission.mainVideoUrl === undefined &&
    submission.videoUrl === undefined
  }
/>

                <AssetLink
                  label="Trailer"
                  url={submission.trailerUrl}
                  unknown={
                    submission.trailerUrl === undefined
                  }
                />

                <AssetLink
                  label="Poster Artwork"
                  url={submission.thumbnailUrl}
                  unknown={
                    submission.thumbnailUrl ===
                    undefined
                  }
                />

                <AssetLink
                  label="Backdrop Artwork"
                  url={submission.backdropUrl}
                  unknown={
                    submission.backdropUrl ===
                    undefined
                  }
                />

                <AssetLink
                  label="Title Logo"
                  url={submission.titleLogoUrl}
                  unknown={
                    submission.titleLogoUrl ===
                    undefined
                  }
                />
              </div>

              <p className="mt-4 text-[11px] leading-5 text-white/26">
                Media links only appear when the submissions API
                includes the corresponding asset fields.
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function MetricCard({
  label,
  value,
  description,
  emphasis = false,
}: {
  label: string;
  value: number;
  description: string;
  emphasis?: boolean;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[22px] border p-5 shadow-[0_16px_50px_rgba(0,0,0,0.13)] ${
        emphasis
          ? "border-sky-300/18 bg-gradient-to-br from-sky-300/[0.08] to-white/[0.02]"
          : "border-white/10 bg-white/[0.025]"
      }`}
    >
      {emphasis && (
        <div className="pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full bg-sky-300/[0.1] blur-[55px]" />
      )}

      <div className="relative">
        <p className="text-[10px] font-black uppercase tracking-[0.17em] text-white/30">
          {label}
        </p>

        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
          {value}
        </p>

        <p className="mt-1 text-xs text-white/30">
          {description}
        </p>
      </div>
    </article>
  );
}

function AssetIndicator({
  label,
  ready,
  unknown,
}: {
  label: string;
  ready: boolean;
  unknown: boolean;
}) {
  const status = unknown
    ? "Unknown"
    : ready
      ? "Ready"
      : "Missing";

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-black/15 px-2.5 py-2">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          unknown
            ? "bg-white/18"
            : ready
              ? "bg-emerald-300"
              : "bg-amber-300"
        }`}
      />

      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-white/28">
        {label}
      </span>

      <span
        className={`text-[9px] font-bold ${
          unknown
            ? "text-white/22"
            : ready
              ? "text-emerald-300/75"
              : "text-amber-200/65"
        }`}
      >
        {status}
      </span>
    </div>
  );
}

function AssetLink({
  label,
  url,
  unknown,
}: {
  label: string;
  url?: string | null;
  unknown: boolean;
}) {
  if (unknown) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-black/15 px-3 py-3">
        <span className="text-xs font-semibold text-white/43">
          {label}
        </span>

        <span className="text-[9px] font-black uppercase tracking-[0.13em] text-white/20">
          Not returned
        </span>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-black/15 px-3 py-3">
        <span className="text-xs font-semibold text-white/43">
          {label}
        </span>

        <span className="text-[9px] font-black uppercase tracking-[0.13em] text-amber-200/50">
          Missing
        </span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.025] px-3 py-3 transition hover:border-emerald-300/22 hover:bg-emerald-300/[0.05]"
    >
      <span className="text-xs font-semibold text-white/55">
        {label}
      </span>

      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.13em] text-emerald-300/70">
        Open
        <ExternalLinkIcon />
      </span>
    </a>
  );
}

function DetailItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/24">
        {label}
      </p>

      <p
        className={`mt-1.5 break-words text-xs font-semibold text-white/54 ${
          mono ? "font-mono text-[10px]" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function NoticeBanner({
  notice,
  onDismiss,
}: {
  notice: Notice;
  onDismiss: () => void;
}) {
  const success = notice.type === "success";

  return (
    <section
      className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3.5 ${
        success
          ? "border-emerald-300/18 bg-emerald-300/[0.055]"
          : "border-red-300/18 bg-red-300/[0.055]"
      }`}
    >
      <div>
        <p
          className={`text-xs font-black uppercase tracking-[0.14em] ${
            success
              ? "text-emerald-200"
              : "text-red-200"
          }`}
        >
          {success ? "Updated" : "Action Required"}
        </p>

        <p
          className={`mt-1 text-sm ${
            success
              ? "text-emerald-100/55"
              : "text-red-100/55"
          }`}
        >
          {notice.message}
        </p>
      </div>

      <button
        type="button"
        aria-label="Dismiss message"
        onClick={onDismiss}
        className="rounded-lg p-1 text-white/30 transition hover:bg-white/[0.05] hover:text-white/70"
      >
        ×
      </button>
    </section>
  );
}

function LoadingSubmissions() {
  return (
    <section className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.025]"
        >
          <div className="grid animate-pulse md:grid-cols-[190px_minmax(0,1fr)]">
            <div className="min-h-[190px] bg-white/[0.035]" />

            <div className="p-6">
              <div className="h-5 w-24 rounded bg-white/[0.055]" />
              <div className="mt-5 h-7 w-2/5 rounded bg-white/[0.055]" />
              <div className="mt-3 h-4 w-1/4 rounded bg-white/[0.04]" />
              <div className="mt-5 h-4 w-full rounded bg-white/[0.04]" />
              <div className="mt-2 h-4 w-3/4 rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SearchLargeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function RefreshIcon({
  spinning,
}: {
  spinning: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${
        spinning ? "animate-spin" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M20 11a8 8 0 1 0-2.34 5.66" />
      <path d="M20 5v6h-6" />
    </svg>
  );
}

function ArtworkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="mx-auto h-7 w-7 text-white/18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2.5"
      />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m4 17 5-5 3.5 3.5 2-2L20 19" />
    </svg>
  );
}

function ApproveIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function DenyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="m9 9 6 6" />
      <path d="m15 9-6 6" />
    </svg>
  );
}

function ChevronIcon({
  expanded,
}: {
  expanded: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-4 w-4 transition-transform ${
        expanded ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-3 w-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path d="M14 5h5v5" />
      <path d="m19 5-8 8" />
      <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function Spinner({
  dark = false,
}: {
  dark?: boolean;
}) {
  return (
    <span
      className={`h-3.5 w-3.5 animate-spin rounded-full border-2 ${
        dark
          ? "border-black/20 border-t-black"
          : "border-white/20 border-t-white"
      }`}
    />
  );
}

function normalizeStatus(status?: string | null) {
  const normalized = String(status || "pending")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  if (
    normalized === "rejected" ||
    normalized === "declined"
  ) {
    return "denied";
  }

  return normalized;
}

function isPendingStatus(status?: string | null) {
  const normalized = normalizeStatus(status);

  return [
    "pending",
    "submitted",
    "in_review",
    "under_review",
    "review",
  ].includes(normalized);
}

function formatStatus(status?: string | null) {
  return normalizeStatus(status)
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function formatSubmissionDate(
  value?: string | null
) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

async function readErrorMessage(response: Response) {
  try {
    const data = await response.json();

    return (
      data?.message ||
      data?.error ||
      ""
    );
  } catch {
    return "";
  }
}