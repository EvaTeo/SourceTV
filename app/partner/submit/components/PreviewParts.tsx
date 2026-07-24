import type { ReactNode } from "react";

export function PreviewTab({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] transition ${
        active
          ? "bg-white text-black shadow-md"
          : "text-white/35 hover:bg-white/[0.04] hover:text-white/70"
      } disabled:cursor-not-allowed disabled:opacity-25`}
    >
      {children}
    </button>
  );
}

export function EmptyVideoPreview({
  backdropPreview,
  titleLogoPreview,
  title,
}: {
  backdropPreview: string;
  titleLogoPreview: string;
  title: string;
}) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: backdropPreview
          ? `url("${backdropPreview}")`
          : "radial-gradient(circle at 70% 20%, rgba(56,189,248,0.2), transparent 34%), linear-gradient(135deg, #111827, #05070d)",
      }}
    >
      <div className="absolute inset-0 bg-black/58" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

      <div className="relative z-10 max-w-sm px-6 text-center">
        {titleLogoPreview ? (
          <img
            src={titleLogoPreview}
            alt=""
            className="mx-auto max-h-16 max-w-[80%] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
          />
        ) : (
          <p className="text-2xl font-semibold tracking-[-0.03em] text-white/78">
            {title || "Video Preview"}
          </p>
        )}

        <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-white/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          ▶
        </div>

        <p className="mt-4 text-xs leading-5 text-white/38">
          Upload the main project video or trailer to preview
          it here before submission.
        </p>
      </div>
    </div>
  );
}

export function MediaStatus({
  label,
  ready,
}: {
  label: string;
  ready: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${
        ready
          ? "border-emerald-300/12 bg-emerald-300/[0.025]"
          : "border-white/[0.07] bg-black/15"
      }`}
    >
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <p
        className={`mt-1 text-xs font-semibold ${
          ready
            ? "text-emerald-300"
            : "text-white/32"
        }`}
      >
        {ready ? "Ready" : "Not added"}
      </p>
    </div>
  );
}
