import type { ReactNode } from "react";

export default function DataRow({ children }: { children: ReactNode }) {
  return (
    <tr className="transition hover:bg-white/[0.03]">
      {children}
    </tr>
  );
}

export function DataCell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-5 py-4 text-sm text-white/60 ${className}`}>
      {children}
    </td>
  );
}