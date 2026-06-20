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
  if (status === "signed")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (status === "sent")
    return "border-sky-300/40 bg-sky-300/12 text-sky-200";
  if (status === "viewed")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";
  if (status === "changes_requested")
    return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
  if (status === "cancelled" || status === "expired")
    return "border-red-400/40 bg-red-500/12 text-red-200";

  return "border-white/15 bg-white/[0.05] text-white/65";
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ");
}

function needsAction(contract: PartnerContract) {
  return contract.status === "sent" || contract.status === "viewed";
}

export default function PartnerContractsPage() {
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
    { label: "Needs Action", value: counts.needs_action },
    { label: "Awaiting Review", value: counts.sent },
    { label: "Viewed", value: counts.viewed },
    { label: "Signed", value: counts.signed },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Link
          href="/partner"
          className="text-sm font-black text-sky-300 transition hover:text-sky-200"
        >
          ← Back to Partner Dashboard
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            SourceTV Partner Portal
          </p>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black leading-[0.95] md:text-7xl">
                Contracts
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
                Review SourceTV streaming rights agreements, sign contracts, or
                request changes before your title moves forward.
              </p>
            </div>

            <button
              onClick={loadContracts}
              className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200"
            >
              Refresh
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <ContractStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </section>

        <section className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search contracts, titles, rights owner..."
            className="min-h-12 w-full rounded-xl border border-white/10 bg-black/45 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:border-sky-300/60 md:rounded-2xl"
          />

          <div className="mt-4 flex gap-5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const active = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`shrink-0 border-b-2 pb-2 text-[11px] font-black uppercase tracking-[0.15em] transition ${
                    active
                      ? "border-sky-300 text-sky-300"
                      : "border-transparent text-white/38 hover:text-white/72"
                  }`}
                >
                  {filter.label} ({counts[filter.value as keyof typeof counts]})
                </button>
              );
            })}
          </div>
        </section>

        {loading ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 text-white/50">
            Loading contracts...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 text-white/50">
            No contracts found for this view.
          </div>
        ) : (
          <section className="mt-8 grid gap-4">
            {filteredContracts.map((contract) => {
              const artwork =
                contract.project?.cardArtUrl ||
                contract.project?.backdropUrl ||
                contract.project?.thumbnailUrl ||
                "";

              const urgent = needsAction(contract);

              return (
                <article
                  key={contract.id}
                  className={`overflow-hidden rounded-[1.5rem] border bg-white/[0.045] shadow-2xl backdrop-blur-xl transition hover:border-sky-300/25 ${
                    urgent ? "border-sky-300/25" : "border-white/10"
                  }`}
                >
                  <div className="grid gap-0 md:grid-cols-[190px_1fr]">
                    <div
                      className="relative min-h-[190px] bg-zinc-950 bg-cover bg-center"
                      style={{
                        backgroundImage: artwork
                          ? `linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.18)), url(${artwork})`
                          : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, black, #020617)",
                      }}
                    >
                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] capitalize backdrop-blur-xl ${statusClass(
                            contract.status
                          )}`}
                        >
                          {statusLabel(contract.status)}
                        </span>
                      </div>

                      {urgent && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="rounded-full border border-sky-300/35 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-200">
                            Action Needed
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex flex-col justify-between gap-4 md:flex-row">
                        <div>
                          <h2 className="text-2xl font-black md:text-4xl">
                            {contract.project?.title || "Untitled Contract"}
                          </h2>

                          <p className="mt-2 text-sm font-bold text-white/45">
                            License: {contract.licenseType || "Not set"} •
                            Revenue Share: {contract.revenueShare ?? 50}%
                          </p>

                          <p className="mt-2 text-sm text-white/45">
                            Sent: {formatDate(contract.sentAt)} • Signed:{" "}
                            {formatDate(contract.signedAt)}
                          </p>
                        </div>

                        <Link
                          href={`/partner/contracts/${contract.id}`}
                          className={`h-fit rounded-md px-4 py-2.5 text-center text-xs font-black transition ${
                            urgent
                              ? "bg-sky-400 text-black hover:bg-sky-300"
                              : "border border-white/10 bg-white/[0.04] text-white/65 hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
                          }`}
                        >
                          {urgent ? "Review Contract" : "Open Contract"}
                        </Link>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <InfoBox
                          label="Territories"
                          value={contract.territories || "Not set"}
                        />
                        <InfoBox
                          label="Exclusivity"
                          value={contract.exclusivity || "Not set"}
                        />
                        <InfoBox
                          label="Rights Owner"
                          value={contract.rightsOwner || "Not set"}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function ContractStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 line-clamp-2 text-sm font-bold text-white/70">
        {value}
      </p>
    </div>
  );
}