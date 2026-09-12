import Link from "next/link";

import type {
  AdminContract,
  ContractAction,
} from "../types";

import {
  contractStatusClass,
  contractStatusLabel,
} from "../utils";

type ContractHeaderProps = {
  contract: AdminContract;
  saving: boolean;
  isSigned: boolean;

  onSave: (
    action?: ContractAction
  ) => void;
};

export default function ContractHeader({
  contract,
  saving,
  isSigned,
  onSave,
}: ContractHeaderProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${contractStatusClass(
                contract.status
              )}`}
            >
              {contractStatusLabel(
                contract.status
              )}
            </span>

            {contract.project?.title && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
                {contract.project.title}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-[-0.03em] text-white md:text-4xl">
            Rights Contract
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
            Manage the title&apos;s licensing terms, partner details,
            revenue share, contract language, and execution status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/contracts"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
          >
            Back
          </Link>

          <Link
            href={`/admin/contracts/${contract.id}/print`}
            target="_blank"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:text-white"
          >
            Print
          </Link>

          {!isSigned && (
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                onSave()
              }
              className="rounded-xl border border-sky-300/25 bg-sky-300/[0.08] px-4 py-2.5 text-sm font-black text-sky-200 transition hover:bg-sky-300/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Draft"}
            </button>
          )}

          {!isSigned &&
            contract.status !== "sent" && (
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  onSave("send")
                }
                className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-black text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send To Partner
              </button>
            )}

          {!isSigned &&
            contract.status !== "cancelled" && (
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  onSave("mark_signed")
                }
                className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] px-4 py-2.5 text-sm font-black text-emerald-200 transition hover:bg-emerald-300/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Mark Signed
              </button>
            )}

          {!isSigned &&
            contract.status !== "cancelled" && (
              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  onSave("cancel")
                }
                className="rounded-xl border border-red-300/20 bg-red-300/[0.06] px-4 py-2.5 text-sm font-black text-red-200 transition hover:bg-red-300/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            )}
        </div>
      </div>
    </section>
  );
}