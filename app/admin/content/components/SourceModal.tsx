import type { ReactNode } from "react";

type Props = {
  title: string;
  eyebrow: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
};

export default function SourceModal({
  title,
  eyebrow,
  description,
  children,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/78 backdrop-blur-xl"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/90 p-5 shadow-[0_30px_120px_rgba(0,0,0,0.7)] ring-1 ring-sky-300/10 md:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.18),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
                {eyebrow}
              </p>

              <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
                {title}
              </h2>

              {description && (
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white/50 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
            >
              ✕
            </button>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}