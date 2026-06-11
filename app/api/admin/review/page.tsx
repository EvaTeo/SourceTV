"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminReviewPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    const res = await fetch("/api/admin/content");
    const data = await res.json();

    setItems(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/content/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      alert("Failed to update status");
      return;
    }

    await loadItems();
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

          <h1 className="mt-3 text-5xl font-black">
            Content Approval
          </h1>

          <p className="mt-4 max-w-2xl text-white/60">
            Review uploaded titles before they appear publicly on SourceTV.
          </p>
        </div>

        {loading ? (
          <p className="mt-10 text-white/50">Loading review queue...</p>
        ) : (
          <div className="mt-10 grid gap-6">
            {items.map((item) => (
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
                          : "bg-yellow-400 text-black"
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-sm text-white/45">
                      {item.type} • {item.genre} • {item.maturityRating || "Not Rated"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-3xl font-black">
                    {item.title}
                  </h2>

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
                      onClick={() => updateStatus(item.id, "approved")}
                      className="rounded-full bg-sky-400 px-5 py-3 font-black text-black"
                    >
                      Approve
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

                    <Link
                      href={`/watch/${item.id}`}
                      className="rounded-full border border-sky-300/30 px-5 py-3 font-bold text-sky-200"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-white/50">
                No uploaded content found.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}