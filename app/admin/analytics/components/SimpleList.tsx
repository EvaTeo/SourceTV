import InfoRow from "./InfoRow";

type Props = {
  items: [string, string][];
};

function SmallEmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-8 text-sm text-white/40">
      {text}
    </div>
  );
}

export default function SimpleList({ items }: Props) {
  if (items.length === 0) {
    return <SmallEmptyState text="No data yet." />;
  }

  return (
    <div className="space-y-2">
      {items.map(([label, value]) => (
        <InfoRow
          key={label}
          label={label}
          value={value}
        />
      ))}
    </div>
  );
}