import type { AdminContract } from "../types";

export default function SignatureRecord({
  contract,
}: {
  contract: AdminContract;
}) {
  if (
    !contract.partnerSignatureName &&
    !contract.partnerSignatureDataUrl
  ) {
    return null;
  }

  return (
    <section className="rounded-[1.75rem] border border-emerald-300/15 bg-emerald-300/[0.035] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200/70">
        Signature Record
      </p>

      {contract.partnerSignatureDataUrl && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white p-4">
          <img
            src={
              contract.partnerSignatureDataUrl
            }
            alt="Partner signature"
            className="max-h-32 w-full object-contain"
          />
        </div>
      )}

      {contract.partnerSignatureName && (
        <p className="mt-4 text-sm font-semibold text-white/65">
          Signed by{" "}
          <span className="text-white">
            {contract.partnerSignatureName}
          </span>
        </p>
      )}
    </section>
  );
}