type DetailRowProps = {
  label: string;
  value: string;
};

export default function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="grid gap-2 border-b border-white/10 py-4 sm:grid-cols-[140px_1fr] sm:gap-6">
      <dt className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/30">
        {label}
      </dt>

      <dd className="break-words text-sm font-medium leading-6 text-white/70">
        {value}
      </dd>
    </div>
  );
}