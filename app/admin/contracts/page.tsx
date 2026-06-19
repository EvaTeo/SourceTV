"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProjectOption = {
  id: string;
  title: string;
  creatorName?: string | null;
  creatorEmail?: string | null;
  creatorCompany?: string | null;
  workflowStage?: string | null;
};

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
  contractText?: string | null;
  partnerNotes?: string | null;
  adminNotes?: string | null;
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
    workflowStage?: string | null;
    thumbnailUrl?: string | null;
    backdropUrl?: string | null;
    cardArtUrl?: string | null;
  };
};

const filters = [
  { label: "All", value: "all" },
  { label: "Needs Action", value: "needs_action" },
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
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

function needsAction(contract: RightsContract) {
  return contract.status === "draft" || contract.status === "changes_requested";
}

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<RightsContract[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  async function loadContracts() {
    try {
      setLoading(true);

      const [contractsRes, contentRes] = await Promise.all([
        fetch("/api/admin/contracts", { cache: "no-store" }),
        fetch("/api/admin/content", { cache: "no-store" }),
      ]);

      if (contractsRes.status === 403 || contentRes.status === 403) {
        window.location.href = "/login";
        return;
      }

      const contractsData = await contractsRes.json();
      const contentData = await contentRes.json();

      setContracts(Array.isArray(contractsData) ? contractsData : []);
      setProjects(Array.isArray(contentData) ? contentData : []);
    } catch (error) {
      console.error("CONTRACTS LOAD ERROR:", error);
      setContracts([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  async function createDraftContract() {
    if (!selectedProjectId) {
      alert("Choose a title first.");
      return;
    }

    try {
      setCreating(true);

      const res = await fetch("/api/admin/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: selectedProjectId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not create contract.");
        return;
      }

      setSelectedProjectId("");
      await loadContracts();
    } catch (error) {
      console.error("CREATE CONTRACT ERROR:", error);
      alert("Could not create contract.");
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    loadContracts();
  }, []);

  const counts = useMemo(() => {
    return {
      all: contracts.length,
      needs_action: contracts.filter((contract) => needsAction(contract)).length,
      draft: contracts.filter((contract) => contract.status === "draft").length,
      sent: contracts.filter((contract) => contract.status === "sent").length,
      viewed: contracts.filter((contract) => contract.status === "viewed").length,
      signed: contracts.filter((contract) => contract.status === "signed").length,
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

  const availableProjects = useMemo(() => {
    const projectIdsWithDrafts = new Set(
      contracts
        .filter((contract) => contract.status === "draft")
        .map((contract) => contract.projectId)
    );

    return projects.filter((project) => !projectIdsWithDrafts.has(project.id));
  }, [projects, contracts]);

  const stats = [
    { label: "Needs Action", value: counts.needs_action },
    { label: "Drafts", value: counts.draft },
    { label: "Viewed", value: counts.viewed },
    { label: "Signed", value: counts.signed },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              SourceTV Legal Operations
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
              Rights Contracts
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
              Draft, send, track, and review streaming rights agreements between
              SourceTV and content partners.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/rights"
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200"
            >
              Rights Dashboard
            </Link>

            <Link
              href="/admin/content"
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200"
            >
              Content Center
            </Link>

            <button
              onClick={loadContracts}
              className="rounded-md bg-sky-400 px-4 py-2.5 text-xs font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.3)] transition hover:bg-sky-300"
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <ContractStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </section>

        <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
            Create Draft Contract
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <select
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              className="min-h-12 rounded-xl border border-white/10 bg-black/45 px-4 text-sm font-semibold text-white outline-none focus:border-sky-300/60 md:rounded-2xl"
            >
              <option value="">Choose a title...</option>
              {availableProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title} —{" "}
                  {project.creatorCompany ||
                    project.creatorName ||
                    project.creatorEmail ||
                    "Unknown partner"}
                </option>
              ))}
            </select>

            <button
              disabled={creating || !selectedProjectId}
              onClick={createDraftContract}
              className="rounded-xl bg-sky-400 px-5 py-3 text-xs font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.25)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40 md:rounded-2xl"
            >
              {creating ? "Creating..." : "Create Contract"}
            </button>
          </div>
        </section>

        <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contracts, title, partner, rights owner..."
              className="min-h-12 flex-1 rounded-xl border border-white/10 bg-black/45 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:border-sky-300/60 md:rounded-2xl"
            />
          </div>

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
            Loading contracts...
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            No contracts found for this view.
          </div>
        ) : (
          <section className="mt-8 grid gap-5">
            {filteredContracts.map((contract) => {
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
                          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] capitalize backdrop-blur-xl ${statusClass(
                            contract.status
                          )}`}
                        >
                          {statusLabel(contract.status)}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
                          Rights Agreement
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
                            Partner:{" "}
                            {contract.partnerName ||
                              contract.partnerEmail ||
                              "Not assigned"}
                          </p>

                          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/55">
                            {contract.contractText ||
                              "Draft streaming rights contract."}
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

                          <Link
                            href={`/admin/content/${contract.projectId}/edit`}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
                          >
                            Edit Title
                          </Link>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-4">
                        <InfoBox
                          label="Rights Owner"
                          value={contract.rightsOwner || "Not set"}
                        />
                        <InfoBox
                          label="Rights Contact"
                          value={contract.rightsContact || "Not set"}
                        />
                        <InfoBox
                          label="License Type"
                          value={contract.licenseType || "Not set"}
                        />
                        <InfoBox
                          label="Revenue Share"
                          value={`${contract.revenueShare ?? 50}%`}
                        />
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-4">
                        <InfoBox
                          label="Territories"
                          value={contract.territories || "Not set"}
                        />
                        <InfoBox
                          label="Exclusivity"
                          value={contract.exclusivity || "Not set"}
                        />
                        <InfoBox
                          label="Sent"
                          value={formatDate(contract.sentAt)}
                        />
                        <InfoBox
                          label="Signed"
                          value={formatDate(contract.signedAt)}
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