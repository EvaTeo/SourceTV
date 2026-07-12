import Link from "next/link";
import type { ReactNode } from "react";

export default function AccountAction({
  label,
  description,
  href,
  icon,
  danger = false,
  onClick,
}: {
  label: string;
  description?: string;
  href?: string;
  icon?: ReactNode;
  danger?: boolean;
  onClick?: () => void;
}) {
  const className = `group flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition ${
    danger
      ? "border-red-300/10 bg-red-300/[0.025] hover:border-red-300/25 hover:bg-red-300/[0.06]"
      : "border-white/[0.06] bg-black/22 hover:border-sky-300/25 hover:bg-sky-300/[0.055]"
  }`;

  const content = (
    <>
      <span className="flex min-w-0 items-center gap-3">
        {icon && (
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
              danger
                ? "border-red-300/10 bg-red-300/[0.04] text-red-200/65"
                : "border-white/[0.07] bg-white/[0.035] text-white/45 group-hover:text-sky-200"
            }`}
          >
            {icon}
          </span>
        )}

        <span className="min-w-0">
          <span
            className={`block text-sm font-bold ${
              danger
                ? "text-red-100/75"
                : "text-white/78 group-hover:text-white"
            }`}
          >
            {label}
          </span>

          {description && (
            <span className="mt-0.5 block text-xs leading-5 text-white/32">
              {description}
            </span>
          )}
        </span>
      </span>

      <span
        className={`shrink-0 text-lg transition group-hover:translate-x-0.5 ${
          danger ? "text-red-200/35" : "text-white/25"
        }`}
        aria-hidden="true"
      >
        →
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}