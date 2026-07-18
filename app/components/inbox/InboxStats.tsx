type StatItem = {
  label: string;
  value: number;
};

type Props = {
  stats: StatItem[];
};

const card =
  "rounded-2xl border border-white/10 bg-white/[0.035] p-4";

export default function InboxStats({ stats }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label} className={card}>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
            {item.label}
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            {item.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}