type Props = {
  label: string;
  value: number;
  total: number;
};

function formatNumber(value: number) {
  return value.toLocaleString();
}

export default function ProgressRow({ label, value, total }: Props) {
  const width = Math.max(4, Math.round((value / total) * 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="truncate text-sm capitalize text-white/60">{label}</p>
        <p className="text-sm font-semibold text-white">
          {formatNumber(value)}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-sky-300"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}