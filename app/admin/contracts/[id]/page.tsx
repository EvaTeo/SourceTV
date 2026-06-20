"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Contract = {
  id: string;
  projectId: string;
  partnerEmail?: string | null;
  partnerName?: string | null;
  rightsOwner?: string | null;
  rightsContact?: string | null;
  status: string;
  licenseType?: string | null;
  licenseStartDate?: string | null;
  licenseEndDate?: string | null;
  territories?: string | null;
  exclusivity?: string | null;
  revenueShare: number;
  contractText?: string | null;
  adminNotes?: string | null;
  partnerNotes?: string | null;
  partnerSignatureName?: string | null;
  partnerSignatureDataUrl?: string | null;
  sentAt?: string | null;
  viewedAt?: string | null;
  signedAt?: string | null;
  createdAt?: string | null;
  project?: {
    id: string;
    title: string;
    creatorName?: string | null;
    creatorEmail?: string | null;
    creatorCompany?: string | null;
  };
};

function formatDateInput(date?: string | null) {
  if (!date) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  return new Date(date).toISOString().slice(0, 10);
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status: string) {
  if (status === "signed")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (status === "sent")
    return "border-sky-300/40 bg-sky-300/12 text-sky-200";
  if (status === "viewed")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";
  if (status === "changes_requested")
    return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
  if (status === "cancelled" || status === "expired")
    return "border-red-400/40 bg-red-500/12 text-red-200";

  return "border-white/15 bg-white/[0.05] text-white/65";
}

