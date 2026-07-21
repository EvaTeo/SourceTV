"use client";

import { useEffect, useRef, type MouseEvent, type TouchEvent } from "react";
import { useParams } from "next/navigation";

import AgreementOverview from "./components/AgreementOverview";
import ContractDetailHeader from "./components/ContractDetailHeader";
import ContractMetric from "./components/ContractMetric";
import ContractTimeline from "./components/ContractTimeline";
import EmptyPanel from "./components/EmptyPanel";
import LegalAgreement from "./components/LegalAgreement";
import RequestChangesPanel from "./components/RequestChangesPanel";
import SignatureModal from "./components/SignatureModal";
import StatusNotice from "./components/StatusNotice";
import usePartnerContract from "./hooks/usePartnerContract";

export default function PartnerContractDetailClient() {
  const params = useParams<{ id: string }>();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  const {
    contract,
    loading,
    saving,

    changeNotes,
    setChangeNotes,
    showChangeBox,
    setShowChangeBox,

    showSignatureModal,
    setShowSignatureModal,
    signatureName,
    setSignatureName,
    signatureDataUrl,
    setSignatureDataUrl,
    agreed,
    setAgreed,

    signContract,
    requestChanges,
  } = usePartnerContract(params.id);

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
    <main className="mx-auto w-full max-w-[1180px] px-4 pb-16 pt-8 text-white md:px-6 md:pt-10">
      <ContractDetailHeader
        contract={contract}
        saving={saving}
        locked={locked}
        onToggleChanges={() =>
          setShowChangeBox((current) => !current)
        }
        onOpenSignature={() => setShowSignatureModal(true)}
      />

      <section className="mt-6 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-4">
        <ContractMetric
          label="Revenue Share"
          value={`${contract.revenueShare ?? 50}%`}
        />

        <ContractMetric
          label="License Type"
          value={contract.licenseType || "Not set"}
        />

        <ContractMetric
          label="Territories"
          value={contract.territories || "Not set"}
        />

        <ContractMetric
          label="Exclusivity"
          value={contract.exclusivity || "Not set"}
        />
      </section>

      <ContractTimeline contract={contract} />

      <div className="space-y-5 py-8">
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
                ? "Your electronic signature has been recorded and this agreement can no longer be edited."
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
          <RequestChangesPanel
            changeNotes={changeNotes}
            saving={saving}
            onChangeNotes={setChangeNotes}
            onCancel={() => setShowChangeBox(false)}
            onSubmit={requestChanges}
          />
        )}
      </div>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.76fr_1.24fr]">
        <AgreementOverview contract={contract} />
        <LegalAgreement contract={contract} />
      </section>

      {showSignatureModal && !locked && (
        <SignatureModal
          saving={saving}
          signatureName={signatureName}
          agreed={agreed}
          canvasRef={canvasRef}
          onSignatureNameChange={setSignatureName}
          onAgreedChange={setAgreed}
          onStartDrawing={startDrawing}
          onDraw={drawSignature}
          onStopDrawing={stopDrawing}
          onClearSignature={clearSignature}
          onCancel={() => setShowSignatureModal(false)}
          onSubmit={signContract}
        />
      )}
    </main>
  );
}