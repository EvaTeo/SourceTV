import type { MouseEvent, RefObject, TouchEvent } from "react";

import SignatureCanvas from "./SignatureCanvas";

type SignatureModalProps = {
  saving: boolean;
  signatureName: string;
  agreed: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onSignatureNameChange: (value: string) => void;
  onAgreedChange: (value: boolean) => void;
  onStartDrawing: (
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) => void;
  onDraw: (
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) => void;
  onStopDrawing: () => void;
  onClearSignature: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function SignatureModal({
  saving,
  signatureName,
  agreed,
  canvasRef,
  onSignatureNameChange,
  onAgreedChange,
  onStartDrawing,
  onDraw,
  onStopDrawing,
  onClearSignature,
  onCancel,
  onSubmit,
}: SignatureModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#070a11] shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
        <div className="border-b border-white/10 px-6 py-6 md:px-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-sky-300">
            Electronic Signature
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Accept and Sign
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/45">
            Enter your legal name, draw your signature, and confirm your
            authority to sign this agreement.
          </p>
        </div>

        <div className="grid gap-6 px-6 py-6 md:px-8 md:py-8">
          <label>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
              Legal Full Name
            </span>

            <input
              value={signatureName}
              onChange={(event) =>
                onSignatureNameChange(event.target.value)
              }
              placeholder="Enter your legal name"
              className="w-full border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-300/60"
            />
          </label>

          <SignatureCanvas
            canvasRef={canvasRef}
            onStartDrawing={onStartDrawing}
            onDraw={onDraw}
            onStopDrawing={onStopDrawing}
            onClear={onClearSignature}
          />

          <label className="flex gap-3 border-l-2 border-sky-300 bg-sky-300/[0.035] px-4 py-4 text-sm leading-6 text-white/65">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => onAgreedChange(event.target.checked)}
              className="mt-1 h-4 w-4 accent-sky-300"
            />

            <span>
              I agree to the terms of this SourceTV streaming rights agreement
              and confirm that I have authority to sign for this title.
            </span>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={onCancel}
              className="border border-white/10 px-5 py-3 text-sm font-semibold text-white/55 transition hover:border-white/25 hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={onSubmit}
              className="bg-sky-300 px-6 py-3 text-sm font-black text-[#05070d] transition hover:bg-sky-200 disabled:opacity-40"
            >
              {saving ? "Signing..." : "Submit Signature"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}