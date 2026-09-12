"use client";

type RejectContentModalProps = {
  title: string;
  reason: string;
  saving: boolean;

  setReason: (
    value: string
  ) => void;

  onClose: () => void;
  onReject: () => void;
};

export default function RejectContentModal({
  title,
  reason,
  saving,
  setReason,
  onClose,
  onReject,
}: RejectContentModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] border border-red-300/15 bg-[#0b0d12] p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-200">
              Reject Title
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Reject {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Add review notes explaining why this title should
              not move forward.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-lg p-2 text-white/30 transition hover:bg-white/[0.05] hover:text-white"
          >
            ×
          </button>
        </div>

        <textarea
          value={reason}
          onChange={(event) =>
            setReason(
              event.target.value
            )
          }
          rows={7}
          placeholder="Reason for rejection..."
          className="mt-6 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-red-300/35"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={onReject}
            className="rounded-xl border border-red-300/20 bg-red-300/[0.08] px-4 py-2.5 text-sm font-black text-red-200 transition hover:bg-red-300/[0.13] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Rejecting..."
              : "Reject Title"}
          </button>
        </div>
      </div>
    </div>
  );
}