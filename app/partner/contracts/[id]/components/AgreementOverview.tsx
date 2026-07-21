import type { Contract } from "../../types";
import { formatDate } from "../../utils";

import DetailRow from "./DetailRow";
import SectionHeading from "./SectionHeading";

type AgreementOverviewProps = {
  contract: Contract;
};

export default function AgreementOverview({
  contract,
}: AgreementOverviewProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-7">
      <SectionHeading
        eyebrow="Agreement Overview"
        title="Parties and terms"
        description="The business details attached to this streaming rights agreement."
      />

      <dl className="mt-6 border-t border-white/10">
        <DetailRow
          label="Partner"
          value={contract.partnerName || "Not set"}
        />

        <DetailRow
          label="Partner Email"
          value={contract.partnerEmail || "Not set"}
        />

        <DetailRow
          label="Rights Owner"
          value={contract.rightsOwner || "Not set"}
        />

        <DetailRow
          label="Rights Contact"
          value={contract.rightsContact || "Not set"}
        />

        <DetailRow
          label="License Starts"
          value={formatDate(contract.licenseStartDate)}
        />

        <DetailRow
          label="License Ends"
          value={formatDate(contract.licenseEndDate)}
        />

        <DetailRow
          label="Sent"
          value={formatDate(contract.sentAt)}
        />

        <DetailRow
          label="Viewed"
          value={formatDate(contract.viewedAt)}
        />

        <DetailRow
          label="Signed"
          value={formatDate(contract.signedAt)}
        />
      </dl>

      {contract.partnerNotes && (
        <section className="mt-10 border-t border-white/10 pt-7">
          <SectionHeading
            eyebrow="Partner Notes"
            title="Requested revisions"
            description="Your most recent note attached to this agreement."
          />

          <p className="mt-5 whitespace-pre-line text-sm leading-7 text-white/60">
            {contract.partnerNotes}
          </p>
        </section>
      )}

      {contract.partnerSignatureName && (
        <section className="mt-10 border-t border-white/10 pt-7">
          <SectionHeading
            eyebrow="Execution"
            title="Signature record"
            description="The electronic signature recorded for this agreement."
          />

          <dl className="mt-5 border-t border-white/10">
            <DetailRow
              label="Signed By"
              value={contract.partnerSignatureName}
            />
          </dl>

          {contract.partnerSignatureDataUrl && (
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                Drawn Signature
              </p>

              <img
                src={contract.partnerSignatureDataUrl}
                alt="Partner signature"
                className="mt-3 max-h-32 border border-white/10 bg-white p-3"
              />
            </div>
          )}
        </section>
      )}
    </aside>
  );
}