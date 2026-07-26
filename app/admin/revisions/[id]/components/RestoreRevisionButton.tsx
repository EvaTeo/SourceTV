"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type RestoreRevisionButtonProps = {
  revisionId: string;
  versionNumber: number;
};

type RestoreResponse = {
  success?: boolean;
  revisionId?: string;
  message?: string;
  error?: string;
};

export default function RestoreRevisionButton({
  revisionId,
  versionNumber,
}: RestoreRevisionButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isRestoring, setIsRestoring] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  function openModal() {
    setError(null);
    setIsOpen(true);
  }

  function closeModal() {
    if (isRestoring) {
      return;
    }

    setError(null);
    setIsOpen(false);
  }

  async function restoreRevision() {
    try {
      setError(null);
      setIsRestoring(true);

      const response = await fetch(
        `/api/admin/revisions/${revisionId}/restore`,
        {
          method: "POST",
        }
      );

      const data =
        (await response
          .json()
          .catch(() => null)) as RestoreResponse | null;

      if (!response.ok) {
        setError(
          data?.error ??
            "The version could not be restored."
        );

        return;
      }

      if (!data?.revisionId) {
        setError(
          "The restored revision was created, but its ID was not returned."
        );

        return;
      }

      setIsOpen(false);

      router.push(
        `/admin/revisions/${data.revisionId}`
      );

      router.refresh();
    } catch (requestError) {
      console.error(
        "Failed to restore revision:",
        requestError
      );

      setError(
        "The version could not be restored. Please try again."
      );
    } finally {
      setIsRestoring(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white/60 transition hover:border-sky-300/25 hover:bg-sky-300/10 hover:text-sky-200"
      >
        Restore Version
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`restore-revision-${revisionId}`}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6"
        >
          <button
            type="button"
            aria-label="Close restore confirmation"
            onClick={closeModal}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d1219] p-6 shadow-2xl shadow-black/50 sm:p-7">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                  Version Restore
                </p>

                <h2
                  id={`restore-revision-${revisionId}`}
                  className="mt-2 text-2xl font-black text-white"
                >
                  Restore Version {versionNumber}?
                </h2>
              </div>

              <button
                type="button"
                disabled={isRestoring}
                onClick={closeModal}
                aria-label="Close modal"
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-sky-300/15 bg-sky-300/[0.05] p-5">
              <p className="text-sm font-black text-white">
                Your live project will not change yet.
              </p>

              <p className="mt-2 text-sm leading-6 text-white/55">
                SourceTV will copy Version{" "}
                {versionNumber} into a brand-new
                pending revision. The new version must
                still be reviewed and approved before
                it can update the live project.
              </p>
            </div>

            <div className="mt-5 space-y-3 text-sm leading-6 text-white/50">
              <p>
                All previous versions will remain in
                the revision timeline.
              </p>

              <p>
                The restored version will receive the
                next available version number.
              </p>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                {error}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={isRestoring}
                onClick={closeModal}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white/65 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isRestoring}
                onClick={restoreRevision}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-300 px-5 py-3 text-sm font-black text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRestoring
                  ? "Creating Version..."
                  : `Restore Version ${versionNumber}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}