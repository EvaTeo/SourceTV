import type { ReactNode } from "react";

export default function EmptyState({
  title,
  description,
  action,
  compact = false,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center ${
        compact ? "p-6" : "min-h-[420px] p-10"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl text-sky-300">
        ▦
      </div>

      <h2
        className={`font-semibold text-white ${
          compact ? "mt-4 text-base" : "mt-5 text-xl"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}