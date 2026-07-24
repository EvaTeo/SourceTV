type ComingSoonMetricProps = {
  label: string;
};

export default function ComingSoonMetric({
  label,
}: ComingSoonMetricProps) {
  return (
    <div className="bg-[#090c13] p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-white/45">
        Coming Soon
      </p>
    </div>
  );
}