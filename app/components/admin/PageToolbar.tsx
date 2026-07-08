"use client";

export default function PageToolbar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 lg:flex-row lg:items-center lg:justify-between">
      {children}
    </div>
  );
}