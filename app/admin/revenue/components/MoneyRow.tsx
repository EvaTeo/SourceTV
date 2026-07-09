import { money } from "../utils";

type Props = {
  label: string;
  value: number;
  note: string;
  percent: number;
};

export default function MoneyRow({ label, value, note, percent }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-black text-white/80">{label}</p>
          <p className="mt-1 text-xs leading-5 text-white/38">{note}</p>
        </div>

        <p className="shrink-0 text-xl font-black text-sky-300">
          {money(value)}
        </p>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-sky-300"
          style={{ width: `${Math.max(4, percent)}%` }}
        />
      </div>

      <p className="mt-2 text-right text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
        {percent}% of model
      </p>
    </div>
  );
}