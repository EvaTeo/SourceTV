"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  revisionId: string;
  status: string;
};

type Action =
  | "approve"
  | "changes"
  | "reject"
  | null;

export default function RevisionActions({
  revisionId,
  status,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [action, setAction] =
    useState<Action>(null);

  const [notes, setNotes] =
    useState("");

  async function submit(
    endpoint: string,
    body?: object
  ) {
    try {
      setLoading(true);

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: body
            ? JSON.stringify(body)
            : undefined,
        }
      );

      if (!response.ok) {
        const data =
          await response.json();

        alert(
          data.error ??
            "Something went wrong."
        );

        return;
      }

      router.push("/admin/revisions");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (status !== "pending") {
    return (
      <section className="rounded-3xl border border-white/10 bg-[#10151d] p-6">
        <h3 className="text-lg font-semibold text-white">
          Review Complete
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          This revision has already
          been reviewed.
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-[#10151d] p-6">
        <h2 className="text-xl font-bold text-white">
          Review Decision
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Choose how you'd like to
          handle this revision.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={loading}
            onClick={() =>
              submit(
                `/api/admin/revisions/${revisionId}/approve`
              )
            }
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading
              ? "Approving..."
              : "Approve Revision"}
          </button>

          <button
            disabled={loading}
            onClick={() =>
              setAction("changes")
            }
            className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Request Changes
          </button>

          <button
            disabled={loading}
            onClick={() =>
              setAction("reject")
            }
            className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Reject
          </button>
        </div>
      </section>

      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d1118] p-6">
            <h2 className="text-xl font-bold text-white">
              {action === "changes"
                ? "Request Changes"
                : "Reject Revision"}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {action === "changes"
                ? "Tell the partner what should be updated."
                : "Explain why this revision is being rejected."}
            </p>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="mt-5 h-40 w-full rounded-2xl border border-white/10 bg-[#171d26] p-4 text-white outline-none focus:border-sky-400"
              placeholder="Enter your notes..."
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setAction(null)
                }
                className="rounded-xl border border-white/10 px-5 py-3 text-gray-300"
              >
                Cancel
              </button>

              <button
                disabled={
                  loading ||
                  notes.trim().length === 0
                }
                onClick={() =>
                  submit(
                    `/api/admin/revisions/${revisionId}/${action === "changes"
                      ? "request-changes"
                      : "reject"}`,
                    {
                      adminNotes: notes,
                    }
                  )
                }
                className="rounded-xl bg-sky-300 px-5 py-3 font-bold text-black disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : action === "changes"
                  ? "Send Request"
                  : "Reject Revision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}