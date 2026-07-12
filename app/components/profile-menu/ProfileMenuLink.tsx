import Link from "next/link";
import type { ReactNode } from "react";

export default function ProfileMenuLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/65 transition hover:bg-white/[0.07] hover:text-white"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center text-white/38 transition group-hover:text-sky-200">
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  );
}