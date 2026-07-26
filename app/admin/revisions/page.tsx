import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminRevisionsPage() {
  const revisions = await prisma.projectRevision.findMany({
    orderBy: {
      submittedAt: "desc",
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          creatorName: true,
          creatorCompany: true,
        },
      },
    },
  });

  const pendingCount = revisions.filter(
    (revision) => revision.status === "pending"
  ).length;

  const changesRequestedCount = revisions.filter(
    (revision) => revision.status === "changes_requested"
  ).length;

  const approvedCount = revisions.filter(
    (revision) => revision.status === "approved"
  ).length;

  return (
    <main className="space-y-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sky-300">
          SourceTV Content Operations
        </p>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Project Revisions
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55 sm:text-base">
              Review edits submitted by partners before applying them to live
              SourceTV projects.
            </p>
          </div>

          <Link
            href="/admin/content"
            className="inline-flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            Back to Content
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
            Total Revisions
          </p>
          <p className="mt-3 text-3xl font-black text-white">
            {revisions.length}
          </p>
        </article>

        <article className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.05] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200/70">
            Pending
          </p>
          <p className="mt-3 text-3xl font-black text-white">
            {pendingCount}
          </p>
        </article>

        <article className="rounded-2xl border border-sky-300/15 bg-sky-300/[0.05] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200/70">
            Changes Requested
          </p>
          <p className="mt-3 text-3xl font-black text-white">
            {changesRequestedCount}
          </p>
        </article>

        <article className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200/70">
            Approved
          </p>
          <p className="mt-3 text-3xl font-black text-white">
            {approvedCount}
          </p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-black text-white">
            Revision Review Queue
          </h2>
        </div>

        {revisions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-lg font-bold text-white">
              No revisions submitted
            </h3>

            <p className="mt-2 text-sm text-white/45">
              Partner revision requests will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {revisions.map((revision) => {
              const creator =
                revision.project.creatorCompany ||
                revision.project.creatorName ||
                revision.submittedByEmail;

              return (
                <Link
                  key={revision.id}
                  href={`/admin/revisions/${revision.id}`}
                  className="group grid gap-4 px-5 py-5 transition hover:bg-white/[0.035] sm:px-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(180px,0.7fr)_150px_120px] lg:items-center"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.05]">
                      {revision.proposedThumbnailUrl ||
                      revision.project.thumbnailUrl ? (
                        <img
                          src={
                            revision.proposedThumbnailUrl ??
                            revision.project.thumbnailUrl ??
                            ""
                          }
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-widest text-white/25">
                          No Art
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-black text-white">
                        {revision.proposedTitle}
                      </p>

                      <p className="mt-1 truncate text-sm text-white/45">
                        Live title: {revision.project.title}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-white/30">
                        Version {revision.versionNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                      Submitted By
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-white/70">
                      {creator}
                    </p>
                    <p className="mt-1 truncate text-xs text-white/35">
                      {revision.submittedByEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                      Submitted
                    </p>
                    <p className="mt-1 text-sm text-white/65">
                      {formatDate(revision.submittedAt)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 lg:justify-end">
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-white/70">
                      {formatStatus(revision.status)}
                    </span>

                    <span className="text-sm font-black text-sky-300 transition group-hover:translate-x-1">
                      Review →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}