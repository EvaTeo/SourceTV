"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CreatorDashboardClient({
  user,
}: {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}) {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const res = await fetch("/api/submissions");
      const data = await res.json();

      setProjects(data);
    }

    fetchProjects();
  }, []);

  const approvedProjects = projects.filter((p) => p.status === "approved");
  const pendingProjects = projects.filter((p) => p.status === "pending");
  const deniedProjects = projects.filter((p) => p.status === "denied");

  const totalViews = approvedProjects.reduce(
    (sum, project) => sum + (project.views || 0),
    0
  );

  const estimatedRevenue = totalViews * 0.03;
  const creatorRevenueShare = 0.5;
  const estimatedCreatorEarnings = estimatedRevenue * creatorRevenueShare;

  const topProject = [...approvedProjects].sort(
    (a, b) => (b.views || 0) - (a.views || 0)
  )[0];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <Link href="/" className="text-2xl font-black">
              Source<span className="text-sky-400">TV</span>
            </Link>

            <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-sky-300">
              Creator Portal
            </p>

            <h1 className="mt-3 text-5xl font-black leading-tight md:text-7xl">
              Creator Dashboard
            </h1>

            <p className="mt-2 text-white/50">
              Logged in as {user.name} • {user.role}
            </p>

            <p className="mt-5 max-w-2xl text-white/60">
              Track project approvals, views, audience performance, and
              estimated creator earnings.
            </p>
          </div>

          <Link
            href="/creator/submit"
            className="rounded-full bg-sky-400 px-6 py-3 text-center font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.45)]"
          >
            Upload Project
          </Link>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">Total Projects</p>
            <h2 className="mt-3 text-4xl font-black text-sky-300">
              {projects.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">Approved</p>
            <h2 className="mt-3 text-4xl font-black text-green-400">
              {approvedProjects.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">Pending</p>
            <h2 className="mt-3 text-4xl font-black text-yellow-300">
              {pendingProjects.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">Denied</p>
            <h2 className="mt-3 text-4xl font-black text-red-400">
              {deniedProjects.length}
            </h2>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-6">
            <p className="text-sm text-sky-200">Total Views</p>
            <h2 className="mt-3 text-5xl font-black">
              {totalViews.toLocaleString()}
            </h2>
            <p className="mt-4 text-sm text-white/55">
              Real views tracked from SourceTV watch pages.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-6">
            <p className="text-sm text-sky-200">Estimated Creator Earnings</p>
            <h2 className="mt-3 text-5xl font-black">
              ${estimatedCreatorEarnings.toFixed(2)}
            </h2>
            <p className="mt-4 text-sm text-white/55">
              Prototype estimate using 50% creator share.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-6">
            <p className="text-sm text-sky-200">Top Project</p>
            <h2 className="mt-3 text-3xl font-black">
              {topProject ? topProject.title : "No approved projects yet"}
            </h2>
            <p className="mt-4 text-sm text-white/55">
              {topProject
                ? `${topProject.views || 0} views`
                : "Approved projects will appear here."}
            </p>
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-3xl font-black">Project Performance</h2>

            <Link
              href="/creator/submit"
              className="text-sm font-bold text-sky-300"
            >
              Submit another
            </Link>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
                      {project.type} • {project.genre}
                    </p>

                    <h3 className="mt-2 text-3xl font-black">
                      {project.title}
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                      {project.description}
                    </p>

                    <p className="mt-4 text-sm text-white/45">
                      Views: {(project.views || 0).toLocaleString()}
                    </p>

                    <div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-sky-400"
                        style={{
                          width: `${Math.min(project.views || 0, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div
                      className={`rounded-full px-4 py-2 text-sm font-black ${
                        project.status === "approved"
                          ? "bg-green-500 text-black"
                          : project.status === "denied"
                          ? "bg-red-500 text-black"
                          : "bg-yellow-300 text-black"
                      }`}
                    >
                      {project.status}
                    </div>

                    {project.status === "approved" && (
                      <Link
                        href={`/watch/${project.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold hover:border-sky-300"
                      >
                        View Page
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}