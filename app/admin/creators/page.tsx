"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCreatorsPage() {
  const [applications, setApplications] = useState<any[]>([]);

  async function fetchApplications() {
    const res = await fetch("/api/creator/applications");
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to load creator applications");
      return;
    }

    setApplications(data);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateApplication(
    applicationId: string,
    userId: string,
    status: string
  ) {
    const res = await fetch("/api/creator/applications/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId, userId, status }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to update application");
      return;
    }

    fetchApplications();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm font-bold text-sky-300">
          ← Back to Admin
        </Link>

        <h1 className="mt-8 text-5xl font-black">Creator Applications</h1>

        <p className="mt-4 max-w-2xl text-white/60">
          Review viewer requests to become approved SourceTV creators. Approving
          an application upgrades the user role to creator.
        </p>

        <div className="mt-10 space-y-6">
          {applications.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-white/50">
              No creator applications yet.
            </div>
          ) : (
            applications.map((app) => (
              <div
                key={app.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
                      {app.creatorType}
                    </p>

                    <h2 className="mt-2 text-3xl font-black">{app.name}</h2>

                    <p className="mt-1 text-sm text-white/45">{app.email}</p>

                    <p className="mt-5 max-w-3xl text-sm leading-6 text-white/60">
                      {app.bio}
                    </p>

                    <p className="mt-4 text-xs text-white/40">
                      Status: {app.status}
                    </p>
                  </div>

                  <div className="flex min-w-44 flex-col gap-3">
                    <button
                      onClick={() =>
                        updateApplication(app.id, app.userId, "approved")
                      }
                      className="rounded-full bg-green-500 px-5 py-3 font-black text-black"
                    >
                      Approve Creator
                    </button>

                    <button
                      onClick={() =>
                        updateApplication(app.id, app.userId, "denied")
                      }
                      className="rounded-full bg-red-500 px-5 py-3 font-black text-black"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}