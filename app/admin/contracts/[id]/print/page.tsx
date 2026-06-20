"use client";

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
        return;
      }

      setContract(data);
    } catch (error) {
      console.error("LOAD PRINT CONTRACT ERROR:", error);
      alert("Could not load contract.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContract();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-white">
        Loading printable contract...
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-white">
        Contract not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 pb-8 pt-28 text-black print:bg-white print:p-0">
      <div className="mx-auto mb-6 flex max-w-4xl justify-between gap-3 print:hidden">
        <Link
          href={`/admin/contracts/${contract.id}`}
          className="rounded-md border border-white/10 bg-white/10 px-4 py-2 text-sm font-black text-white"
        >
          ← Back to Contract
        </Link>

        <button
          onClick={() => window.print()}
          className="rounded-md bg-sky-400 px-4 py-2 text-sm font-black text-black"
        >
          Print / Save PDF
        </button>
      </div>

      <article className="mx-auto max-w-4xl bg-white px-10 py-12 shadow-2xl print:max-w-none print:shadow-none">
        <header className="border-b border-black/20 pb-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-black/55">
            SourceTV Streaming Rights Agreement
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight">
            {contract.project?.title || "Untitled Contract"}
          </h1>

          <div className="mt-4 grid gap-2 text-sm text-black/70 md:grid-cols-2">
            <p>
              <strong>Contract ID:</strong> {contract.id}
            </p>
            <p>
              <strong>Status:</strong> {contract.status.replaceAll("_", " ")}
            </p>
            <p>
              <strong>Created:</strong> {formatDate(contract.createdAt)}
            </p>
            <p>
              <strong>Signed:</strong> {formatDate(contract.signedAt)}
            </p>
          </div>
        </header>

        <section className="mt-8 grid gap-4 border-b border-black/20 pb-8 text-sm md:grid-cols-2">
          <Info label="Partner Name" value={contract.partnerName || "Not set"} />
          <Info
            label="Partner Email"
            value={contract.partnerEmail || "Not set"}
          />
          <Info label="Rights Owner" value={contract.rightsOwner || "Not set"} />
          <Info
            label="Rights Contact"
            value={contract.rightsContact || "Not set"}
          />
          <Info label="License Type" value={contract.licenseType || "Not set"} />
          <Info label="Territories" value={contract.territories || "Not set"} />
          <Info label="Exclusivity" value={contract.exclusivity || "Not set"} />
          <Info
            label="Revenue Share"
            value={`${contract.revenueShare ?? 50}%`}
          />
          <Info
            label="License Start"
            value={formatDate(contract.licenseStartDate)}
          />
          <Info
            label="License End"
            value={formatDate(contract.licenseEndDate)}
          />
          <Info label="Sent" value={formatDate(contract.sentAt)} />
          <Info label="Viewed" value={formatDate(contract.viewedAt)} />
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-black">Agreement Text</h2>

          <div className="mt-4 whitespace-pre-line text-sm leading-8 text-black/80">
            {contract.contractText || "No contract text provided."}
          </div>
        </section>

        <section className="mt-10 break-inside-avoid border-t border-black/20 pt-8">
          <h2 className="text-xl font-black">Electronic Signature Record</h2>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50">
                Signed By
              </p>
              <p className="mt-2 text-lg font-bold">
                {contract.partnerSignatureName || "Not signed"}
              </p>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-black/50">
                Signed Date
              </p>
              <p className="mt-2 text-lg font-bold">
                {formatDate(contract.signedAt)}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50">
                Drawn Signature
              </p>

              {contract.partnerSignatureDataUrl ? (
                <div className="mt-3 rounded-md border border-black/20 bg-white p-4">
                  <img
                    src={contract.partnerSignatureDataUrl}
                    alt="Partner signature"
                    className="max-h-36"
                  />
                </div>
              ) : (
                <p className="mt-3 text-sm text-black/50">
                  No signature saved.
                </p>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-black/20 pt-6 text-xs leading-6 text-black/50">
          <p className="mb-3 font-bold text-black/70">
            Electronic signature captured through SourceTV on{" "}
            {formatDate(contract.signedAt)} by{" "}
            {contract.partnerSignatureName || "Not signed"}.
          </p>

          <p>
            This record was generated by SourceTV for internal rights management
            and partner agreement tracking.
          </p>
        </footer>
      </article>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/45">
        {label}
      </p>
      <p className="mt-1 font-bold text-black/80">{value}</p>
    </div>
  );
}