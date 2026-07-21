import type { Contract } from "../../types";

import SectionHeading from "./SectionHeading";

type LegalAgreementProps = {
  contract: Contract;
};

export default function LegalAgreement({
  contract,
}: LegalAgreementProps) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-7">
      <SectionHeading
        eyebrow="Legal Agreement"
        title="Full contract"
        description="Read the complete agreement before accepting and signing."
      />

      <div className="mt-6 max-h-[880px] overflow-y-auto whitespace-pre-line rounded-2xl border border-white/10 bg-black/15 p-5 text-sm leading-8 text-white/70 md:p-6">
        {contract.contractText || "No contract text provided."}
      </div>
    </article>
  );
}