export function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <span className="text-[11px] font-black uppercase tracking-[0.17em] text-white/38">
      {label}

      {required && (
        <span className="ml-1 text-sky-300">
          *
        </span>
      )}
    </span>
  );
}

export function TextField({
  label,
  value,
  placeholder,
  required = false,
  type = "text",
  min,
  max,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  min?: string;
  max?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel
        label={label}
        required={required}
      />

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/18 hover:border-white/16 hover:bg-black/25 focus:border-sky-300/55 focus:bg-black/35 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.06)]"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <FieldLabel label={label} />

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-[#080b11] px-4 text-sm text-white outline-none transition hover:border-white/16 focus:border-sky-300/55 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.06)]"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  placeholder,
  required = false,
  maxLength,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  maxLength: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-5 block">
      <div className="flex items-center justify-between gap-4">
        <FieldLabel
          label={label}
          required={required}
        />

        <span className="text-[10px] font-bold text-white/22">
          {value.length}/{maxLength}
        </span>
      </div>

      <textarea
        value={value}
        required={required}
        maxLength={maxLength}
        rows={6}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/18 hover:border-white/16 hover:bg-black/25 focus:border-sky-300/55 focus:bg-black/35 focus:shadow-[0_0_0_3px_rgba(125,211,252,0.06)]"
      />
    </label>
  );
}
