"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function AdminReviewPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [scheduleItem, setScheduleItem] = useState<ContentItem | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  async function loadItems() {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();

      setItems(data);
    } catch (error) {
      console.error("Failed to load admin content:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: string,
    status: string,
    scheduledAt?: string | null
  ) {
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

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm font-bold text-sky-300">
          ← Back to Admin
        </Link>

        <div className="mt-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            SourceTV Review Queue
          </p>

          <h1 className="mt-3 text-5xl font-black">Content Approval</h1>

          <p className="mt-4 max-w-2xl text-white/60">
            Review uploaded titles before they appear publicly.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-white/50">Loading review queue...</p>
        ) : (
          <div className="mt-10 grid gap-6">
            {items.map((item) => {
              const isFutureScheduled =
                item.scheduledAt && new Date(item.scheduledAt) > new Date();

              return (
                <div
                  key={item.id}
                  className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:grid-cols-[180px_1fr]"
                >
                  <div
                    className="aspect-[2/3] rounded-2xl bg-zinc-900"
                    style={{
                      backgroundImage: item.thumbnailUrl
                        ? `url(${item.thumbnailUrl})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                          item.status === "approved"
                            ? "bg-green-400 text-black"
                            : item.status === "rejected"
                            ? "bg-red-500 text-white"
                            : item.status === "private"
                            ? "bg-purple-400 text-black"
                            : item.status === "unlisted"
                            ? "bg-blue-400 text-black"
                            : item.status === "archived"
                            ? "bg-white/20 text-white"
                            : "bg-yellow-400 text-black"
                        }`}
                      >
                        {item.status}
                      </span>

                      {isFutureScheduled && (
                        <span className="rounded-full bg-sky-400 px-3 py-1 text-xs font-black uppercase text-black shadow-[0_0_18px_rgba(56,189,248,0.8)]">
                          📅 Scheduled Premiere
                        </span>
                      )}

                      {item.scheduledAt && (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                          Releases{" "}
                          {new Date(item.scheduledAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      )}

                      <span className="text-sm text-white/45">
                        {item.type} • {item.genre} •{" "}
                        {item.maturityRating || "Not Rated"}
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-black">{item.title}</h2>

                    <p className="mt-3 max-w-3xl text-white/60">
                      {item.description}
                    </p>

                    <div className="mt-5 grid gap-2 text-sm text-white/45 md:grid-cols-2">
                      <p>Creator: {item.creatorName || "Unknown"}</p>
                      <p>Runtime: {item.runtime || "Not listed"}</p>
                      <p>Views: {item.views || 0}</p>
                      <p>Revenue Share: {item.revenueShare || 50}%</p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => updateStatus(item.id, "approved", null)}
                        className="rounded-full bg-sky-400 px-5 py-3 font-black text-black"
                      >
                        Approve Now
                      </button>

                      <button
                        onClick={() => openScheduleModal(item)}
                        className="rounded-full border border-sky-300/40 px-5 py-3 font-bold text-sky-200"
                      >
                        Schedule Premiere
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "rejected")}
                        className="rounded-full bg-red-500 px-5 py-3 font-black text-white"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "pending")}
                        className="rounded-full border border-white/15 px-5 py-3 font-bold text-white/70"
                      >
                        Back to Pending
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "private")}
                        className="rounded-full border border-purple-300/30 px-5 py-3 font-bold text-purple-200"
                      >
                        Private
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "unlisted")}
                        className="rounded-full border border-blue-300/30 px-5 py-3 font-bold text-blue-200"
                      >
                        Unlisted
                      </button>

                      <button
                        onClick={() => updateStatus(item.id, "archived")}
                        className="rounded-full border border-white/15 px-5 py-3 font-bold text-white/50"
                      >
                        Archive
                      </button>

                      <Link
                        href={`/watch/${item.id}?preview=admin`}
                        className="rounded-full border border-sky-300/30 px-5 py-3 font-bold text-sky-200"
                      >
                        Preview
                      </Link>

                      <Link
                        href={`/admin/content/${item.id}/edit`}
                        className="rounded-full border border-white/15 px-5 py-3 font-bold text-white/70"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-white/50">
                No uploaded content found.
              </div>
            )}
          </div>
        )}
      </div>

      {scheduleItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-sky-300/20 bg-zinc-950 p-6 shadow-2xl shadow-sky-500/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-sky-300">
                  Schedule Premiere
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  {scheduleItem.title}
                </h2>

                <p className="mt-2 text-sm text-white/50">
                  Pick the month, day, and time this title should become public.
                </p>
              </div>

              <button
                onClick={() => setScheduleItem(null)}
                className="rounded-full border border-white/10 px-3 py-1 text-white/60"
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
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-sky-300"
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
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-sky-300"
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
              Scheduled content will stay hidden from public browse until this
              date and time passes.
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveSchedule}
                className="rounded-full bg-sky-400 px-6 py-3 font-black text-black"
              >
                Save Premiere
              </button>

              <button
                onClick={clearSchedule}
                className="rounded-full border border-white/15 px-6 py-3 font-bold text-white/70"
              >
                Clear Schedule
              </button>

              <button
                onClick={() => setScheduleItem(null)}
                className="rounded-full border border-white/15 px-6 py-3 font-bold text-white/50"
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