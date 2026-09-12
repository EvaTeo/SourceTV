import type { AdminContract } from "../types";
import { formatDateInput } from "../utils";

type Props = {
  contract: AdminContract;
  disabled: boolean;

  updateContract: <K extends keyof AdminContract>(
    key: K,
    value: AdminContract[K]
  ) => void;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50";

export default function LicenseTermsPanel({
  contract,
  disabled,
  updateContract,
}: Props) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-xl font-black text-white">
        License Terms
      </h2>

      <p className="mt-2 text-sm text-white/40">
        Define the usage window, territories, exclusivity, and revenue split.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="License Type">
          <input
            value={
              contract.licenseType ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "licenseType",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Revenue Share %">
          <input
            type="number"
            value={
              contract.revenueShare ??
              50
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "revenueShare",
                Number(
                  event.target.value
                )
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="License Start">
          <input
            type="date"
            value={formatDateInput(
              contract.licenseStartDate
            )}
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "licenseStartDate",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="License End">
          <input
            type="date"
            value={formatDateInput(
              contract.licenseEndDate
            )}
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "licenseEndDate",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Territories">
          <input
            value={
              contract.territories ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "territories",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Exclusivity">
          <input
            value={
              contract.exclusivity ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "exclusivity",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.13em] text-white/30">
        {label}
      </span>

      {children}
    </label>
  );
}