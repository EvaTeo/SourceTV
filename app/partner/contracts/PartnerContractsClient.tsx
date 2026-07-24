"use client";

import ContractStat from "./components/ContractStat";
import ContractsHeader from "./components/ContractsHeader";
import ContractsLibrary from "./components/ContractsLibrary";
import usePartnerContracts from "./hooks/usePartnerContracts";

type ContractFilterValue =
  | "all"
  | "needs_action"
  | "sent"
  | "viewed"
  | "signed"
  | "changes_requested"
  | "cancelled"
  | "expired";

const filters: {
  label: string;
  value: ContractFilterValue;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Needs Action",
    value: "needs_action",
  },
  {
    label: "Awaiting Review",
    value: "sent",
  },
  {
    label: "Viewed",
    value: "viewed",
  },
  {
    label: "Signed",
    value: "signed",
  },
  {
    label: "Changes Requested",
    value: "changes_requested",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
  {
    label: "Expired",
    value: "expired",
  },
];

export default function PartnerContractsClient() {
  const {
    loading,
    activeFilter,
    setActiveFilter,
    search,
    setSearch,
    counts,
    filteredContracts,
    stats,
    loadContracts,
  } = usePartnerContracts();

  return (
    <main className="mx-auto w-full max-w-[1180px] space-y-7 pb-16">
      <ContractsHeader onRefresh={loadContracts} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <ContractStat
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </section>

      <ContractsLibrary
        contracts={filteredContracts}
        loading={loading}
        search={search}
        activeFilter={activeFilter as ContractFilterValue}
        counts={counts}
        filters={filters}
        onSearchChange={setSearch}
        onFilterChange={setActiveFilter}
      />
    </main>
  );
}