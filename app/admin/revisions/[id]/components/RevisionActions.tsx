"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RevisionActionsProps = {
  revisionId: string;
  status: string;
};

type ReviewAction = "changes" | "reject" | null;

function getStatusLabel(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function RevisionActions({
  revisionId,
  status,
}: RevisionActionsProps) {
  const router = useRouter();

  const [loadingAction, setLoadingAction] = useState<
    "approve" | "changes" | "reject" | null
  >(null);

  const [selectedAction, setSelectedAction] =
    useState<ReviewAction>(null);

  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isPending = status === "pending";
  const isLoading = loadingAction !== null;

  async function submitAction(
    action: "approve" | "changes" | "reject",
    endpoint: string,
    body?: {
      adminNotes: string;
    }
  ) {
    try {
      setError(null);
      setLoadingAction(action);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: body
          ? {
              "Content-Type": "application/json",
            }
          : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          data?.error ??
            "The revision decision could not be submitted."
        );

        return;
      }

      setSelectedAction(null);
      setNotes("");

      router.push("/admin/revisions");
      router.refresh();
    } catch (requestError) {
      console.error(
        "Failed to submit revision decision:",
        requestError
      );

      setError(
        "The revision decision could not be submitted. Please try again."
      );
    } finally {
      setLoadingAction(null);
    }
  }

  function openAction(action: Exclude<ReviewAction, null>) {
    setError(null);
    setNotes("");
    setSelectedAction(action);
  }

  function closeModal() {
    if (isLoading) {
      return;
    }

    setSelectedAction(null);
    setNotes("");
    setError(null);
  }

  return (
    <>
      <section className="sticky top-4 z-30 rounded-3xl border border-white/10 bg-[#0b1017]/95 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                Revision Review
              </p>

              <span
                className={
                  isPending
                    ? "rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-amber-200"
                    : "rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-200"
                }
              >
                {getStatusLabel(status)}
              </span>
            </div>

            <h2 className="mt-2 text-lg font-black text-white sm:text-xl">
              {isPending
                ? "Choose a review decision"
                : "This revision has been reviewed"}
            </h2>

            <p className="mt-1 text-sm text-white/45">
              {isPending
                ? "Approve the revision, request updates, or reject the submission."
                : "Review actions are no longer available for this revision."}
            </p>
          </div>

          {isPending && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  submitAction(
                    "approve",
                    `/api/admin/revisions/${revisionId}/approve`
                  )
                }
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingAction === "approve"
                  ? "Approving..."
                  : "Approve Revision"}
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => openAction("changes")}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Request Changes
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => openAction("reject")}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-400/25 bg-red-500/10 px-5 py-3 text-sm font-black text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          )}
        </div>

        {error && !selectedAction && (
          <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
            {error}
          </div>
        )}
      </section>

      {selectedAction && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="revision-action-title"
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
        >
          <button
            type="button"
            aria-label="Close review decision"
            onClick={closeModal}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d1219] p-6 shadow-2xl shadow-black/50 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                  Admin Decision
                </p>

                <h2
                  id="revision-action-title"
                  className="mt-2 text-2xl font-black text-white"
                >
                  {selectedAction === "changes"
                    ? "Request Changes"
                    : "Reject Revision"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  {selectedAction === "changes"
                    ? "Explain exactly what the partner needs to update before submitting another revision."
                    : "Explain why this revision cannot be accepted."}
                </p>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={closeModal}
                aria-label="Close modal"
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <label
              htmlFor="revision-admin-notes"
              className="mt-6 block text-sm font-black text-white"
            >
              Notes for the partner
            </label>

            <textarea
              id="revision-admin-notes"
              value={notes}
              disabled={isLoading}
              onChange={(event) => {
                setNotes(event.target.value);

                if (error) {
                  setError(null);
                }
              }}
              className="mt-3 h-44 w-full resize-none rounded-2xl border border-white/10 bg-[#171d26] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/50 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder={
                selectedAction === "changes"
                  ? "Describe the required changes..."
                  : "Explain the reason for rejection..."
              }
              autoFocus
            />

            <div className="mt-2 flex items-center justify-between gap-4">
              <p className="text-xs text-white/30">
                {notes.trim().length} characters
              </p>

              {notes.trim().length === 0 && (
                <p className="text-xs font-semibold text-amber-200/70">
                  Notes are required
                </p>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isLoading}
                onClick={closeModal}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white/65 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  isLoading || notes.trim().length === 0
                }
                onClick={() =>
                  submitAction(
                    selectedAction,
                    `/api/admin/revisions/${revisionId}/${
                      selectedAction === "changes"
                        ? "request-changes"
                        : "reject"
                    }`,
                    {
                      adminNotes: notes.trim(),
                    }
                  )
                }
                className={
                  selectedAction === "changes"
                    ? "inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                    : "inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                }
              >
                {loadingAction === "changes"
                  ? "Sending Request..."
                  : loadingAction === "reject"
                    ? "Rejecting..."
                    : selectedAction === "changes"
                      ? "Send Change Request"
                      : "Reject Revision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}