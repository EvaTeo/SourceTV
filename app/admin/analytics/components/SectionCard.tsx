import Link from "next/link";
import type { ReactNode } from "react";

export default function SectionCard({
  title,
  description,
  actionHref,
  children,
}: {
  title: string;
  description: string;
  actionHref?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
      <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-white/40">{description}</p>
        </div>

        {actionHref && (
          <Link
            href={actionHref}
            className="shrink-0 text-sm font-medium text-sky-300 hover:text-sky-200"
          >
            View
          </Link>
        )}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}