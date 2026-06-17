"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  revenueShare?: number | null;
  views?: number | null;
  status: string;
  scheduledAt?: string | null;
  thumbnailUrl?: string | null;
};

const filters = ["all", "pending", "approved", "scheduled", "rejected"];

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function statusBadgeClass(status: string) {
  if (status === "approved")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (status === "rejected")
    return "border-red-400/40 bg-red-500/12 text-red-200";
  if (status === "private")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";
  if (status === "unlisted")
    return "border-blue-300/40 bg-blue-400/12 text-blue-200";
  if (status === "archived")
    return "border-zinc-400/30 bg-zinc-400/10 text-zinc-200";

  return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
}

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, scheduledAt }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to update status:", data);
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
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              SourceTV Review Queue
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
              Content Approval
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
              Review uploaded titles before they appear publicly. Approve,
              schedule, reject, archive, or preview each submission.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/content"
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200"
            >
              Content Center
            </Link>

            <button
              onClick={loadItems}
              className="rounded-md bg-sky-400 px-4 py-2.5 text-xs font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.3)] transition hover:bg-sky-300"
            >
              Refresh
            </button>
          </div>
        </div>

        <section className="mt-8 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <AdminStat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </section>

        <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex gap-5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
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
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            Loading review queue...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            No uploaded content found for this view.
          </div>
        ) : (
          <section className="mt-8 grid gap-5">
            {filteredItems.map((item) => {
              const saving = savingId === item.id;

              const isFutureScheduled =
                item.scheduledAt && new Date(item.scheduledAt) > new Date();

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-sky-300/20"
                >
                  <div className="grid gap-0 md:grid-cols-[210px_1fr]">
                    <div
                      className="relative min-h-[230px] bg-zinc-950 bg-cover bg-center md:min-h-full"
                      style={{
                        backgroundImage: item.thumbnailUrl
                          ? `linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.16)), url(${item.thumbnailUrl})`
                          : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, black, #020617)",
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
                          {item.type || "Title"}{" "}
                          {item.genre ? `• ${item.genre}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex flex-col justify-between gap-5 md:flex-row">
                        <div className="min-w-0">
                          <h2 className="text-2xl font-black leading-tight md:text-4xl">
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
      </div>

      {scheduleItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-black/88 p-6 shadow-[0_0_90px_rgba(0,0,0,0.72)] backdrop-blur-3xl">
            <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-sky-300/60 to-transparent shadow-[0_0_22px_rgba(56,189,248,0.8)]" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
                  Schedule Premiere
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {scheduleItem.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  Pick the month, day, and time this title should become public.
                </p>
              </div>

              <button
                onClick={() => setScheduleItem(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition hover:border-sky-300/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-white/60">
                  Date
                </label>

                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-white outline-none focus:border-sky-300"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white/60">
                  Time
                </label>

                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-white outline-none focus:border-sky-300"
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/50">
              Scheduled content stays hidden from public browse until this date
              and time passes.
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveSchedule}
                className="rounded-md bg-sky-400 px-6 py-3 text-sm font-black text-black transition hover:bg-sky-300"
              >
                Save Premiere
              </button>

              <button
                onClick={clearSchedule}
                className="rounded-md border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Clear Schedule
              </button>

              <button
                onClick={() => setScheduleItem(null)}
                className="rounded-md border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/50 transition hover:border-white/30 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
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

      <p className="mt-2 text-sm font-bold text-white/70">{value}</p>
    </div>
  );
}

function ActionButton({
  children,
  disabled,
  onClick,
  variant,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  variant: "primary" | "blue" | "purple" | "red" | "default";
}) {
  const classes: Record<typeof variant, string> = {
    primary:
      "bg-sky-400 text-black hover:bg-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.22)]",
    blue:
      "border border-sky-300/30 bg-sky-300/10 text-sky-200 hover:border-sky-300/60",
    purple:
      "border border-purple-400/30 bg-purple-500/10 text-purple-300 hover:border-purple-400/60",
    red:
      "border border-red-400/30 bg-red-500/10 text-red-300 hover:border-red-400/60",
    default:
      "border border-white/15 bg-white/[0.04] text-white/60 hover:border-white/30 hover:text-white",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-35 ${classes[variant]}`}
    >
      {children}
    </button>
  );
}