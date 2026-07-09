export default function TextBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-sm leading-7 text-white/55">{value}</p>
    </div>
  );
}