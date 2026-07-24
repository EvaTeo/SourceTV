type EmptySearchProps = {
  onClear: () => void;
};

export default function EmptySearch({
  onClear,
}: EmptySearchProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-8 text-center">
      <h3 className="text-xl font-black text-white">
        No matching projects
      </h3>

      <p className="mt-2 text-sm text-white/40">
        Try changing your search, status, type, or sort
        order.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 transition hover:border-sky-300/30 hover:text-white"
      >
        Clear Filters
      </button>
    </div>
  );
}