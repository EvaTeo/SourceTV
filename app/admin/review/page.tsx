"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import EmptyState from "@/app/components/admin/EmptyState";
import InfoBox from "@/app/components/admin/InfoBox";
import MetricCard from "@/app/components/admin/MetricCard";

import ActionButton from "../content/components/ActionButton";
import { filters } from "./constants";
import ScheduleModal from "./components/ScheduleModal";
import type { ContentItem } from "./types";
import { formatDate, statusBadgeClass } from "./utils";

export default function AdminReviewPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [savingId, setSavingId] = useState<string | null>(null);

  const [scheduleItem, setScheduleItem] = useState<ContentItem | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  async function loadItems() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/content", {
        cache: "no-store",
      });

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load admin content:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: string,
    status: string,
    scheduledAt?: string | null
  ) {
    try {
      setSavingId(id);

      const res = await fetch(`/api/admin/content/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, scheduledAt }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || data?.error || "Failed to update status");
        return false;
      }

      await loadItems();
      return true;
    } catch (error) {
      console.error("STATUS UPDATE ERROR:", error);
      alert("Failed to update status.");
      return false;
    } finally {
      setSavingId(null);
    }
  }

  function openScheduleModal(item: ContentItem) {
    setScheduleItem(item);

    if (item.scheduledAt) {
      const date = new Date(item.scheduledAt);
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      setScheduleDate(local.slice(0, 10));
      setScheduleTime(local.slice(11, 16));
    } else {
      setScheduleDate("");
      setScheduleTime("");
    }
  }

  async function saveSchedule() {
    if (!scheduleItem) return;

    if (!scheduleDate || !scheduleTime) {
      alert("Pick both a date and time.");
      return;
    }

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
    const success = await updateStatus(scheduleItem.id, "approved", scheduledAt);

    if (success) {
      setScheduleItem(null);
      setScheduleDate("");
      setScheduleTime("");
    }
  }

  async function clearSchedule() {
    if (!scheduleItem) return;

    const success = await updateStatus(scheduleItem.id, "approved", null);

    if (success) {
      setScheduleItem(null);
      setScheduleDate("");
      setScheduleTime("");
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const counts = useMemo(() => {
    const scheduled = items.filter(
      (item) => item.scheduledAt && new Date(item.scheduledAt) > new Date()
    ).length;

    return {
      all: items.length,
      pending: items.filter((item) => item.status === "pending").length,
      approved: items.filter((item) => item.status === "approved").length,
      scheduled,
      rejected: items.filter((item) => item.status === "rejected").length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return items;

    if (activeFilter === "scheduled") {
      return items.filter(
        (item) => item.scheduledAt && new Date(item.scheduledAt) > new Date()
      );
    }

    return items.filter((item) => item.status === activeFilter);
  }, [items, activeFilter]);

  const stats = [
    { label: "All Titles", value: counts.all },
    { label: "Pending", value: counts.pending },
    { label: "Approved", value: counts.approved },
    { label: "Scheduled", value: counts.scheduled },
  ];

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Review Queue"
        title="Content Approval"
        description="Review uploaded titles before they appear publicly. Approve, schedule, reject, archive, or preview each submission."
        actions={
          <>
            <Link
              href="/admin/content"
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Content Center
            </Link>

            <button
              type="button"
              onClick={loadItems}
              className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
            >
              Refresh
            </button>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
        <div className="flex gap-5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 border-b-2 pb-2 text-[11px] font-black uppercase tracking-[0.15em] transition ${
                  active
                    ? "border-sky-300 text-sky-300"
                    : "border-transparent text-white/38 hover:text-white/72"
                }`}
              >
                {filter} ({counts[filter as keyof typeof counts]})
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <EmptyState title="Loading review queue..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No uploaded content found."
          description="Try selecting another review filter."
        />
      ) : (
        <section className="grid gap-5">
          {filteredItems.map((item) => {
            const saving = savingId === item.id;
            const isFutureScheduled =
              item.scheduledAt && new Date(item.scheduledAt) > new Date();

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.045]"
              >
                <div className="grid gap-0 md:grid-cols-[210px_1fr]">
                  <div
                    className="relative min-h-[230px] bg-zinc-950 bg-cover bg-center md:min-h-full"
                    style={{
                      backgroundImage: item.thumbnailUrl
                        ? `linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.16)), url(${item.thumbnailUrl})`
                        : "linear-gradient(to right, #05070d, #05070d)",
                    }}
                  >
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] backdrop-blur-xl ${statusBadgeClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                      {isFutureScheduled && (
                        <span className="rounded-full border border-sky-300/45 bg-sky-300/14 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-100 backdrop-blur-xl">
                          Scheduled
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
                        {item.type || "Title"} {item.genre ? `• ${item.genre}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="flex flex-col justify-between gap-5 md:flex-row">
                      <div className="min-w-0">
                        <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                          {item.title}
                        </h2>

                        <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/58">
                          {item.description || "No description provided."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-white/45">
                          <span>Creator: {item.creatorName || "Unknown"}</span>
                          <span>Runtime: {item.runtime || "Not listed"}</span>
                          <span>Views: {item.views || 0}</span>
                          <span>Revenue Share: {item.revenueShare || 50}%</span>
                          <span>{item.maturityRating || "Not Rated"}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-row gap-2 md:flex-col">
                        <Link
                          href={`/watch/${item.id}?preview=admin`}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
                        >
                          Preview
                        </Link>

                        <Link
                          href={`/admin/content/${item.id}/edit`}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <InfoBox
                        label="Schedule"
                        value={
                          item.scheduledAt
                            ? `Releases ${formatDate(item.scheduledAt)}`
                            : "Not scheduled"
                        }
                      />

                      <InfoBox
                        label="Public Status"
                        value={
                          isFutureScheduled
                            ? "Hidden until premiere"
                            : item.status === "approved"
                            ? "Visible if approved"
                            : "Not public"
                        }
                      />

                      <InfoBox
                        label="Review Action"
                        value={
                          item.status === "pending"
                            ? "Needs decision"
                            : "Already processed"
                        }
                      />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <ActionButton
                        disabled={saving}
                        onClick={() => updateStatus(item.id, "approved", null)}
                        variant="primary"
                      >
                        Approve Now
                      </ActionButton>

                      <ActionButton
                        disabled={saving}
                        onClick={() => openScheduleModal(item)}
                        variant="blue"
                      >
                        Schedule Premiere
                      </ActionButton>

                      <ActionButton
                        disabled={saving}
                        onClick={() => updateStatus(item.id, "rejected")}
                        variant="red"
                      >
                        Reject
                      </ActionButton>

                      <ActionButton
                        disabled={saving}
                        onClick={() => updateStatus(item.id, "pending")}
                        variant="default"
                      >
                        Back to Pending
                      </ActionButton>

                      <ActionButton
                        disabled={saving}
                        onClick={() => updateStatus(item.id, "private")}
                        variant="purple"
                      >
                        Private
                      </ActionButton>

                      <ActionButton
                        disabled={saving}
                        onClick={() => updateStatus(item.id, "unlisted")}
                        variant="blue"
                      >
                        Unlisted
                      </ActionButton>

                      <ActionButton
                        disabled={saving}
                        onClick={() => updateStatus(item.id, "archived")}
                        variant="default"
                      >
                        Archive
                      </ActionButton>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <ScheduleModal
        item={scheduleItem}
        date={scheduleDate}
        time={scheduleTime}
        setDate={setScheduleDate}
        setTime={setScheduleTime}
        onClose={() => setScheduleItem(null)}
        onSave={saveSchedule}
        onClear={clearSchedule}
      />
    </main>
  );
}