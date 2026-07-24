import type {
  ReadinessItem,
} from "../types";

export default function SubmissionReadiness({
  readinessItems,
  completedItems,
  readinessPercent,
}: {
  readinessItems: ReadinessItem[];
  completedItems: number;
  readinessPercent: number;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.018] p-5 shadow-[0_18px_65px_rgba(0,0,0,0.18)] sm:p-6">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
            Submission Readiness
          </p>

          <p className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-white">
            {readinessPercent}%
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-white/52">
            {completedItems} of{" "}
            {readinessItems.length}
          </p>

          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/24">
            Assets complete
          </p>
        </div>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full border border-white/[0.04] bg-black/30 p-[2px]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-sky-200 shadow-[0_0_18px_rgba(125,211,252,0.4)] transition-all duration-500"
          style={{
            width: `${readinessPercent}%`,
          }}
        />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {readinessItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between rounded-xl border px-3 py-2.5 transition ${
              item.complete
                ? "border-emerald-300/12 bg-emerald-300/[0.025]"
                : "border-white/[0.07] bg-black/15"
            }`}
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white/48">
                {item.label}
              </p>

              {item.required && (
                <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.13em] text-sky-300/70">
                  Required
                </p>
              )}
            </div>

            <span
              className={`ml-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                item.complete
                  ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-200"
                  : "border-white/10 bg-white/[0.025] text-white/18"
              }`}
            >
              {item.complete ? "✓" : "•"}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-white/30">
        Title, description, and the main video are required.
        Additional artwork and trailer assets improve review
        and presentation readiness.
      </p>
    </section>
  );
}
