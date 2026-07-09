type Props = {
  label: string;
  value: string | number;
};

export default function InfoRow({ label, value }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <p className="min-w-0 truncate text-sm text-white/60">{label}</p>
      <p className="shrink-0 text-right text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}