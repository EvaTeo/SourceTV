import type { ReactNode } from "react";

export default function AccountCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl md:p-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent" />

      <div className="relative">{children}</div>
    </section>
  );
}