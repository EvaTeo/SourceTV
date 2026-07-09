type Props = {
  items: {
    id: string;
    label: string;
    sublabel: string;
    value: string;
  }[];
};

function SmallEmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-8 text-sm text-white/40">
      {text}
    </div>
  );
}

export default function RankList({ items }: Props) {
  if (items.length === 0) {
    return <SmallEmptyState text="No title performance data yet." />;
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-xs font-semibold text-sky-300">
            {index + 1}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {item.label}
            </p>
            <p className="mt-1 truncate text-xs text-white/35">
              {item.sublabel}
            </p>
          </div>

          <p className="shrink-0 text-xs font-semibold text-white/50">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}