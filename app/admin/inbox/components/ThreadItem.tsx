import type { ReactNode } from "react";

type Props = {
  title: string;
  partner: string;
  preview: string;
  date: string;
  unread?: boolean;
  replies?: number;
  active?: boolean;
  onClick: () => void;
};

export default function ThreadItem({
  title,
  partner,
  preview,
  date,
  unread,
  replies,
  active,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 text-left transition ${
        active
          ? "border-sky-300/40 bg-sky-300/10"
          : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate text-sm font-black text-white">{title}</h3>

        {unread && (
          <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
        )}
      </div>

      <p className="mt-1 truncate text-xs text-white/45">{partner}</p>

      <p className="mt-3 line-clamp-2 text-sm text-white/60">
        {preview}
      </p>

      <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
        <span>{date}</span>
        {!!replies && <span>{replies} Replies</span>}
      </div>
    </button>
  );
}