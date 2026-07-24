"use client";

import { useEffect, useMemo, useState } from "react";

import type { PartnerContract } from "../types";
import { needsAction } from "../utils";

export default function usePartnerContracts() {
  const [contracts, setContracts] = useState<PartnerContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  async function loadContracts() {
    try {
      setLoading(true);

      const response = await fetch("/api/partner/contracts", {
        cache: "no-store",
      });

      if (response.status === 403) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

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

      needs_action: contracts.filter((contract) =>
        needsAction(contract)
      ).length,

      sent: contracts.filter(
        (contract) => contract.status === "sent"
      ).length,

      viewed: contracts.filter(
        (contract) => contract.status === "viewed"
      ).length,

      signed: contracts.filter(
        (contract) => contract.status === "signed"
      ).length,

      changes_requested: contracts.filter(
        (contract) => contract.status === "changes_requested"
      ).length,

      cancelled: contracts.filter(
        (contract) => contract.status === "cancelled"
      ).length,

      expired: contracts.filter(
        (contract) => contract.status === "expired"
      ).length,
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
        contract.status.toLowerCase().includes(cleanSearch);

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

  return {
    contracts,
    loading,

    activeFilter,
    setActiveFilter,

    search,
    setSearch,

    counts,
    filteredContracts,
    stats,

    loadContracts,
  };
}