export default function AdminContractEditorPage() {
  const params = useParams<{ id: string }>();

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isSigned = contract?.status === "signed";

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
      console.error("LOAD CONTRACT ERROR:", error);
      alert("Could not load contract.");
    } finally {
      setLoading(false);
    }
  }

  async function saveContract(action?: string) {
    if (!contract) return;

    try {
      setSaving(true);

      const body = action
        ? { action }
        : {
            partnerName: contract.partnerName || "",
            partnerEmail: contract.partnerEmail || "",
            rightsOwner: contract.rightsOwner || "",
            rightsContact: contract.rightsContact || "",
            licenseType: contract.licenseType || "",
            licenseStartDate: contract.licenseStartDate
              ? formatDateInput(contract.licenseStartDate)
              : "",
            licenseEndDate: contract.licenseEndDate
              ? formatDateInput(contract.licenseEndDate)
              : "",
            territories: contract.territories || "",
            exclusivity: contract.exclusivity || "",
            revenueShare: Number(contract.revenueShare || 50),
            contractText: contract.contractText || "",
            adminNotes: contract.adminNotes || "",
          };

      const res = await fetch(`/api/admin/contracts/${contract.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not save contract.");
        return;
      }

      setContract(data);
    } catch (error) {
      console.error("SAVE CONTRACT ERROR:", error);
      alert("Could not save contract.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadContract();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 pt-28 text-white md:px-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
          Loading contract...
        </div>
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="min-h-screen bg-black px-4 pt-28 text-white md:px-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
          Contract not found.
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/admin/contracts"
          className="text-sm font-black text-sky-300 transition hover:text-sky-200"
        >
          ← Back to Contracts
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Rights Agreement
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-6xl">
                {contract.project?.title || "Contract Editor"}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${statusClass(
                    contract.status
                  )}`}
                >
                  {contract.status.replaceAll("_", " ")}
                </span>

                <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/55">
                  Revenue Share: {contract.revenueShare ?? 50}%
                </span>

                {contract.signedAt && (
                  <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200">
                    Signed {formatDate(contract.signedAt)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                disabled={saving || isSigned}
                onClick={() => saveContract()}
                className="rounded-md bg-sky-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-sky-300 disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save Draft"}
              </button>

              <button
                disabled={saving || isSigned}
                onClick={() => saveContract("send")}
                className="rounded-md border border-purple-300/35 bg-purple-400/10 px-4 py-2.5 text-xs font-black text-purple-200 transition hover:border-purple-300/70 disabled:opacity-40"
              >
                Send To Partner
              </button>

              <button
                disabled={saving}
                onClick={() => saveContract("mark_signed")}
                className="rounded-md border border-emerald-300/35 bg-emerald-300/10 px-4 py-2.5 text-xs font-black text-emerald-200 transition hover:border-emerald-300/70 disabled:opacity-40"
              >
                Mark Signed
              </button>

              <Link
                href={`/admin/contracts/${contract.id}/print`}
                className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
              >
                Print Record
              </Link>

              <button
                disabled={saving || isSigned}
                onClick={() => saveContract("cancel")}
                className="rounded-md border border-red-400/35 bg-red-500/10 px-4 py-2.5 text-xs font-black text-red-200 transition hover:border-red-400/70 disabled:opacity-40"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>

        <ContractTimeline contract={contract} />

        {contract.status === "changes_requested" && (
  <section className="mt-6 rounded-[1.6rem] border border-yellow-300/20 bg-yellow-300/[0.08] p-5 shadow-2xl backdrop-blur-xl">
    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-200">
      Partner Action Required
    </p>

    <h2 className="mt-2 text-xl font-black text-white">
      Changes have been requested by the partner.
    </h2>

    <p className="mt-2 text-sm leading-6 text-white/60">
      Review the partner notes below, update the agreement, and resend the
      contract when ready.
    </p>
  </section>
)}

{contract.status === "sent" && (
  <section className="mt-6 rounded-[1.6rem] border border-sky-300/20 bg-sky-300/[0.06] p-5 shadow-2xl backdrop-blur-xl">
    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-200">
      Awaiting Review
    </p>

    <h2 className="mt-2 text-xl font-black text-white">
      Contract has been sent to the partner.
    </h2>
  </section>
)}

{contract.status === "viewed" && (
  <section className="mt-6 rounded-[1.6rem] border border-purple-300/20 bg-purple-300/[0.06] p-5 shadow-2xl backdrop-blur-xl">
    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-200">
      Viewed By Partner
    </p>

    <h2 className="mt-2 text-xl font-black text-white">
      Partner has opened and reviewed this agreement.
    </h2>
  </section>
)}

        {isSigned && (
          <section className="mt-6 rounded-[1.6rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-5 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
              Executed Agreement
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              This agreement has been signed and locked.
            </h2>
          </section>
        )}

        {contract.partnerSignatureName && (
          <section className="mt-8 rounded-[1.6rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-5 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
              Signed Agreement Record
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <InfoBox
                label="Signed By"
                value={contract.partnerSignatureName}
              />
              <InfoBox
                label="Signed Date"
                value={formatDate(contract.signedAt)}
              />
              <InfoBox
                label="Viewed Date"
                value={formatDate(contract.viewedAt)}
              />

              {contract.partnerSignatureDataUrl && (
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 md:col-span-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                    Drawn Signature
                  </p>

                  <img
                    src={contract.partnerSignatureDataUrl}
                    alt="Partner signature"
                    className="mt-3 max-h-36 rounded-xl border border-white/10 bg-white p-4"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <EditorPanel title="Partner">
              <Field label="Partner Name">
                <input
                  disabled={isSigned}
                  value={contract.partnerName || ""}
                  onChange={(event) =>
                    setContract({ ...contract, partnerName: event.target.value })
                  }
                  className="input"
                />
              </Field>

              <Field label="Partner Email">
                <input
                  disabled={isSigned}
                  value={contract.partnerEmail || ""}
                  onChange={(event) =>
                    setContract({
                      ...contract,
                      partnerEmail: event.target.value,
                    })
                  }
                  className="input"
                />
              </Field>

              <Field label="Rights Owner">
                <input
                  disabled={isSigned}
                  value={contract.rightsOwner || ""}
                  onChange={(event) =>
                    setContract({ ...contract, rightsOwner: event.target.value })
                  }
                  className="input"
                />
              </Field>

              <Field label="Rights Contact">
                <input
                  disabled={isSigned}
                  value={contract.rightsContact || ""}
                  onChange={(event) =>
                    setContract({
                      ...contract,
                      rightsContact: event.target.value,
                    })
                  }
                  className="input"
                />
              </Field>
            </EditorPanel>

            <EditorPanel title="License Terms">
              <Field label="License Type">
                <input
                  disabled={isSigned}
                  value={contract.licenseType || ""}
                  onChange={(event) =>
                    setContract({ ...contract, licenseType: event.target.value })
                  }
                  className="input"
                />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Start Date">
                  <input
                    type="date"
                    disabled={isSigned}
                    value={formatDateInput(contract.licenseStartDate)}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) =>
                      setContract({
                        ...contract,
                        licenseStartDate: event.target.value,
                      })
                    }
                    className="input cursor-pointer"
                  />
                </Field>

                <Field label="End Date">
                  <input
                    type="date"
                    disabled={isSigned}
                    value={formatDateInput(contract.licenseEndDate)}
                    onClick={(event) => event.currentTarget.showPicker?.()}
                    onChange={(event) =>
                      setContract({
                        ...contract,
                        licenseEndDate: event.target.value,
                      })
                    }
                    className="input cursor-pointer"
                  />
                </Field>
              </div>

              <Field label="Territories">
                <input
                  disabled={isSigned}
                  value={contract.territories || ""}
                  onChange={(event) =>
                    setContract({ ...contract, territories: event.target.value })
                  }
                  className="input"
                />
              </Field>

              <Field label="Exclusivity">
                <input
                  disabled={isSigned}
                  value={contract.exclusivity || ""}
                  onChange={(event) =>
                    setContract({ ...contract, exclusivity: event.target.value })
                  }
                  className="input"
                />
              </Field>

              <Field label="Revenue Share">
                <input
                  type="number"
                  disabled={isSigned}
                  value={contract.revenueShare ?? 50}
                  onChange={(event) =>
                    setContract({
                      ...contract,
                      revenueShare: Number(event.target.value),
                    })
                  }
                  className="input"
                />
              </Field>
            </EditorPanel>
          </div>

          <div className="space-y-6">
            <EditorPanel title="Contract Text">
              <textarea
                disabled={isSigned}
                value={contract.contractText || ""}
                onChange={(event) =>
                  setContract({
                    ...contract,
                    contractText: event.target.value,
                  })
                }
                className="min-h-[620px] w-full resize-y rounded-2xl border border-white/10 bg-black/55 px-4 py-4 font-mono text-sm leading-7 text-white outline-none placeholder:text-white/25 focus:border-sky-300/60"
              />
            </EditorPanel>

            <EditorPanel title="Admin Notes">
              <textarea
                disabled={isSigned}
                value={contract.adminNotes || ""}
                onChange={(event) =>
                  setContract({
                    ...contract,
                    adminNotes: event.target.value,
                  })
                }
                className="min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/25 focus:border-sky-300/60"
                placeholder="Internal notes for SourceTV only..."
              />
            </EditorPanel>

            {contract.partnerNotes && (
              <EditorPanel title="Partner Notes">
                <p className="text-sm leading-7 text-white/60">
                  {contract.partnerNotes}
                </p>
              </EditorPanel>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function ContractTimeline({ contract }: { contract: Contract }) {
  const steps = [
    {
      label: "Created",
      date: contract.createdAt,
      complete: Boolean(contract.createdAt),
    },
    {
      label: "Sent",
      date: contract.sentAt,
      complete: Boolean(contract.sentAt),
    },
    {
      label: "Viewed",
      date: contract.viewedAt,
      complete: Boolean(contract.viewedAt),
    },
    {
      label: "Signed",
      date: contract.signedAt,
      complete: Boolean(contract.signedAt),
    },
  ];

  return (
    <section className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        Contract Timeline
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.label} className="relative">
            {index < steps.length - 1 && (
              <div
                className={`absolute left-7 top-6 hidden h-px w-[calc(100%_-_1rem)] md:block ${
                  step.complete ? "bg-sky-300/70" : "bg-white/10"
                }`}
              />
            )}

            <div className="relative z-10 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-black ${
                  step.complete
                    ? "border-sky-300/60 bg-sky-300/15 text-sky-200"
                    : "border-white/10 bg-white/[0.04] text-white/30"
                }`}
              >
                {step.complete ? "✓" : index + 1}
              </div>

              <p className="mt-3 text-sm font-black text-white">
                {step.label}
              </p>

              <p className="mt-1 text-xs font-bold text-white/40">
                {formatDate(step.date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EditorPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl">
      <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        {title}
      </p>

      <div className="grid gap-4">{children}</div>
    </div>
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
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </span>

      {children}
    </label>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white/70">
        {value}
      </p>
    </div>
  );
}