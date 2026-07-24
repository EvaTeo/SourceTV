import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
  attention?: boolean;
  icon: ReactNode;
};

export default function MetricCard({
  label,
  value,
  detail,
  attention = false,
  icon,
}: MetricCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        attention
          ? "border-yellow-300/15 bg-yellow-300/[0.04]"
          : "border-white/10 bg-white/[0.035]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full blur-3xl ${
          attention
            ? "bg-yellow-300/10"
            : "bg-sky-300/[0.06]"
        }`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-[10px] font-black uppercase tracking-[0.2em] ${
              attention
                ? "text-yellow-100"
                : "text-white/35"
            }`}
          >
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-white/30">
            {detail}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
            attention
              ? "border-yellow-300/15 bg-yellow-300/[0.06] text-yellow-100"
              : "border-white/10 bg-black/20 text-sky-200"
          }`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}