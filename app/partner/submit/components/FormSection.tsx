import type { ReactNode } from "react";

import type {
  SubmissionSectionId,
} from "../types";

export default function FormSection({
  id,
  number,
  title,
  description,
  children,
}: {
  id: SubmissionSectionId;
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-32 rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.046] to-white/[0.02] p-5 shadow-[0_22px_75px_rgba(0,0,0,0.18)] sm:p-7"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-300/20 bg-gradient-to-br from-sky-300/[0.11] to-sky-300/[0.035] text-xs font-black text-sky-300 shadow-[0_12px_30px_rgba(56,189,248,0.08)]">
          {number}
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-[-0.025em] text-white">
            {title}
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-white/40">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7">{children}</div>
    </section>
  );
}
