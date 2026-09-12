import type { AdminContract } from "../types";
import { formatContractDate } from "../utils";

export default function ContractTimeline({
  contract,
}: {
  contract: AdminContract;
}) {
  const items = [
    {
      label: "Created",
      value: contract.createdAt,
    },
    {
      label: "Sent",
      value: contract.sentAt,
    },
    {
      label: "Viewed",
      value: contract.viewedAt,
    },
    {
      label: "Signed",
      value: contract.signedAt,
    },
  ];

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
        Timeline
      </p>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-black/15 px-4 py-3"
          >
            <span className="text-xs font-bold text-white/38">
              {item.label}
            </span>

            <span className="text-xs font-semibold text-white/60">
              {formatContractDate(
                item.value
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}