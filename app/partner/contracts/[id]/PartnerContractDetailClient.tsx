"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type TouchEvent,
} from "react";

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
    description?: string | null;
    creatorName?: string | null;
    creatorEmail?: string | null;
    creatorCompany?: string | null;
  };
};

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

  if (status === "viewed") {
    return "border-purple-300/35 bg-purple-300/10 text-purple-200";
  }

  if (status === "changes_requested") {
    return "border-yellow-300/35 bg-yellow-300/10 text-yellow-100";
  }

  if (status === "sent") {
    return "border-sky-300/35 bg-sky-300/10 text-sky-200";
  }

  if (status === "cancelled" || status === "expired") {
    return "border-red-300/35 bg-red-300/10 text-red-200";
  }

  return "border-white/10 bg-white/[0.035] text-white/60";
}

export default function PartnerContractDetailClient() {
  const params = useParams<{ id: string }>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [changeNotes, setChangeNotes] = useState("");
  const [showChangeBox, setShowChangeBox] = useState(false);

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [agreed, setAgreed] = useState(false);

  async function loadContract() {
    try {
      setLoading(true);

      const res = await fetch(`/api/partner/contracts/${params.id}`, {
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
      setChangeNotes(data.partnerNotes || "");
      setSignatureName(data.partnerSignatureName || "");
      setSignatureDataUrl(data.partnerSignatureDataUrl || "");
    } catch (error) {
      console.error("LOAD PARTNER CONTRACT ERROR:", error);
      alert("Could not load contract.");
      setContract(null);
    } finally {
      setLoading(false);
    }
  }

  function prepareCanvas() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    const context = canvas.getContext("2d");

    if (!context) return;

    context.scale(scale, scale);
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#111111";

    if (signatureDataUrl) {
      const image = new Image();

      image.onload = () => {
        context.drawImage(image, 0, 0, rect.width, rect.height);
      };

      image.src = signatureDataUrl;
    }
  }

  function getCanvasPoint(
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) {
    const canvas = canvasRef.current;

    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ("touches" in event) {
      const touch = event.touches[0] || event.changedTouches[0];

      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function startDrawing(
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) {
    event.preventDefault();

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getCanvasPoint(event);

    if (!context || !point) return;

    drawingRef.current = true;
    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  function drawSignature(
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) {
    event.preventDefault();

    if (!drawingRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const point = getCanvasPoint(event);

    if (!context || !point || !canvas) return;

    context.lineTo(point.x, point.y);
    context.stroke();
  }

  function stopDrawing() {
    drawingRef.current = false;

    const canvas = canvasRef.current;

    if (!canvas) return;

    setSignatureDataUrl(canvas.toDataURL("image/png"));
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl("");
  }

  async function signContract() {
    if (!contract) return;

    if (!signatureName.trim()) {
      alert("Please enter your legal name.");
      return;
    }

    if (!signatureDataUrl) {
      alert("Please draw your signature.");
      return;
    }

    if (!agreed) {
      alert("You must agree to the contract terms.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/partner/contracts/${contract.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sign",
          signatureName: signatureName.trim(),
          signatureDataUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not sign contract.");
        return;
      }

      setContract(data);
      setShowSignatureModal(false);
      setAgreed(false);
    } catch (error) {
      console.error("SIGN CONTRACT ERROR:", error);
      alert("Could not sign contract.");
    } finally {
      setSaving(false);
    }
  }

  async function requestChanges() {
    if (!contract) return;

    if (!changeNotes.trim()) {
      alert("Please explain what changes you are requesting.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/partner/contracts/${contract.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "request_changes",
          partnerNotes: changeNotes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not request changes.");
        return;
      }

      setContract(data);
      setShowChangeBox(false);
    } catch (error) {
      console.error("REQUEST CONTRACT CHANGES ERROR:", error);
      alert("Could not request changes.");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadContract();
  }, []);

  useEffect(() => {
    if (!showSignatureModal) return;

    const timeout = window.setTimeout(prepareCanvas, 50);

    return () => window.clearTimeout(timeout);
  }, [showSignatureModal]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <EmptyPanel
          title="Loading agreement..."
          description="Retrieving your SourceTV rights contract."
        />
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <EmptyPanel
          title="Contract not found."
          description="This agreement could not be loaded or may no longer be available."
        />
      </main>
    );
  }

  const locked =
    contract.status === "signed" ||
    contract.status === "cancelled" ||
    contract.status === "expired";

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 text-white">
      <section className="border-b border-white/10 pb-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              SourceTV Rights Agreement
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              {contract.project?.title || "Streaming Rights Agreement"}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/45">
              Review the agreement carefully. Signing confirms that you have
              authority to grant SourceTV the streaming rights listed below.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
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

              {contract.licenseType && (
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  {contract.licenseType}
                </span>
              )}

              {contract.exclusivity && (
                <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  {contract.exclusivity}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/partner/contracts"
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Contracts
            </Link>

            <button
              type="button"
              disabled={saving || locked}
              onClick={() => setShowSignatureModal(true)}
              className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving..." : "Accept & Sign"}
            </button>

            <button
              type="button"
              disabled={saving || locked}
              onClick={() => setShowChangeBox((current) => !current)}
              className="rounded-xl border border-yellow-300/25 bg-yellow-300/10 px-4 py-2.5 text-sm font-semibold text-yellow-100 transition hover:border-yellow-300/45 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Request Changes
            </button>
          </div>
        </div>
      </section>

      <ContractTimeline contract={contract} />

      {locked && (
        <StatusNotice
          eyebrow="Agreement Locked"
          title={
            contract.status === "signed"
              ? "This agreement has been signed."
              : `This agreement is ${contract.status}.`
          }
          description={
            contract.status === "signed"
              ? "Your electronic signature has been recorded and the agreement can no longer be edited."
              : "No further action can be taken on this agreement."
          }
          tone={contract.status === "signed" ? "green" : "red"}
        />
      )}

      {contract.status === "changes_requested" && !locked && (
        <StatusNotice
          eyebrow="Changes Requested"
          title="Your requested changes were sent to SourceTV."
          description="SourceTV will review your notes and may send an updated agreement."
          tone="yellow"
        />
      )}

      {showChangeBox && !locked && (
        <section className="rounded-2xl border border-yellow-300/20 bg-yellow-300/[0.05] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-100">
            Request Contract Changes
          </p>

          <p className="mt-2 text-sm leading-6 text-white/50">
            Explain which terms or details should be reviewed by SourceTV.
          </p>

          <textarea
            value={changeNotes}
            onChange={(event) => setChangeNotes(event.target.value)}
            placeholder="Describe the requested edits..."
            className="mt-4 min-h-36 w-full resize-y rounded-2xl border border-white/10 bg-[#05070d] px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/25 focus:border-yellow-300/60"
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => setShowChangeBox(false)}
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/60 transition hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={requestChanges}
              className="rounded-xl bg-yellow-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-yellow-200 disabled:opacity-40"
            >
              {saving ? "Sending..." : "Send Request"}
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <div className="space-y-6">
          <InfoPanel
            eyebrow="Agreement"
            title="Agreement Terms"
            description="Partner, ownership, licensing, and revenue terms."
          >
            <InfoRow
              label="Partner"
              value={contract.partnerName || "Not set"}
            />

            <InfoRow
              label="Partner Email"
              value={contract.partnerEmail || "Not set"}
            />

            <InfoRow
              label="Rights Owner"
              value={contract.rightsOwner || "Not set"}
            />

            <InfoRow
              label="Rights Contact"
              value={contract.rightsContact || "Not set"}
            />

            <InfoRow
              label="License Type"
              value={contract.licenseType || "Not set"}
            />

            <InfoRow
              label="Territories"
              value={contract.territories || "Not set"}
            />

            <InfoRow
              label="Exclusivity"
              value={contract.exclusivity || "Not set"}
            />

            <InfoRow
              label="Revenue Share"
              value={`${contract.revenueShare ?? 50}%`}
            />
          </InfoPanel>

          <InfoPanel
            eyebrow="Schedule"
            title="Agreement Dates"
            description="License term and contract activity dates."
          >
            <InfoRow
              label="License Starts"
              value={formatDate(contract.licenseStartDate)}
            />

            <InfoRow
              label="License Ends"
              value={formatDate(contract.licenseEndDate)}
            />

            <InfoRow label="Sent" value={formatDate(contract.sentAt)} />

            <InfoRow label="Viewed" value={formatDate(contract.viewedAt)} />

            <InfoRow label="Signed" value={formatDate(contract.signedAt)} />
          </InfoPanel>

          {contract.partnerSignatureName && (
            <InfoPanel
              eyebrow="Execution"
              title="Signature Record"
              description="The electronic signature attached to this agreement."
            >
              <InfoRow
                label="Signed By"
                value={contract.partnerSignatureName}
              />

              {contract.partnerSignatureDataUrl && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Drawn Signature
                  </p>

                  <img
                    src={contract.partnerSignatureDataUrl}
                    alt="Partner signature"
                    className="mt-3 max-h-32 rounded-xl border border-white/10 bg-white p-3"
                  />
                </div>
              )}
            </InfoPanel>
          )}

          {contract.partnerNotes && (
            <InfoPanel
              eyebrow="Partner"
              title="Your Notes"
              description="Your most recent notes or requested changes."
            >
              <p className="text-sm leading-7 text-white/60">
                {contract.partnerNotes}
              </p>
            </InfoPanel>
          )}
        </div>

        <InfoPanel
          eyebrow="Legal Agreement"
          title="Contract Text"
          description="Read the complete agreement before accepting and signing."
        >
          <div className="max-h-[760px] overflow-y-auto whitespace-pre-line rounded-2xl border border-white/10 bg-[#05070d] p-5 text-sm leading-8 text-white/70">
            {contract.contractText || "No contract text provided."}
          </div>
        </InfoPanel>
      </section>

      {showSignatureModal && !locked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#05070d] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
              Electronic Signature
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
              Accept and Sign
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Enter your legal name, draw your signature, and confirm your
              authority to sign this agreement.
            </p>

            <div className="mt-6 grid gap-5">
              <label>
                <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                  Legal Full Name
                </span>

                <input
                  value={signatureName}
                  onChange={(event) => setSignatureName(event.target.value)}
                  placeholder="Enter your legal name"
                  className="w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-300/60"
                />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Draw Signature
                  </span>

                  <button
                    type="button"
                    onClick={clearSignature}
                    className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-white/55 transition hover:text-white"
                  >
                    Clear
                  </button>
                </div>

                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={drawSignature}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={drawSignature}
                  onTouchEnd={stopDrawing}
                  className="h-48 w-full touch-none rounded-2xl border border-slate-300 bg-white"
                />

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Use a mouse, trackpad, finger, or stylus.
                </p>
              </div>

              <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-sm leading-6 text-white/65">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-sky-300"
                />

                <span>
                  I agree to the terms of this SourceTV streaming rights
                  agreement and confirm that I have authority to sign for this
                  title.
                </span>
              </label>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setShowSignatureModal(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-medium text-white/55 transition hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={signContract}
                  className="rounded-xl bg-sky-300 px-5 py-3 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:opacity-40"
                >
                  {saving ? "Signing..." : "Submit Signature"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
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
  tone: "yellow" | "green" | "red";
}) {
  const classes =
    tone === "green"
      ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-200"
      : tone === "red"
        ? "border-red-300/20 bg-red-300/[0.05] text-red-200"
        : "border-yellow-300/20 bg-yellow-300/[0.05] text-yellow-100";

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

function InfoPanel({
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

      <div className="mt-5 grid gap-3">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium text-white/70">
        {value}
      </p>
    </div>
  );
}

function EmptyPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-white">
      <h1 className="text-xl font-semibold">{title}</h1>

      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>
    </section>
  );
}