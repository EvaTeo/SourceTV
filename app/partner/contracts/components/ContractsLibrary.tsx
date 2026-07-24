import type { PartnerContract } from "../types";
import ContractRow from "./ContractRow";
import EmptyState from "./EmptyState";

type ContractCounts = {
  all: number;
  needs_action: number;
  sent: number;
  viewed: number;
  signed: number;
  changes_requested: number;
  cancelled: number;
  expired: number;
};

type ContractFilter = {
  label: string;
  value: keyof ContractCounts;
};

type ContractsLibraryProps = {
  contracts: PartnerContract[];
  loading: boolean;
  search: string;
  activeFilter: keyof ContractCounts;
  counts: ContractCounts;
  filters: ContractFilter[];
  onSearchChange: (value: string) => void;
  onFilterChange: (value: keyof ContractCounts) => void;
};

export default function ContractsLibrary({
  contracts,
  loading,
  search,
  activeFilter,
  counts,
  filters,
  onSearchChange,
  onFilterChange,
}: ContractsLibraryProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
      <div className="border-b border-white/10 p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
              Contract Library
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
              Your agreements
            </h2>

            <p className="mt-1 text-sm text-white/40">
              Filter by status or search by title, partner, or rights owner.
            </p>
          </div>

          <div className="w-full lg:max-w-sm">
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search contracts..."
              className="min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-sky-300/50"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-5 overflow-x-auto border-t border-white/10 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onFilterChange(filter.value)}
                className={`shrink-0 border-b-2 pb-3 text-[11px] font-black uppercase tracking-[0.14em] transition ${
                  active
                    ? "border-sky-300 text-sky-300"
                    : "border-transparent text-white/35 hover:text-white/70"
                }`}
              >
                {filter.label}

                <span className="ml-2 text-white/30">
                  {counts[filter.value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <EmptyState
          title="Loading contracts..."
          description="Retrieving your latest SourceTV agreements."
        />
      ) : contracts.length === 0 ? (
        <EmptyState
          title="No contracts found."
          description="There are no agreements matching this search or filter."
        />
      ) : (
        <div className="divide-y divide-white/10">
          {contracts.map((contract) => (
            <ContractRow
              key={contract.id}
              contract={contract}
            />
          ))}
        </div>
      )}
    </section>
  );
}