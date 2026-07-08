export default function EmptyState({
  title = "No data yet.",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-8">
      <p className="text-sm font-medium text-white/60">{title}</p>

      {description && (
        <p className="mt-1 text-sm leading-5 text-white/35">
          {description}
        </p>
      )}
    </div>
  );
}