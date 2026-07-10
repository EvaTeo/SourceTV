"use client";

import EmptyState from "@/app/components/admin/EmptyState";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Contract = {
  id: string;
  status: string;
  partnerName?: string | null;
  partnerEmail?: string | null;
  rightsOwner?: string | null;
  rightsContact?: string | null;
  licenseType?: string | null;
  licenseStartDate?: string | null;
  licenseEndDate?: string | null;
  territories?: string | null;
  exclusivity?: string | null;
  revenueShare: number;
  contractText?: string | null;
  partnerSignatureName?: string | null;
  partnerSignatureDataUrl?: string | null;
  sentAt?: string | null;
  viewedAt?: string | null;
  signedAt?: string | null;
  createdAt: string;
  project?: {
    title: string;
    creatorName?: string | null;
    creatorEmail?: string | null;
    creatorCompany?: string | null;
  };
};

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "long",
    timeStyle: "short",
  });
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

export default function AdminContractPrintPage() {
  const params = useParams<{ id: string }>();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadContract() {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/contracts/${params.id}`, {
        cache: "no-store",
      });

      if (res.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not load contract.");
        setContract(null);
        return;
      }

      setContract(data);
    } catch (error) {
      console.error("LOAD PRINT CONTRACT ERROR:", error);
      alert("Could not load contract.");
      setContract(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContract();
  }, []);

  if (loading) {
    return (
      <main className="space-y-6 print:hidden">
        <EmptyState title="Loading printable contract..." />
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="space-y-6 print:hidden">
        <EmptyState
          title="Contract not found."
          description="Return to the contract library and select another agreement."
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#05070d] px-4 pb-12 pt-6 text-black print:min-h-0 print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-5xl flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-white sm:flex-row sm:items-center print:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
            SourceTV Legal Operations
          </p>

          <h1 className="mt-1 text-lg font-semibold">
            Printable Contract Record
          </h1>

          <p className="mt-1 text-sm text-white/45">
            Review the final document before printing or saving it as a PDF.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/contracts/${contract.id}`}
            className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
          >
            Back to Contract
          </Link>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-5xl overflow-hidden rounded-sm bg-white shadow-[0_30px_100px_rgba(0,0,0,0.55)] print:max-w-none print:rounded-none print:shadow-none">
        <header className="border-b border-black/15 px-10 py-10 md:px-14 md:py-12 print:px-10 print:py-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/45">
                SourceTV
              </p>

              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/35">
                The Next Generation of Entertainment
              </p>
            </div>

            <div className="text-left text-xs leading-5 text-black/45 md:text-right">
              <p>Streaming Rights Agreement</p>
              <p>Contract ID: {contract.id}</p>
              <p>Generated: {formatDate(new Date().toISOString())}</p>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/45">
              Streaming Rights Agreement
            </p>

            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-black md:text-5xl">
              {contract.project?.title || "Untitled Contract"}
            </h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <DocumentBadge label={statusLabel(contract.status)} />

              <DocumentBadge
                label={`Revenue Share ${contract.revenueShare ?? 50}%`}
              />

              {contract.signedAt && <DocumentBadge label="Executed Agreement" />}
            </div>
          </div>
        </header>

        <section className="grid gap-8 border-b border-black/15 px-10 py-8 md:grid-cols-2 md:px-14 print:grid-cols-2 print:px-10">
          <DocumentSection title="Agreement Record">
            <Info label="Status" value={statusLabel(contract.status)} />
            <Info label="Created" value={formatDate(contract.createdAt)} />
            <Info label="Sent" value={formatDate(contract.sentAt)} />
            <Info label="Viewed" value={formatDate(contract.viewedAt)} />
            <Info label="Signed" value={formatDate(contract.signedAt)} />
          </DocumentSection>

          <DocumentSection title="Partner">
            <Info
              label="Partner Name"
              value={contract.partnerName || "Not set"}
            />

            <Info
              label="Partner Email"
              value={contract.partnerEmail || "Not set"}
            />

            <Info
              label="Rights Owner"
              value={contract.rightsOwner || "Not set"}
            />

            <Info
              label="Rights Contact"
              value={contract.rightsContact || "Not set"}
            />
          </DocumentSection>
        </section>

        <section className="border-b border-black/15 px-10 py-8 md:px-14 print:px-10">
          <h2 className="text-lg font-semibold tracking-tight text-black">
            License Terms
          </h2>

          <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
            <Info
              label="License Type"
              value={contract.licenseType || "Not set"}
            />

            <Info
              label="License Start"
              value={formatDate(contract.licenseStartDate)}
            />

            <Info
              label="License End"
              value={formatDate(contract.licenseEndDate)}
            />

            <Info
              label="Territories"
              value={contract.territories || "Not set"}
            />

            <Info
              label="Exclusivity"
              value={contract.exclusivity || "Not set"}
            />

            <Info
              label="Revenue Share"
              value={`${contract.revenueShare ?? 50}%`}
            />
          </div>
        </section>

        <section className="px-10 py-10 md:px-14 print:px-10 print:py-8">
          <div className="border-b border-black/15 pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/45">
              Agreement
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
              Terms and Conditions
            </h2>
          </div>

          <div className="mt-7 whitespace-pre-line text-sm leading-8 text-black/75">
            {contract.contractText || "No contract text provided."}
          </div>
        </section>

        <section className="break-inside-avoid border-t border-black/15 px-10 py-10 md:px-14 print:px-10 print:py-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/45">
            Execution
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
            Electronic Signature Record
          </h2>

          <div className="mt-7 grid gap-8 md:grid-cols-2 print:grid-cols-2">
            <div className="space-y-6">
              <Info
                label="Signed By"
                value={contract.partnerSignatureName || "Not signed"}
              />

              <Info
                label="Signed Date"
                value={formatDate(contract.signedAt)}
              />

              <Info
                label="Partner Email"
                value={contract.partnerEmail || "Not set"}
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
                Drawn Signature
              </p>

              {contract.partnerSignatureDataUrl ? (
                <div className="mt-3 flex min-h-40 items-center rounded-xl border border-black/15 bg-white p-5">
                  <img
                    src={contract.partnerSignatureDataUrl}
                    alt="Partner signature"
                    className="max-h-32 max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="mt-3 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-black/20 bg-black/[0.015] p-5 text-sm text-black/40">
                  No drawn signature saved.
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="border-t border-black/15 bg-black/[0.025] px-10 py-7 text-xs leading-6 text-black/50 md:px-14 print:px-10">
          <p className="font-semibold text-black/65">
            Electronic signature record
          </p>

          <p className="mt-1">
            This agreement was electronically signed through SourceTV on{" "}
            {formatDate(contract.signedAt)} by{" "}
            {contract.partnerSignatureName || "an unsigned partner"}.
          </p>

          <div className="mt-5 flex flex-col justify-between gap-2 border-t border-black/10 pt-5 sm:flex-row">
            <p>SourceTV Rights Management</p>
            <p>Contract ID: {contract.id}</p>
          </div>
        </footer>
      </article>
    </main>
  );
}

function DocumentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-black">
        {title}
      </h2>

      <div className="mt-5 grid gap-5">{children}</div>
    </div>
  );
}

function DocumentBadge({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-black/15 bg-black/[0.035] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-black/60">
      {label}
    </span>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/40">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-black/75">
        {value}
      </p>
    </div>
  );
}