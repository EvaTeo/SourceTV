type Props = {
  partner: string;
  titles: number;
  views: number;
  value: string;
};

export default function PartnerRow({
  partner,
  titles,
  views,
  value,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-black text-white/80">{partner}</p>

          <p className="mt-1 text-xs font-bold text-white/38">
            {titles} titles • {views.toLocaleString()} views
          </p>
        </div>

        <p className="shrink-0 font-black text-sky-300">{value}</p>
      </div>
    </div>
  );
}