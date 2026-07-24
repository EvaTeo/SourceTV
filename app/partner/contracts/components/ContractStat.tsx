type ContractStatProps = {
  label: string;
  value: number;
  description: string;
};

export default function ContractStat({
  label,
  value,
  description,
}: ContractStatProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/15 hover:bg-white/[0.045]">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {description}
      </p>
    </div>
  );
}