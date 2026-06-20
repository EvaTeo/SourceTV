"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
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
  if (status === "signed")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (status === "viewed")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";
  if (status === "changes_requested")
    return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
  if (status === "sent")
    return "border-sky-300/40 bg-sky-300/12 text-sky-200";

  return "border-white/15 bg-white/[0.05] text-white/65";
}

export default function PartnerContractDetailPage() {
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
        return;
      }

      setContract(data);
      setChangeNotes(data.partnerNotes || "");
      setSignatureName(data.partnerSignatureName || "");
      setSignatureDataUrl(data.partnerSignatureDataUrl || "");
    } catch (error) {
      console.error("LOAD PARTNER CONTRACT ERROR:", error);
      alert("Could not load contract.");
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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(scale, scale);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111111";

    if (signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = signatureDataUrl;
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
    const ctx = canvas?.getContext("2d");
    const point = getCanvasPoint(event);

    if (!ctx || !point) return;

    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }

  function drawSignature(
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) {
    event.preventDefault();

    if (!drawingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const point = getCanvasPoint(event);

    if (!ctx || !point || !canvas) return;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();

    setSignatureDataUrl(canvas.toDataURL("image/png"));
  }

  function stopDrawing() {
    drawingRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setSignatureDataUrl(canvas.toDataURL("image/png"));
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    if (showSignatureModal) {
      setTimeout(prepareCanvas, 50);
    }
  }, [showSignatureModal]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-4 pt-28 text-white md:px-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
          Loading contract...
        </div>
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="min-h-screen bg-black px-4 pt-28 text-white md:px-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
          Contract not found.
        </div>
      </main>
    );
  }

  const locked =
    contract.status === "signed" ||
    contract.status === "cancelled" ||
    contract.status === "expired";

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Link
          href="/partner/contracts"
          className="text-sm font-black text-sky-300 transition hover:text-sky-200"
        >
          ← Back to Contracts
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Streaming Rights Agreement
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-6xl">
                {contract.project?.title || "Contract"}
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
              </div>

              {contract.licenseType && (
  <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/55">
    {contract.licenseType}
  </span>
)}

{contract.exclusivity && (
  <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/55">
    {contract.exclusivity}
  </span>
)}

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">
                Review this agreement carefully. Signing confirms that you have
                the authority to grant SourceTV streaming rights for this title
                under the listed terms.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                disabled={saving || locked}
                onClick={() => setShowSignatureModal(true)}
                className="rounded-md bg-sky-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? "Saving..." : "Accept & Sign"}
              </button>

              <button
                disabled={saving || locked}
                onClick={() => setShowChangeBox((current) => !current)}
                className="rounded-md border border-yellow-300/35 bg-yellow-300/10 px-4 py-2.5 text-xs font-black text-yellow-100 transition hover:border-yellow-300/70 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Request Changes
              </button>
            </div>
          </div>
        </section>

        <ContractTimeline contract={contract} />

        {locked && (
          <section className="mt-6 rounded-[1.6rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-5 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200">
              Executed Agreement
            </p>

            <h2 className="mt-2 text-xl font-black text-white">
              This agreement has been signed and locked.
            </h2>
          </section>
        )}

        {showChangeBox && !locked && (
          <section className="mt-6 rounded-[1.6rem] border border-yellow-300/20 bg-yellow-300/[0.06] p-5 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-100">
              Request Contract Changes
            </p>

            <textarea
              value={changeNotes}
              onChange={(event) => setChangeNotes(event.target.value)}
              placeholder="Explain the edits or terms you want SourceTV to review..."
              className="mt-4 min-h-36 w-full resize-y rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/25 focus:border-yellow-300/60"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                disabled={saving}
                onClick={() => setShowChangeBox(false)}
                className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/60 transition hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={requestChanges}
                className="rounded-md bg-yellow-300 px-4 py-2.5 text-xs font-black text-black transition hover:bg-yellow-200 disabled:opacity-40"
              >
                Send Request
              </button>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="space-y-6">
            <InfoPanel title="Agreement Terms">
              <InfoRow label="Partner" value={contract.partnerName || "Not set"} />
              <InfoRow label="Partner Email" value={contract.partnerEmail || "Not set"} />
              <InfoRow label="Rights Owner" value={contract.rightsOwner || "Not set"} />
              <InfoRow label="Rights Contact" value={contract.rightsContact || "Not set"} />
              <InfoRow label="License Type" value={contract.licenseType || "Not set"} />
              <InfoRow label="Territories" value={contract.territories || "Not set"} />
              <InfoRow label="Exclusivity" value={contract.exclusivity || "Not set"} />
              <InfoRow label="Revenue Share" value={`${contract.revenueShare ?? 50}%`} />
            </InfoPanel>

            <InfoPanel title="Dates">
              <InfoRow label="License Starts" value={formatDate(contract.licenseStartDate)} />
              <InfoRow label="License Ends" value={formatDate(contract.licenseEndDate)} />
              <InfoRow label="Sent" value={formatDate(contract.sentAt)} />
              <InfoRow label="Viewed" value={formatDate(contract.viewedAt)} />
              <InfoRow label="Signed" value={formatDate(contract.signedAt)} />
            </InfoPanel>

            {contract.partnerSignatureName && (
              <InfoPanel title="Signature">
                <InfoRow label="Signed By" value={contract.partnerSignatureName} />

                {contract.partnerSignatureDataUrl && (
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
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
              <InfoPanel title="Your Notes">
                <p className="text-sm leading-7 text-white/60">
                  {contract.partnerNotes}
                </p>
              </InfoPanel>
            )}
          </div>

          <InfoPanel title="Contract Text">
            <div className="max-h-[760px] overflow-y-auto whitespace-pre-line rounded-2xl border border-white/10 bg-black/45 p-5 text-sm leading-8 text-white/70">
              {contract.contractText || "No contract text provided."}
            </div>
          </InfoPanel>
        </section>
      </div>

      {showSignatureModal && !locked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-xl">
          <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-zinc-950 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
              Electronic Signature
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Accept & Sign
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Type your legal name, draw your signature, and confirm that you
              agree to the SourceTV streaming rights agreement.
            </p>

            <div className="mt-6 grid gap-4">
              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Legal Full Name
                </span>

                <input
                  value={signatureName}
                  onChange={(event) => setSignatureName(event.target.value)}
                  placeholder="Enter your legal name"
                  className="w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-sky-300/60"
                />
              </label>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                    Draw Signature
                  </span>

                  <button
                    type="button"
                    onClick={clearSignature}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-black text-white/55 transition hover:text-white"
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
                  Use your mouse, trackpad, finger, or stylus to draw your
                  signature.
                </p>
              </div>

              <label className="flex gap-3 rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/65">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-1"
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
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black text-white/55 transition hover:border-white/25 hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={signContract}
                  className="rounded-xl bg-sky-400 px-5 py-3 text-xs font-black text-black transition hover:bg-sky-300 disabled:opacity-40"
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

function InfoPanel({
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

      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
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