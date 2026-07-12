import type { ReactNode } from "react";

export default function SettingsSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.34)] backdrop-blur-2xl md:p-6">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/35 to-transparent" />

      <div className="relative">
        {eyebrow && (
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300/75">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 text-xl font-black tracking-tight text-white md:text-2xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/42">
            {description}
          </p>
        )}

        <div className="mt-6 space-y-3">{children}</div>
      </div>
    </section>
  );
}