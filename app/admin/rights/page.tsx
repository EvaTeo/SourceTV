"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RightsContract = {
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
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    title: string;
    creatorName?: string | null;
    creatorEmail?: string | null;
    creatorCompany?: string | null;
    thumbnailUrl?: string | null;
    backdropUrl?: string | null;
    cardArtUrl?: string | null;
  };
};

const filters = [
  { label: "All", value: "all" },
  { label: "Active Rights", value: "active" },
  { label: "Expiring Soon", value: "expiring" },
  { label: "Expired", value: "expired" },
  { label: "Pending Signature", value: "pending" },
  { label: "Signed", value: "signed" },
];

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString([], {
    dateStyle: "medium",
  });
}

function daysUntil(date?: string | null) {
  if (!date) return null;

  const end = new Date(date).getTime();
  const now = new Date().getTime();

  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
}

function rightsStatus(contract: RightsContract) {
  const remainingDays = daysUntil(contract.licenseEndDate);

  if (contract.status !== "signed") return "pending";
  if (remainingDays !== null && remainingDays < 0) return "expired";
  if (remainingDays !== null && remainingDays <= 60) return "expiring";

  return "active";
}

function statusClass(status: string) {
  if (status === "active")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (status === "expiring")
    return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
  if (status === "expired")
    return "border-red-400/40 bg-red-500/12 text-red-200";
  if (status === "pending")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";

  return "border-sky-300/40 bg-sky-300/12 text-sky-200";
}

function statusLabel(status: string) {
  if (status === "active") return "Active Rights";
  if (status === "expiring") return "Expiring Soon";
  if (status === "expired") return "Expired";
  if (status === "pending") return "Pending Signature";
  return status;
}

