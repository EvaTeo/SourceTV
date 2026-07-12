import type { ReactNode } from "react";

export default function AccountSection({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
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
      </div>

      {action}
    </div>
  );
}