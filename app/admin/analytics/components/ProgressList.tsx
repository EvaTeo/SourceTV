import ProgressRow from "./ProgressRow";

type Props = {
  items: [string, number][];
  total: number;
};

function SmallEmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-8 text-sm text-white/40">
      {text}
    </div>
  );
}

export default function ProgressList({ items, total }: Props) {
  if (items.length === 0) {
    return <SmallEmptyState text="No breakdown data yet." />;
  }

  return (
    <div className="space-y-3">
      {items.map(([label, value]) => (
        <ProgressRow
          key={label}
          label={label}
          value={value}
          total={total}
        />
      ))}
    </div>
  );
}