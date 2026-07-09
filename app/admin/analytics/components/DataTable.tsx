import type { ReactNode } from "react";

type Props = {
  columns: string[];
  children: ReactNode;
  empty: string;
  className?: string;
};

export default function DataTable({
  columns,
  children,
  empty,
  className = "",
}: Props) {
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;

  return (
    <div className={`${className} overflow-hidden rounded-2xl border border-white/10`}>
      <table className="w-full text-left text-sm">
        <thead className="bg-white/[0.025] text-xs uppercase tracking-[0.14em] text-white/35">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {hasChildren ? (
            children
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-white/40">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Td({ children }: { children: ReactNode }) {
  return <td className="px-4 py-3 text-white/55">{children}</td>;
}