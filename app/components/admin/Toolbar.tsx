import type { ReactNode } from "react";

export default function Toolbar({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {children}
      </div>
    </div>
  );
}