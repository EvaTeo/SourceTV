import type { Contract } from "../../types";
import { formatDate } from "../../utils";

type ContractTimelineProps = {
  contract: Contract;
};

export default function ContractTimeline({
  contract,
}: ContractTimelineProps) {
  const steps = [
    {
      label: "Created",
      date: contract.createdAt,
      complete: Boolean(contract.createdAt),
    },
    {
      label: "Sent",
      date: contract.sentAt,
      complete: Boolean(contract.sentAt),
    },
    {
      label: "Viewed",
      date: contract.viewedAt,
      complete: Boolean(contract.viewedAt),
    },
    {
      label: "Signed",
      date: contract.signedAt,
      complete: Boolean(contract.signedAt),
    },
  ];

  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300">
            Contract Timeline
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Agreement progress
          </h2>
        </div>

        <p className="text-xs text-white/35">
          Last activity:{" "}
          {formatDate(
            contract.signedAt ||
              contract.viewedAt ||
              contract.sentAt ||
              contract.createdAt
          )}
        </p>
      </div>

      <div className="mt-7 grid gap-0 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="relative rounded-2xl border border-white/10 bg-black/10 p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 items-center justify-center border text-xs font-bold ${
                  step.complete
                    ? "border-sky-300 bg-sky-300 text-[#05070d]"
                    : "border-white/15 text-white/30"
                }`}
              >
                {step.complete ? "✓" : index + 1}
              </span>

              <p className="text-sm font-semibold text-white">
                {step.label}
              </p>
            </div>

            <p className="mt-3 text-xs leading-5 text-white/35">
              {formatDate(step.date)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}