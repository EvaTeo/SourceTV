import Link from "next/link";
import type { ReactNode } from "react";

export default function ProfileMenuLink({
  href,
  label,
  description,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  description?: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.065]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-white/48 transition group-hover:border-sky-300/25 group-hover:bg-sky-300/[0.08] group-hover:text-sky-200">
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-bold text-white/78 transition group-hover:text-white">
          {label}
        </span>

        {description && (
          <span className="mt-0.5 block text-[10px] text-white/32">
            {description}
          </span>
        )}
      </span>
    </Link>
  );
}