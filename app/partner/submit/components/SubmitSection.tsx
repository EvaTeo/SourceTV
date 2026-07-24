import { REVIEW_FLOW } from "../constants";

export default function SubmitSection({
  submitting,
  requiredComplete,
}: {
  submitting: boolean;
  requiredComplete: boolean;
}) {
  return (
    <section
      id="submit-project"
      className="scroll-mt-32 relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.055] to-white/[0.018] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] sm:p-7"
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-sky-300/[0.08] blur-[85px]" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.23em] text-sky-300">
            Final submission
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
            Ready to Publish Your Vision
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/44">
            Your project will remain private while it enters
            SourceTV&apos;s editorial review. Nothing becomes
            public until it has been approved.
          </p>
        </div>

        <button
          type="submit"
          disabled={
            submitting ||
            !requiredComplete
          }
          className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-300 px-6 py-3 text-sm font-black text-[#05070d] shadow-[0_16px_45px_rgba(56,189,248,0.2)] transition hover:-translate-y-0.5 hover:bg-sky-200 hover:shadow-[0_20px_55px_rgba(56,189,248,0.28)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              Uploading Project...
            </>
          ) : (
            <>
              Submit Project
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </>
          )}
        </button>
      </div>

      <div className="relative mt-7 border-t border-white/[0.08] pt-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/28">
          What happens next
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {REVIEW_FLOW.map(
            (step, index) => (
              <div
                key={step}
                className="relative rounded-xl border border-white/[0.08] bg-black/20 px-3 py-3"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-sky-300/65">
                  {String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </p>

                <p className="mt-1.5 text-xs font-semibold leading-5 text-white/58">
                  {step}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
