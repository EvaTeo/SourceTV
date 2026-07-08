import type { ReactNode } from "react";

type Variant = "primary" | "green" | "blue" | "purple" | "red" | "default";

export default function ActionButton({
  children,
  disabled,
  onClick,
  variant,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  variant: Variant;
}) {
  const classes: Record<Variant, string> = {
    primary: "bg-sky-300 text-[#05070d] hover:bg-sky-200",
    green:
      "border border-emerald-300/25 bg-emerald-300/10 text-emerald-300 hover:border-emerald-300/45",
    blue:
      "border border-sky-300/25 bg-sky-300/10 text-sky-300 hover:border-sky-300/45",
    purple:
      "border border-purple-300/25 bg-purple-300/10 text-purple-300 hover:border-purple-300/45",
    red:
      "border border-red-300/25 bg-red-300/10 text-red-300 hover:border-red-300/45",
    default:
      "border border-white/10 bg-white/[0.035] text-white/60 hover:border-white/20 hover:bg-white/[0.055] hover:text-white",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${classes[variant]}`}
    >
      {children}
    </button>
  );
}