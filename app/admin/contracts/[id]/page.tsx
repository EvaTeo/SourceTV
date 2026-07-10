"use client";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import EmptyState from "@/app/components/admin/EmptyState";
import InfoBox from "@/app/components/admin/InfoBox";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
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
  if (status === "signed") {
    return "border-emerald-300/35 bg-emerald-300/10 text-emerald-200";
  }

  if (status === "sent") {
    return "border-sky-300/35 bg-sky-300/10 text-sky-200";
  }

  if (status === "viewed") {
    return "border-purple-300/35 bg-purple-300/10 text-purple-200";
  }

  if (status === "changes_requested") {
    return "border-yellow-300/35 bg-yellow-300/10 text-yellow-100";
  }

  if (status === "cancelled" || status === "expired") {
    return "border-red-300/35 bg-red-300/10 text-red-200";
  }

  return "border-white/10 bg-white/[0.035] text-white/60";
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
        setContract(null);
        return;
      }

      setContract(data);
    } catch (error) {
      console.error("LOAD CONTRACT ERROR:", error);
      alert("Could not load contract.");
      setContract(null);
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
      <main className="space-y-6">
        <EmptyState title="Loading contract..." />
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="space-y-6">
        <AdminPageHeader
          eyebrow="SourceTV Legal Operations"
          title="Contract Not Found"
          description="This contract could not be loaded or may no longer exist."
          actions={
            <Link
              href="/admin/contracts"
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Back to Contracts
            </Link>
          }
        />

        <EmptyState
          title="Contract not found."
          description="Return to the contracts library and choose another agreement."
        />
      </main>
    );
  }

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Rights Agreement"
        title={contract.project?.title || "Contract Editor"}
        description="Manage partner information, licensing terms, agreement text, signatures, and contract status."
        actions={
          <>
            <Link
              href="/admin/contracts"
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Contracts
            </Link>

            <button
              type="button"
              disabled={saving || isSigned}
              onClick={() => saveContract()}
              className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
          </>
        }
      />

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusClass(
                contract.status
              )}`}
            >
              {contract.status.replaceAll("_", " ")}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Revenue Share: {contract.revenueShare ?? 50}%
            </span>

            {contract.signedAt && (
              <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                Signed {formatDate(contract.signedAt)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving || isSigned}
              onClick={() => saveContract("send")}
              className="rounded-xl border border-purple-300/25 bg-purple-300/10 px-4 py-2.5 text-xs font-semibold text-purple-200 transition hover:border-purple-300/45 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send to Partner
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => saveContract("mark_signed")}
              className="rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-2.5 text-xs font-semibold text-emerald-200 transition hover:border-emerald-300/45 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Mark Signed
            </button>

            <Link
              href={`/admin/contracts/${contract.id}/print`}
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-semibold text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Print Record
            </Link>

            <button
              type="button"
              disabled={saving || isSigned}
              onClick={() => saveContract("cancel")}
              className="rounded-xl border border-red-300/25 bg-red-300/10 px-4 py-2.5 text-xs font-semibold text-red-200 transition hover:border-red-300/45 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>
          </div>
        </div>
      </section>

      <ContractTimeline contract={contract} />

      {contract.status === "changes_requested" && (
        <StatusNotice
          eyebrow="Partner Action Required"
          title="Changes have been requested by the partner."
          description="Review the partner notes below, update the agreement, and resend the contract when ready."
          tone="yellow"
        />
      )}

      {contract.status === "sent" && (
        <StatusNotice
          eyebrow="Awaiting Review"
          title="The contract has been sent to the partner."
          description="The agreement is waiting for the partner to open and review it."
          tone="sky"
        />
      )}

      {contract.status === "viewed" && (
        <StatusNotice
          eyebrow="Viewed by Partner"
          title="The partner has opened this agreement."
          description="The agreement has been reviewed but has not yet been signed."
          tone="purple"
        />
      )}

      {isSigned && (
        <StatusNotice
          eyebrow="Executed Agreement"
          title="This agreement has been signed and locked."
          description="Signed agreements cannot be edited unless the contract workflow is reopened."
          tone="green"
        />
      )}

      {contract.partnerSignatureName && (
        <section className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.05] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
            Signed Agreement Record
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:col-span-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
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

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <EditorPanel
            eyebrow="Partner"
            title="Partner and Rights Owner"
            description="Contact and rights-holder information attached to this agreement."
          >
            <Field label="Partner Name">
              <input
                disabled={isSigned}
                value={contract.partnerName || ""}
                onChange={(event) =>
                  setContract({
                    ...contract,
                    partnerName: event.target.value,
                  })
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
                  setContract({
                    ...contract,
                    rightsOwner: event.target.value,
                  })
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

          <EditorPanel
            eyebrow="License"
            title="License Terms"
            description="Define the duration, territories, exclusivity, and participation terms."
          >
            <Field label="License Type">
              <input
                disabled={isSigned}
                value={contract.licenseType || ""}
                onChange={(event) =>
                  setContract({
                    ...contract,
                    licenseType: event.target.value,
                  })
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
                  setContract({
                    ...contract,
                    territories: event.target.value,
                  })
                }
                className="input"
              />
            </Field>

            <Field label="Exclusivity">
              <input
                disabled={isSigned}
                value={contract.exclusivity || ""}
                onChange={(event) =>
                  setContract({
                    ...contract,
                    exclusivity: event.target.value,
                  })
                }
                className="input"
              />
            </Field>

            <Field label="Revenue Share">
              <input
                type="number"
                min="0"
                max="100"
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
          <EditorPanel
            eyebrow="Agreement"
            title="Contract Text"
            description="The complete legal agreement presented to the content partner."
          >
            <textarea
              disabled={isSigned}
              value={contract.contractText || ""}
              onChange={(event) =>
                setContract({
                  ...contract,
                  contractText: event.target.value,
                })
              }
              className="min-h-[620px] w-full resize-y rounded-2xl border border-white/10 bg-[#05070d] px-4 py-4 font-mono text-sm leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/60 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </EditorPanel>

          <EditorPanel
            eyebrow="Internal"
            title="Admin Notes"
            description="Private notes visible only to SourceTV administrators."
          >
            <textarea
              disabled={isSigned}
              value={contract.adminNotes || ""}
              onChange={(event) =>
                setContract({
                  ...contract,
                  adminNotes: event.target.value,
                })
              }
              className="min-h-32 w-full resize-y rounded-2xl border border-white/10 bg-[#05070d] px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/60 disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Internal notes for SourceTV only..."
            />
          </EditorPanel>

          {contract.partnerNotes && (
            <EditorPanel
              eyebrow="Partner"
              title="Partner Notes"
              description="Feedback or requested changes submitted by the partner."
            >
              <p className="text-sm leading-7 text-white/60">
                {contract.partnerNotes}
              </p>
            </EditorPanel>
          )}
        </div>
      </section>
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
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
        Contract Timeline
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="relative rounded-2xl border border-white/10 bg-white/[0.025] p-4"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                step.complete
                  ? "border-sky-300/45 bg-sky-300/10 text-sky-200"
                  : "border-white/10 bg-white/[0.035] text-white/30"
              }`}
            >
              {step.complete ? "✓" : index + 1}
            </div>

            <p className="mt-3 text-sm font-semibold text-white">
              {step.label}
            </p>

            <p className="mt-1 text-xs text-white/40">
              {formatDate(step.date)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusNotice({
  eyebrow,
  title,
  description,
  tone,
}: {
  eyebrow: string;
  title: string;
  description: string;
  tone: "yellow" | "sky" | "purple" | "green";
}) {
  const classes =
    tone === "yellow"
      ? "border-yellow-300/20 bg-yellow-300/[0.06] text-yellow-200"
      : tone === "purple"
        ? "border-purple-300/20 bg-purple-300/[0.06] text-purple-200"
        : tone === "green"
          ? "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-200"
          : "border-sky-300/20 bg-sky-300/[0.06] text-sky-200";

  return (
    <section className={`rounded-2xl border p-5 ${classes}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-lg font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
    </section>
  );
}

function EditorPanel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>

      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
        {label}
      </span>

      {children}
    </label>
  );
}