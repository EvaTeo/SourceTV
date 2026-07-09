type Props = {
  label: string;
  value: string;
};

export default function MiniStat({ label, value }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-white">
        {value}
      </p>
    </div>
  );
}