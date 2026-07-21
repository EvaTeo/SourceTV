type ContractMetricProps = {
  label: string;
  value: string;
};

export default function ContractMetric({
  label,
  value,
}: ContractMetricProps) {
  return (
    <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:p-6 md:last:border-r-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-white/75">
        {value}
      </p>
    </div>
  );
}