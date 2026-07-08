import type { ReactNode } from "react";

export default function AdminTable({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
      <table className="w-full text-left">
        <thead className="border-b border-white/10 bg-white/[0.025]">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-white/10">
          {children}
        </tbody>
      </table>
    </div>
  );
}