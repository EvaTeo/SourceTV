import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

const stageLabels: Record<string, string> = {
  submission: "Submission Received",
  metadata_review: "Metadata Review",
  content_review: "Content Review",
  rights_review: "Rights Review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
  rejected: "Rejected",
};

function formatDate(date?: Date | string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function workflowClass(stage?: string | null) {
  if (stage === "published") return "text-emerald-300";
  if (stage === "scheduled") return "text-purple-300";
  if (stage === "approved") return "text-sky-300";
  if (stage === "rights_review") return "text-yellow-300";
  if (stage === "rejected") return "text-red-300";
  return "text-white";
}

function contractClass(status?: string | null) {
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

export default async function AdminContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.projectSubmission.findUnique({
    where: { id },
    include: {
      rightsContracts: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!project) {
    return notFound();
  }

  const latestContract = project.rightsContracts[0];

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin/content"
          className="text-sm font-black text-sky-300 transition hover:text-sky-200"
        >
          ← Back to Content
        </Link>

        <section
          className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 bg-cover bg-center shadow-2xl"
          style={{
            backgroundImage:
              project.backdropUrl || project.thumbnailUrl
                ? `linear-gradient(to right, rgba(0,0,0,0.96), rgba(0,0,0,0.78), rgba(0,0,0,0.35)), url(${
                    project.backdropUrl || project.thumbnailUrl
                  })`
                : undefined,
          }}
        >
          <div className="p-6 md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              SourceTV Content Review
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] md:text-7xl">
              {project.title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65 md:text-base">
              {project.description || "No description provided."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>
                {stageLabels[project.workflowStage] || project.workflowStage}
              </Badge>

              {project.status && <Badge>{project.status}</Badge>}
              {project.type && <Badge>{project.type}</Badge>}
              {project.genre && <Badge>{project.genre}</Badge>}
              {project.featured && <Badge>Featured</Badge>}
              {project.editorPick && <Badge>Editor Pick</Badge>}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/admin/content/${project.id}/edit`}
                className="rounded-xl bg-sky-400 px-5 py-3 text-xs font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.3)] transition hover:bg-sky-300"
              >
                Edit Metadata
              </Link>

              <Link
                href={`/admin/content/${project.id}/status`}
                className="rounded-xl border border-white/10 bg-white/[0.08] px-5 py-3 text-xs font-black text-white/75 transition hover:border-sky-300/40 hover:text-sky-200"
              >
                Workflow / Status
              </Link>

              <Link
                href="/admin/contracts"
                className="rounded-xl border border-white/10 bg-white/[0.08] px-5 py-3 text-xs font-black text-white/75 transition hover:border-sky-300/40 hover:text-sky-200"
              >
                Rights Contracts
              </Link>

              {latestContract && (
                <Link
                  href={`/admin/contracts/${latestContract.id}`}
                  className="rounded-xl border border-emerald-300/25 bg-emerald-300/[0.08] px-5 py-3 text-xs font-black text-emerald-200 transition hover:border-emerald-300/50"
                >
                  Open Contract
                </Link>
              )}

              {project.workflowStage === "published" && (
                <Link
                  href={`/watch/${project.id}?preview=admin`}
                  className="rounded-xl border border-white/10 bg-white/[0.08] px-5 py-3 text-xs font-black text-white/75 transition hover:border-sky-300/40 hover:text-sky-200"
                >
                  Preview Live
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-4">
          <InfoCard
            label="Workflow Stage"
            value={stageLabels[project.workflowStage] || project.workflowStage}
            valueClass={workflowClass(project.workflowStage)}
          />
          <InfoCard label="Status" value={project.status || "Not set"} />
          <InfoCard
            label="Scheduled"
            value={formatDate(project.scheduledAt)}
          />
          <InfoCard
            label="Published"
            value={formatDate(project.publishedAt)}
          />
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
              Project Details
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Detail label="Title" value={project.title} />
              <Detail label="Type" value={project.type || "Not set"} />
              <Detail label="Genre" value={project.genre || "Not set"} />
              <Detail label="Year" value={project.year?.toString() || "Not set"} />
              <Detail label="Runtime" value={project.runtime || "Not set"} />
              <Detail
                label="Maturity Rating"
                value={project.maturityRating || "Not set"}
              />
              <Detail
                label="Creator"
                value={project.creatorName || "Not set"}
              />
              <Detail
                label="Creator Email"
                value={project.creatorEmail || "Not set"}
              />
              <Detail
                label="Company"
                value={project.creatorCompany || "Not set"}
              />
              <Detail
                label="Revenue Share"
                value={`${project.revenueShare ?? 50}%`}
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
                Rights Contract
              </p>

              <div className="mt-5">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] capitalize ${contractClass(
                    latestContract?.status
                  )}`}
                >
                  {latestContract
                    ? latestContract.status.replaceAll("_", " ")
                    : "No contract"}
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                <Detail
                  label="Rights Owner"
                  value={latestContract?.rightsOwner || "Not set"}
                />
                <Detail
                  label="Rights Contact"
                  value={latestContract?.rightsContact || "Not set"}
                />
                <Detail
                  label="License Type"
                  value={latestContract?.licenseType || "Not set"}
                />
                <Detail
                  label="License Start"
                  value={formatDate(latestContract?.licenseStartDate)}
                />
                <Detail
                  label="License End"
                  value={formatDate(latestContract?.licenseEndDate)}
                />
              </div>

              {latestContract ? (
                <Link
                  href={`/admin/contracts/${latestContract.id}`}
                  className="mt-5 block rounded-xl bg-sky-400 px-5 py-3 text-center text-xs font-black text-black transition hover:bg-sky-300"
                >
                  Open Contract
                </Link>
              ) : (
                <Link
                  href="/admin/contracts"
                  className="mt-5 block rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-center text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200"
                >
                  Create Contract
                </Link>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
                Performance
              </p>

              <Detail label="Views" value={`${project.views ?? 0}`} />
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <ReviewBox title="Metadata Notes" value={project.metadataNotes} />
          <ReviewBox title="Content Notes" value={project.contentNotes} />
          <ReviewBox title="Rights Notes" value={project.rightsNotes} />
          <ReviewBox title="General Review Notes" value={project.reviewNotes} />
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
            Assets
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <AssetCard title="Poster / Thumbnail" url={project.thumbnailUrl} />
            <AssetCard title="Backdrop" url={project.backdropUrl} />
            <AssetCard title="Card Art" url={project.cardArtUrl} />
            <AssetCard title="Title Logo" url={project.titleLogoUrl} />
            <AssetCard title="Trailer" url={project.trailerUrl} isLink />
            <AssetCard
              title="Main Video"
              url={project.mainVideoUrl || project.videoUrl}
              isLink
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/75 backdrop-blur-xl">
      {children}
    </span>
  );
}

function InfoCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
        {label}
      </p>

      <p className={`mt-3 text-lg font-black ${valueClass || "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-bold text-white/75">
        {value}
      </p>
    </div>
  );
}

function ReviewBox({
  title,
  value,
}: {
  title: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
      <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
        {title}
      </p>

      <p className="mt-4 text-sm leading-7 text-white/58">
        {value || "No notes yet."}
      </p>
    </div>
  );
}

function AssetCard({
  title,
  url,
  isLink,
}: {
  title: string;
  url?: string | null;
  isLink?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
      <div
        className="aspect-video bg-zinc-950 bg-cover bg-center"
        style={{
          backgroundImage: !isLink && url ? `url(${url})` : undefined,
        }}
      />

      <div className="p-4">
        <p className="font-black">{title}</p>

        {url ? (
          isLink ? (
            <a
              href={url}
              target="_blank"
              className="mt-2 block text-sm font-bold text-sky-300"
            >
              Open asset
            </a>
          ) : (
            <p className="mt-2 line-clamp-1 text-xs text-white/40">{url}</p>
          )
        ) : (
          <p className="mt-2 text-sm text-white/40">Not uploaded</p>
        )}
      </div>
    </div>
  );
}