type PartnerApplicationPreview = {
  fullName: string;
};

type Props = {
  open: boolean;
  action: "approve" | "reject" | null;
  application?: PartnerApplicationPreview | null;
  notes: string;
  setNotes: (value: string) => void;
  saving: boolean;
  savingCurrent: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export default function PartnerReviewModal({
  open,
  action,
  application,
  notes,
  setNotes,
  saving,
  savingCurrent,
  onClose,
  onSubmit,
}: Props) {
  if (!open || !action) return null;

  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#05070d] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="border-b border-white/10 px-6 py-5">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.22em] ${
              isApprove ? "text-sky-300" : "text-red-300"
            }`}
          >
            {isApprove ? "Approve Partner" : "Reject Application"}
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {application?.fullName || "Partner Application"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-white/45">
            {isApprove
              ? "Add optional approval notes before granting partner access."
              : "Add a clear rejection reason so the decision is documented."}
          </p>
        </div>

        <div className="px-6 py-6">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            {isApprove ? "Approval Notes" : "Rejection Reason"}
          </label>

          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={6}
            placeholder={
              isApprove
                ? "Example: Approved for partner access. Strong portfolio and clear fit for SourceTV."
                : "Example: Application rejected because portfolio or rights information was incomplete."
            }
            className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.035] px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/45 focus:bg-white/[0.055]"
          />

          {!isApprove && (
            <p className="mt-2 text-xs font-medium text-red-300/80">
              Rejection reason is required.
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-xs font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={onSubmit}
              className={`rounded-xl px-5 py-3 text-xs font-semibold transition disabled:opacity-50 ${
                isApprove
                  ? "bg-sky-300 text-[#05070d] hover:bg-sky-200"
                  : "border border-red-300/25 bg-red-300/10 text-red-300 hover:border-red-300/45"
              }`}
            >
              {savingCurrent
                ? "Saving..."
                : isApprove
                ? "Approve Partner"
                : "Reject Partner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}