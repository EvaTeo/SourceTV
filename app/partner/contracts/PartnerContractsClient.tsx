"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PartnerContract = {
  id: string;
  projectId: string;
  partnerEmail?: string | null;
  partnerName?: string | null;
  rightsOwner?: string | null;
  rightsContact?: string | null;
  status: string;
  licenseType?: string | null;
  licenseStartDate?: string | null;
  licenseEndDate?: string | null;
  territories?: string | null;
  exclusivity?: string | null;
  revenueShare: number;
  sentAt?: string | null;
  viewedAt?: string | null;
  signedAt?: string | null;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
    description?: string | null;
    thumbnailUrl?: string | null;
    backdropUrl?: string | null;
    cardArtUrl?: string | null;
  };
};

const filters = [
  { label: "All", value: "all" },
  { label: "Needs Action", value: "needs_action" },
  { label: "Awaiting Review", value: "sent" },
  { label: "Viewed", value: "viewed" },
  { label: "Signed", value: "signed" },
  { label: "Changes Requested", value: "changes_requested" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Expired", value: "expired" },
];

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusClass(status: string) {
  if (status === "signed") {
    return "border-emerald-300/35 bg-emerald-300/10 text-emerald-200";
  }

  if (status === "sent") {
    return "border-sky-300/35 bg-sky-300/10 text-sky-200";
  }

  if (status === "viewed") {
    return "border-purple-300/35 bg-purple-300/10 text-purple-200";
  }

  if (status === "changes_requested") {
    return "border-yellow-300/35 bg-yellow-300/10 text-yellow-100";
  }

  if (status === "cancelled" || status === "expired") {
    return "border-red-300/35 bg-red-300/10 text-red-200";
  }

  return "border-white/10 bg-white/[0.035] text-white/60";
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function needsAction(contract: PartnerContract) {
  return contract.status === "sent" || contract.status === "viewed";
}

export default function PartnerContractsClient() {
  const [contracts, setContracts] = useState<PartnerContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function loadContracts() {
    try {
      setLoading(true);

      const res = await fetch("/api/partner/contracts", {
        cache: "no-store",
      });

      if (res.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("PARTNER CONTRACTS LOAD ERROR:", error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContracts();
  }, []);

  const counts = useMemo(() => {
    return {
      all: contracts.length,
      needs_action: contracts.filter((contract) => needsAction(contract)).length,
      sent: contracts.filter((contract) => contract.status === "sent").length,
      viewed: contracts.filter((contract) => contract.status === "viewed")
        .length,
      signed: contracts.filter((contract) => contract.status === "signed")
        .length,
      changes_requested: contracts.filter(
        (contract) => contract.status === "changes_requested"
      ).length,
      cancelled: contracts.filter((contract) => contract.status === "cancelled")
        .length,
      expired: contracts.filter((contract) => contract.status === "expired")
        .length,
    };
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return contracts.filter((contract) => {
      const matchesFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "needs_action"
            ? needsAction(contract)
            : contract.status === activeFilter;

      const matchesSearch =
        !cleanSearch ||
        contract.project?.title?.toLowerCase().includes(cleanSearch) ||
        contract.partnerName?.toLowerCase().includes(cleanSearch) ||
        contract.partnerEmail?.toLowerCase().includes(cleanSearch) ||
        contract.rightsOwner?.toLowerCase().includes(cleanSearch) ||
        contract.rightsContact?.toLowerCase().includes(cleanSearch) ||
        contract.status?.toLowerCase().includes(cleanSearch);

      return matchesFilter && matchesSearch;
    });
  }, [contracts, activeFilter, search]);

  const stats = [
    {
      label: "Needs Action",
      value: counts.needs_action,
      description: "Contracts waiting for your review",
    },
    {
      label: "Awaiting Review",
      value: counts.sent,
      description: "Agreements sent by SourceTV",
    },
    {
      label: "Viewed",
      value: counts.viewed,
      description: "Contracts you have opened",
    },
    {
      label: "Signed",
      value: counts.signed,
      description: "Completed agreements",
    },
  ];

  return (
    <main className="mx-auto w-full max-w-[1180px] space-y-7 pb-16">
      <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
            SourceTV Partner Studio
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Contracts
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/45 sm:text-[15px]">
            Review agreements, confirm licensing terms, sign contracts, and
            request revisions before your titles move forward.
          </p>
        </div>

        <button
          type="button"
          onClick={loadContracts}
          className="w-fit rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-black text-white/65 transition hover:border-sky-300/30 hover:text-white"
        >
          Refresh Contracts
        </button>
      </header>

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
                onChange={(event) => setSearch(event.target.value)}
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
                  onClick={() => setActiveFilter(filter.value)}
                  className={`shrink-0 border-b-2 pb-3 text-[11px] font-black uppercase tracking-[0.14em] transition ${
                    active
                      ? "border-sky-300 text-sky-300"
                      : "border-transparent text-white/35 hover:text-white/70"
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 text-white/30">
                    {counts[filter.value as keyof typeof counts]}
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
        ) : filteredContracts.length === 0 ? (
          <EmptyState
            title="No contracts found."
            description="There are no agreements matching this search or filter."
          />
        ) : (
          <div className="divide-y divide-white/10">
            {filteredContracts.map((contract) => (
              <ContractRow key={contract.id} contract={contract} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ContractStat({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:border-white/15 hover:bg-white/[0.045]">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-white/35">{description}</p>
    </div>
  );
}

function ContractRow({ contract }: { contract: PartnerContract }) {
  const artwork =
    contract.project?.cardArtUrl ||
    contract.project?.backdropUrl ||
    contract.project?.thumbnailUrl ||
    "";

  const urgent = needsAction(contract);

  return (
    <article className="grid gap-5 p-5 transition duration-200 hover:bg-white/[0.025] md:grid-cols-[128px_1fr_auto] md:items-center md:p-6">
      <div
        className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#090d15] bg-cover bg-center"
        style={{
          backgroundImage: artwork
            ? `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.08)), url(${artwork})`
            : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, #06090f, #0b1220)",
        }}
      />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] ${statusClass(
              contract.status
            )}`}
          >
            {statusLabel(contract.status)}
          </span>

          {urgent && (
            <span className="rounded-full border border-sky-300/25 bg-sky-300/[0.08] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-sky-200">
              Action Needed
            </span>
          )}
        </div>

        <h3 className="mt-3 truncate text-xl font-black tracking-tight text-white">
          {contract.project?.title || "Untitled Contract"}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm leading-6 text-white/40">
          {contract.project?.description ||
            "Streaming rights agreement for this SourceTV title."}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/35">
          <span>
            License:{" "}
            <strong className="font-semibold text-white/60">
              {contract.licenseType || "Not set"}
            </strong>
          </span>

          <span>
            Revenue Share:{" "}
            <strong className="font-semibold text-white/60">
              {contract.revenueShare ?? 50}%
            </strong>
          </span>

          <span>
            Updated:{" "}
            <strong className="font-semibold text-white/60">
              {formatDate(contract.updatedAt)}
            </strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:items-end">
        <Link
          href={`/partner/contracts/${contract.id}`}
          className={`inline-flex min-w-36 justify-center rounded-xl px-4 py-2.5 shadow-sm text-xs font-black transition ${
            urgent
              ? "bg-sky-300 text-black hover:bg-sky-200"
              : "border border-white/10 bg-white/[0.035] text-white/65 hover:border-sky-300/30 hover:text-white"
          }`}
        >
          {urgent ? "Review Contract" : "Open Contract"}
        </Link>

        <p className="text-[11px] text-white/25">
          Signed: {formatDate(contract.signedAt)}
        </p>
      </div>
    </article>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <h3 className="text-lg font-black text-white">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/40">
        {description}
      </p>
    </div>
  );
}