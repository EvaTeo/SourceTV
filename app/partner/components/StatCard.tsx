type StatCardProps = {
  label: string;
  value: number;
};

export default function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight">
        {value}
      </p>
    </div>
  );
}