import Link from "next/link";

import type { Contract } from "../../types";
import { statusClass } from "../../utils";

type ContractDetailHeaderProps = {
  contract: Contract;
  saving: boolean;
  locked: boolean;
  onToggleChanges: () => void;
  onOpenSignature: () => void;
};

export default function ContractDetailHeader({
  contract,
  saving,
  locked,
  onToggleChanges,
  onOpenSignature,
}: ContractDetailHeaderProps) {
  return (
    <>
      <Link
        href="/partner/contracts"
        className="group inline-flex items-center gap-2 text-sm font-medium text-white/45 transition hover:text-white"
      >
        <span
          aria-hidden="true"
          className="transition-transform group-hover:-translate-x-1"
        >
          ←
        </span>
        Back to Contracts
      </Link>

      <header className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.18)] md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-sky-300">
                Rights Agreement
              </p>

              <span
                className={`border-l-2 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${statusClass(
                  contract.status
                )}`}
              >
                {contract.status.replaceAll("_", " ")}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-white md:text-5xl">
              {contract.project?.title || "Streaming Rights Agreement"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
              Review the complete licensing agreement, confirm the ownership
              and distribution terms, then sign electronically or request
              revisions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={saving || locked}
              onClick={onToggleChanges}
              className="border border-white/15 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Request Changes
            </button>

            <button
              type="button"
              disabled={saving || locked}
              onClick={onOpenSignature}
              className="bg-sky-300 px-6 py-3 text-sm font-black text-[#05070d] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving..." : "Accept & Sign"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}