export default function AdminRightsPage() {
  const [contracts, setContracts] = useState<RightsContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function loadRights() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/contracts", {
        cache: "no-store",
      });

      if (res.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("RIGHTS DASHBOARD LOAD ERROR:", error);
      setContracts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRights();
  }, []);

  const counts = useMemo(() => {
    return {
      all: contracts.length,
      active: contracts.filter((contract) => rightsStatus(contract) === "active")
        .length,
      expiring: contracts.filter(
        (contract) => rightsStatus(contract) === "expiring"
      ).length,
      expired: contracts.filter((contract) => rightsStatus(contract) === "expired")
        .length,
      pending: contracts.filter((contract) => rightsStatus(contract) === "pending")
        .length,
      signed: contracts.filter((contract) => contract.status === "signed").length,
    };
  }, [contracts]);

  const expiringContracts = useMemo(() => {
    return contracts
      .filter((contract) => rightsStatus(contract) === "expiring")
      .sort(
        (a, b) =>
          (daysUntil(a.licenseEndDate) || 9999) -
          (daysUntil(b.licenseEndDate) || 9999)
      );
  }, [contracts]);

  const filteredContracts = useMemo(() => {
    const cleanSearch = search.trim().toLowerCase();

    return contracts.filter((contract) => {
      const computedStatus = rightsStatus(contract);

      const matchesFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "signed"
          ? contract.status === "signed"
          : computedStatus === activeFilter;

      const matchesSearch =
        !cleanSearch ||
        contract.project?.title?.toLowerCase().includes(cleanSearch) ||
        contract.partnerName?.toLowerCase().includes(cleanSearch) ||
        contract.partnerEmail?.toLowerCase().includes(cleanSearch) ||
        contract.rightsOwner?.toLowerCase().includes(cleanSearch) ||
        contract.rightsContact?.toLowerCase().includes(cleanSearch) ||
        contract.territories?.toLowerCase().includes(cleanSearch) ||
        contract.exclusivity?.toLowerCase().includes(cleanSearch);

      return matchesFilter && matchesSearch;
    });
  }, [contracts, activeFilter, search]);

  const stats = [
    { label: "Active Rights", value: counts.active },
    { label: "Expiring Soon", value: counts.expiring },
    { label: "Expired", value: counts.expired },
    { label: "Pending", value: counts.pending },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              SourceTV Rights Operations
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
              Rights Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
              Track signed streaming rights, expiring license windows, pending
              agreements, territories, exclusivity, and partner ownership.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/contracts"
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200"
            >
              Contracts
            </Link>

            <button
              onClick={loadRights}
              className="rounded-md bg-sky-400 px-4 py-2.5 text-xs font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.3)] transition hover:bg-sky-300"
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <RightsStat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </section>

        {expiringContracts.length > 0 && (
          <section className="mt-7 rounded-[1.7rem] border border-yellow-300/20 bg-yellow-300/[0.06] p-5 shadow-2xl backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-100">
              Rights Expiring Soon
            </p>

            <div className="mt-4 grid gap-3">
              {expiringContracts.slice(0, 5).map((contract) => (
                <Link
                  key={contract.id}
                  href={`/admin/contracts/${contract.id}`}
                  className="flex flex-col justify-between gap-2 rounded-2xl border border-yellow-300/15 bg-black/25 p-4 transition hover:border-yellow-300/40 md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-black text-white">
                      {contract.project?.title || "Untitled Contract"}
                    </p>
                    <p className="mt-1 text-xs font-bold text-white/45">
                      {contract.rightsOwner || "Unknown rights owner"} • Expires{" "}
                      {formatDate(contract.licenseEndDate)}
                    </p>
                  </div>

                  <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-100">
                    {daysUntil(contract.licenseEndDate)} days left
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, rights owner, partner, territory, exclusivity..."
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
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            Loading rights dashboard...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            No rights records found for this view.
          </div>
        ) : (
          <section className="mt-8 grid gap-5">
            {filteredContracts.map((contract) => {
              const computedStatus = rightsStatus(contract);
              const remainingDays = daysUntil(contract.licenseEndDate);
              const artwork =
                contract.project?.cardArtUrl ||
                contract.project?.backdropUrl ||
                contract.project?.thumbnailUrl ||
                "";

              return (
                <article
                  key={contract.id}
                  className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-sky-300/20"
                >
                  <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                    <div
                      className="relative min-h-[210px] bg-zinc-950 bg-cover bg-center md:min-h-full"
                      style={{
                        backgroundImage: artwork
                          ? `linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.2)), url(${artwork})`
                          : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, black, #020617)",
                      }}
                    >
                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] backdrop-blur-xl ${statusClass(
                            computedStatus
                          )}`}
                        >
                          {statusLabel(computedStatus)}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
                          {contract.status.replaceAll("_", " ")}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex flex-col justify-between gap-5 md:flex-row">
                        <div className="min-w-0">
                          <h2 className="text-2xl font-black md:text-4xl">
                            {contract.project?.title || "Untitled Contract"}
                          </h2>

                          <p className="mt-2 text-sm font-bold text-white/45">
                            Rights Owner: {contract.rightsOwner || "Not set"} •{" "}
                            Partner:{" "}
                            {contract.partnerName ||
                              contract.partnerEmail ||
                              "Not assigned"}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-row gap-2 md:flex-col">
                          <Link
                            href={`/admin/contracts/${contract.id}`}
                            className="rounded-md bg-sky-400 px-4 py-2 text-center text-xs font-black text-black transition hover:bg-sky-300"
                          >
                            Open Contract
                          </Link>

                          <Link
                            href={`/admin/contracts/${contract.id}/print`}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
                          >
                            Print Record
                          </Link>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-4">
                        <InfoBox
                          label="Territories"
                          value={contract.territories || "Not set"}
                        />
                        <InfoBox
                          label="Exclusivity"
                          value={contract.exclusivity || "Not set"}
                        />
                        <InfoBox
                          label="License Ends"
                          value={formatDate(contract.licenseEndDate)}
                        />
                        <InfoBox
                          label="Days Remaining"
                          value={
                            remainingDays === null
                              ? "Not set"
                              : remainingDays < 0
                              ? `${Math.abs(remainingDays)} days expired`
                              : `${remainingDays} days`
                          }
                        />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <InfoBox
                          label="License Type"
                          value={contract.licenseType || "Not set"}
                        />
                        <InfoBox
                          label="Revenue Share"
                          value={`${contract.revenueShare ?? 50}%`}
                        />
                        <InfoBox
                          label="Signed"
                          value={formatDate(contract.signedAt)}
                        />
                        <InfoBox
                          label="Contact"
                          value={contract.rightsContact || "Not set"}
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

function RightsStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string }) {
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