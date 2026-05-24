"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  async function fetchSubmissions() {
    const res = await fetch("/api/submissions");
    const data = await res.json();
    setSubmissions(data);
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/submissions/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    fetchSubmissions();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-5xl font-black">Admin Submissions</h1>

        <div className="mt-10 space-y-6">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
            >
              <h2 className="text-2xl font-black">{s.title}</h2>

              <p className="mt-2 text-sm text-sky-300">
                {s.type} • {s.genre}
              </p>

              <p className="mt-3 text-white/60">{s.description}</p>

              <p className="mt-3 text-xs text-white/40">
                Status: {s.status}
              </p>

              <div className="mt-5 flex gap-4">
                <button
                  onClick={() => updateStatus(s.id, "approved")}
                  className="rounded-full bg-green-500 px-5 py-2 font-bold text-black"
                >
                  Approve
                </button>

                <button
                  onClick={() => updateStatus(s.id, "denied")}
                  className="rounded-full bg-red-500 px-5 py-2 font-bold text-black"
                >
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}