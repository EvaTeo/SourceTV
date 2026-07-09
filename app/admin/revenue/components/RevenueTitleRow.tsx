type Props = {
  rank: number;
  title: string;
  meta: string;
  revenue: string;
  partnerShare: string;
};

export default function RevenueTitleRow({
  rank,
  title,
  meta,
  revenue,
  partnerShare,
}: Props) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-300 text-sm font-black text-[#05070d]">
        {rank}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-black text-white/80">{title}</p>
        <p className="mt-1 truncate text-xs font-bold text-white/38">
          {meta}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-black text-sky-300">{revenue}</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
          Partner {partnerShare}
        </p>
      </div>
    </div>
  );
}