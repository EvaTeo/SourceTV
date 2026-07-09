import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function Panel({
  eyebrow,
  title,
  description,
  children,
}: Props) {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>

      <div className="mt-5">{children}</div>
    </div>
  );
}