import type { AdminContract } from "../types";

type Props = {
  contract: AdminContract;
  disabled: boolean;

  updateContract: <K extends keyof AdminContract>(
    key: K,
    value: AdminContract[K]
  ) => void;
};

const textareaClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50";

export default function ContractTextPanel({
  contract,
  disabled,
  updateContract,
}: Props) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-xl font-black text-white">
        Contract Language
      </h2>

      <p className="mt-2 text-sm text-white/40">
        Maintain the actual agreement text and internal administrative notes.
      </p>

      <div className="mt-5 space-y-5">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.13em] text-white/30">
            Contract Text
          </span>

          <textarea
            rows={16}
            value={
              contract.contractText ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "contractText",
                event.target.value
              )
            }
            className={textareaClass}
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.13em] text-white/30">
            Admin Notes
          </span>

          <textarea
            rows={6}
            value={
              contract.adminNotes ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "adminNotes",
                event.target.value
              )
            }
            className={textareaClass}
          />
        </label>

        {contract.partnerNotes && (
          <div>
            <p className="text-xs font-black uppercase tracking-[0.13em] text-yellow-100/65">
              Partner Notes
            </p>

            <div className="mt-2 rounded-2xl border border-yellow-300/15 bg-yellow-300/[0.04] p-4 text-sm leading-6 text-yellow-50/60">
              {contract.partnerNotes}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}