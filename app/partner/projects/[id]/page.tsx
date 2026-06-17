import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

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

function recognition(project: {
  featured?: boolean | null;
  workflowStage?: string | null;
  recognitionLevel?: string | null;
}) {
  if (project.recognitionLevel) {
    return project.recognitionLevel;
  }

  if (project.featured && project.workflowStage === "published") {
    return "Featured Selection";
  }

  if (project.workflowStage === "published") {
    return "SourceTV Selection";
  }

  if (project.workflowStage === "approved") {
    return "Selection Pending";
  }

  return "In Review";
}

export default async function PartnerProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();

if (!user) {
  redirect("/login");
}

  const project = await prisma.projectSubmission.findUnique({
    where: { id },
  });

if (!project) return notFound();

if (
  user.role !== "admin" &&
  project.creatorEmail !== user.email
) {
  return notFound();
}
  return (
    <main className="min-h-screen bg-black px-4 pb-32 pt-28 text-white md:px-10 md:pb-24">
      <div className="mx-auto max-w-7xl">
        <Link href="/partner" className="text-sm font-bold text-sky-300">
          ← Back to Partner Dashboard
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
              SourceTV Partner Project
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] md:text-7xl">
              {project.title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65 md:text-base">
              {project.description || "No description has been provided yet."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>{stageLabels[project.workflowStage] || project.workflowStage}</Badge>
              <Badge>{recognition(project)}</Badge>
              {project.featured && <Badge>Featured</Badge>}
              {project.type && <Badge>{project.type}</Badge>}
              {project.genre && <Badge>{project.genre}</Badge>}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-4">
          <InfoCard label="Workflow Stage" value={stageLabels[project.workflowStage] || project.workflowStage} />
          <InfoCard label="Recognition" value={recognition(project)} />
          <InfoCard label="Scheduled" value={formatDate(project.scheduledAt)} />
          <InfoCard label="Published" value={formatDate(project.publishedAt)} />
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
              <Detail label="Maturity Rating" value={project.maturityRating || "Not set"} />
              <Detail label="Partner / Filmmaker" value={project.creatorName || "Not set"} />
              <Detail label="Company" value={project.creatorCompany || "Not set"} />
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
              Participation
            </p>

            <h2 className="mt-4 text-3xl font-black">Coming Soon</h2>

            <p className="mt-4 text-sm leading-7 text-white/58">
              Participation earnings will appear here when SourceTV activates
              payout cycles. Public view counts and platform revenue metrics are
              not shown in the partner portal.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
                Recognition
              </p>
              <p className="mt-2 text-lg font-black text-white">
                {recognition(project)}
              </p>
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
            <AssetCard title="Trailer" url={project.trailerUrl} isLink />
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
        {label}
      </p>

      <p className="mt-3 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-white/75">{value}</p>
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