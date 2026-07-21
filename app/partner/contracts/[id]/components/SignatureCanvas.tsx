import {
  type MouseEvent,
  type TouchEvent,
  type RefObject,
} from "react";

type SignatureCanvasProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onStartDrawing: (
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) => void;
  onDraw: (
    event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) => void;
  onStopDrawing: () => void;
  onClear: () => void;
};

export default function SignatureCanvas({
  canvasRef,
  onStartDrawing,
  onDraw,
  onStopDrawing,
  onClear,
}: SignatureCanvasProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          Draw Signature
        </span>

        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-white/45 transition hover:text-white"
        >
          Clear Signature
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={onStartDrawing}
        onMouseMove={onDraw}
        onMouseUp={onStopDrawing}
        onMouseLeave={onStopDrawing}
        onTouchStart={onStartDrawing}
        onTouchMove={onDraw}
        onTouchEnd={onStopDrawing}
        className="h-48 w-full touch-none border border-slate-300 bg-white"
      />

      <p className="mt-2 text-xs leading-5 text-white/35">
        Use a mouse, trackpad, finger, or stylus.
      </p>
    </div>
  );
}