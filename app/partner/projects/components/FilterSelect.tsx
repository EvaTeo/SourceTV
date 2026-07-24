type FilterOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
};

export default function FilterSelect({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) {
  return (
    <label>
      <span className="sr-only">{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-12 w-full rounded-xl border border-white/10 bg-[#090c13] px-4 text-sm font-semibold text-white/70 outline-none transition hover:border-white/15 focus:border-sky-300/40"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#080b12] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}