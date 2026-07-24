type SideDetailProps = {
  label: string;
  value: string;
};

export default function SideDetail({
  label,
  value,
}: SideDetailProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs font-semibold text-white/30">
        {label}
      </p>

      <p className="max-w-[180px] text-right text-xs font-black text-white/65">
        {value}
      </p>
    </div>
  );
}