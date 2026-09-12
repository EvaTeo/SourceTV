import type { AdminContract } from "../types";

export default function ContractStatusNotice({
  contract,
}: {
  contract: AdminContract;
}) {
  if (
    contract.status ===
    "changes_requested"
  ) {
    return (
      <section className="rounded-2xl border border-yellow-300/20 bg-yellow-300/[0.06] p-4">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-yellow-100">
          Changes Requested
        </p>

        <p className="mt-2 text-sm leading-6 text-yellow-50/60">
          The partner requested changes to this contract. Review the partner
          notes below before updating and resending.
        </p>
      </section>
    );
  }

  if (
    contract.status ===
    "signed"
  ) {
    return (
      <section className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-200">
          Contract Signed
        </p>

        <p className="mt-2 text-sm leading-6 text-emerald-50/60">
          This contract has been signed and should be treated as an executed
          rights record.
        </p>
      </section>
    );
  }

  return null;
}