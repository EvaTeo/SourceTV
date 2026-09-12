type MetricCardProps = {
  label: string;
  value: number;
  description?: string;
};

export default function MetricCard({
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-white">
        {value}
      </p>

      {description ? (
        <p className="mt-2 text-sm text-white/35">
          {description}
        </p>
      ) : null}
    </div>
  );
}