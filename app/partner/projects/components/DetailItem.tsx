type DetailItemProps = {
  label: string;
  value: string;
};

export default function DetailItem({
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/28">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white/70">
        {value}
      </p>
    </div>
  );
}