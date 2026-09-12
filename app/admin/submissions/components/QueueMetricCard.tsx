type QueueMetricCardProps = {
  label: string;
  value: number;
  description: string;
  emphasis?: boolean;
};

export default function QueueMetricCard({
  label,
  value,
  description,
  emphasis = false,
}: QueueMetricCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-4 ${
        emphasis
          ? "border-sky-300/18 bg-gradient-to-br from-sky-300/[0.08] to-white/[0.02]"
          : "border-white/10 bg-white/[0.025]"
      }`}
    >
      {emphasis && (
        <div className="pointer-events-none absolute -right-14 -top-16 h-36 w-36 rounded-full bg-sky-300/[0.1] blur-[55px]" />
      )}

      <div className="relative">
        <p className="text-[10px] font-black uppercase tracking-[0.17em] text-white/30">
          {label}
        </p>

        <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
          {value}
        </p>

        <p className="mt-1 text-xs text-white/30">
          {description}
        </p>
      </div>
    </article>
  );
}