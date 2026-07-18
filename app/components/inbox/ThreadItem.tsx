type Props = {
  title: string;
  participant: string;
  preview: string;
  date: string;
  unread?: boolean;
  replies?: number;
  active?: boolean;
  onClick: () => void;
};

export default function ThreadItem({
  title,
  participant,
  preview,
  date,
  unread = false,
  replies = 0,
  active = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-2xl border p-4 text-left transition ${
        active
          ? "border-sky-300/40 bg-sky-300/10"
          : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {active && (
        <span className="absolute inset-y-0 left-0 w-1 bg-sky-300" />
      )}

      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate text-sm font-black text-white">
          {title}
        </h3>

        {unread && (
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.75)]" />
        )}
      </div>

      <p className="mt-1 truncate text-xs text-white/45">
        {participant}
      </p>

      <p className="mt-3 line-clamp-2 text-sm text-white/60">
        {preview}
      </p>

      <div className="mt-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
        <span>{date}</span>

        {replies > 0 && (
          <span>
            {replies} {replies === 1 ? "Reply" : "Replies"}
          </span>
        )}
      </div>
    </button>
  );
}