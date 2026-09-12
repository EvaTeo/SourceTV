"use client";

import { use } from "react";

import ContractHeader from "./components/ContractHeader";
import ContractStatusNotice from "./components/ContractStatusNotice";
import ContractTextPanel from "./components/ContractTextPanel";
import ContractTimeline from "./components/ContractTimeline";
import LicenseTermsPanel from "./components/LicenseTermsPanel";
import PartnerRightsPanel from "./components/PartnerRightsPanel";
import SignatureRecord from "./components/SignatureRecord";

import useAdminContract from "./hooks/useAdminContract";

export default function AdminContractPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);

  const contractManager =
    useAdminContract(id);

  if (contractManager.loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        Loading contract...
      </main>
    );
  }

  if (!contractManager.contract) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        Contract not found.
      </main>
    );
  }

  const {
    contract,
    saving,
    isSigned,
    updateContract,
    saveContract,
  } = contractManager;

  return (
    <main className="space-y-6">
      <ContractHeader
        contract={contract}
        saving={saving}
        isSigned={isSigned}
        onSave={saveContract}
      />

      <ContractStatusNotice
        contract={contract}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <PartnerRightsPanel
            contract={contract}
            disabled={isSigned}
            updateContract={
              updateContract
            }
          />

          <LicenseTermsPanel
            contract={contract}
            disabled={isSigned}
            updateContract={
              updateContract
            }
          />

          <ContractTextPanel
            contract={contract}
            disabled={isSigned}
            updateContract={
              updateContract
            }
          />
        </div>

        <aside className="space-y-6">
          <ContractTimeline
            contract={contract}
          />

          <SignatureRecord
            contract={contract}
          />
        </aside>
      </section>
    </main>
  );
}