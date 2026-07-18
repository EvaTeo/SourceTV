type InboxFilter = {
  label: string;
  value: string;
  count: number;
};

type InboxFiltersProps = {
  filters: InboxFilter[];
  activeFilter: string;
  onChange: (value: string) => void;
};

export default function InboxFilters({
  filters,
  activeFilter,
  onChange,
}: InboxFiltersProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onChange(filter.value)}
              className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                active
                  ? "bg-sky-300 text-black"
                  : "border border-white/10 bg-black/20 text-white/50 hover:border-sky-300/25 hover:text-white"
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          );
        })}
      </div>
    </section>
  );
}