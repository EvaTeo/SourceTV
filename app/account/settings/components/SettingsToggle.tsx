"use client";

export default function SettingsToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-white/[0.06] bg-black/22 px-4 py-3.5 transition hover:border-white/10 hover:bg-white/[0.025]">
      <div className="min-w-0">
        <p className="text-sm font-bold text-white/80">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs leading-5 text-white/35">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full border transition duration-300 ${
          checked
            ? "border-sky-300/45 bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.28)]"
            : "border-white/12 bg-white/[0.08]"
        }`}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_3px_10px_rgba(0,0,0,0.35)] transition-all duration-300 ${
            checked ? "left-[25px]" : "left-[3px]"
          }`}
        />
      </button>
    </div>
  );
}