import type { AdminContract } from "../types";

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

export default function PartnerRightsPanel({
  contract,
  disabled,
  updateContract,
}: Props) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-xl font-black text-white">
        Partner & Rights
      </h2>

      <p className="mt-2 text-sm text-white/40">
        Contact and ownership information attached to this agreement.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Partner Name">
          <input
            value={
              contract.partnerName ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "partnerName",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Partner Email">
          <input
            value={
              contract.partnerEmail ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "partnerEmail",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Rights Owner">
          <input
            value={
              contract.rightsOwner ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "rightsOwner",
                event.target.value
              )
            }
            className={inputClass}
          />
        </Field>

        <Field label="Rights Contact">
          <input
            value={
              contract.rightsContact ||
              ""
            }
            disabled={disabled}
            onChange={(event) =>
              updateContract(
                "rightsContact",
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