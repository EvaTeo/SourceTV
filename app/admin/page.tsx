import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const submissions = await prisma.projectSubmission.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const partnerApplications = await prisma.partnerApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalSubmissions = submissions.length;

  const submissionStage = submissions.filter(
    (s) => s.workflowStage === "submission"
  ).length;

  const metadataReview = submissions.filter(
    (s) => s.workflowStage === "metadata_review"
  ).length;

  const contentReview = submissions.filter(
    (s) => s.workflowStage === "content_review"
  ).length;

  const rightsReview = submissions.filter(
    (s) => s.workflowStage === "rights_review"
  ).length;

  const published = submissions.filter(
    (s) => s.workflowStage === "published"
  ).length;

  const scheduled = submissions.filter(
    (s) => s.workflowStage === "scheduled"
  ).length;

  const featured = submissions.filter((s) => s.featured).length;

  const pendingPartnerApplications = partnerApplications.filter(
    (app) => app.status === "pending"
  ).length;

  const totalViews = submissions.reduce(
    (sum, submission) => sum + (submission.views || 0),
    0
  );

  const estimatedAdRevenue = (totalViews / 1000) * 12;
  const estimatedParticipationEarnings = estimatedAdRevenue * 0.45;
  const estimatedSourceTVProfit =
    estimatedAdRevenue - estimatedParticipationEarnings;

  const statCards = [
    { label: "Total Titles", value: totalSubmissions },
    { label: "Submissions", value: submissionStage },
    { label: "Metadata Review", value: metadataReview },
    { label: "Content Review", value: contentReview },
    { label: "Rights Review", value: rightsReview },
    { label: "Scheduled", value: scheduled },
    { label: "Published", value: published },
    { label: "Featured", value: featured },
  ];

  const moneyCards = [
    {
      label: "Estimated Ad Revenue",
      value: money(estimatedAdRevenue),
      note: `${totalViews.toLocaleString()} internal views at prototype CPM.`,
    },
    {
      label: "Partner Pool",
      value: money(estimatedParticipationEarnings),
      note: "Estimated 45% partner participation model.",
    },
    {
      label: "SourceTV Profit",
      value: money(estimatedSourceTVProfit),
      note: "Estimated retained platform revenue.",
    },
  ];

  const adminLinks = [
    {
      title: "Content Control Center",
      href: "/admin/content",
      eyebrow: "Catalog",
      description:
        "Manage submissions, workflow stages, publishing, recognition, rights, and messaging.",
    },
    {
      title: "Applications",
      href: "/admin/partners",
      eyebrow: "Partners",
      description:
        "Review filmmakers, studios, producers, and distributors applying to join SourceTV.",
      alert: pendingPartnerApplications,
    },
    {
      title: "Review Queue",
      href: "/admin/review",
      eyebrow: "Approvals",
      description:
        "Approve, schedule, reject, archive, preview, and update uploaded titles.",
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      eyebrow: "Insights",
      description:
        "Track views, top titles, workflow health, partners, genres, and platform activity.",
    },
    {
      title: "Revenue Center",
      href: "/admin/revenue",
      eyebrow: "Finance",
      description:
        "Track ads, participation earnings, platform profit, and future payout cycles.",
    },
    {
      title: "Admin Upload",
      href: "/admin/upload",
      eyebrow: "Publishing",
      description:
        "Upload or add SourceTV-controlled titles directly into the platform.",
    },
  ];

  const recentTitles = submissions.slice(0, 5);
  const recentApplications = partnerApplications.slice(0, 5);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              Admin Portal
            </p>

            <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight md:text-7xl">
              SourceTV Control Center
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
              Manage content operations, partner applications, publishing,
              recognition, analytics, revenue, and platform tools from one
              place.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-sky-300/20 bg-sky-400/10 p-5 shadow-[0_0_45px_rgba(56,189,248,0.08)] backdrop-blur-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-200">
              Pending Applications
            </p>

            <p className="mt-2 text-4xl font-black">
              {pendingPartnerApplications}
            </p>

            <Link
              href="/admin/partners"
              className="mt-3 inline-flex text-xs font-black text-sky-200 transition hover:text-white"
            >
              Review Applications →
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <AdminStat key={card.label} label={card.label} value={card.value} />
          ))}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {moneyCards.map((card) => (
            <MoneyCard
              key={card.label}
              label={card.label}
              value={card.value}
              note={card.note}
            />
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-black">Admin Tools</h2>
              <p className="mt-2 text-sm text-white/50">
                The operating system for SourceTV content, partners, analytics,
                and monetization.
              </p>
            </div>

            <Link
              href="/browse"
              className="w-fit rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200"
            >
              Open Viewer Site
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {adminLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <div className="group relative h-full overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-300/45 hover:shadow-[0_0_40px_rgba(14,165,233,0.16)]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.09),transparent_34%)] opacity-0 transition group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                        {link.eyebrow}
                      </p>

                      {!!link.alert && (
                        <span className="rounded-full border border-sky-300/35 bg-sky-300/12 px-2.5 py-1 text-[10px] font-black text-sky-100">
                          {link.alert}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-2xl font-black transition group-hover:text-sky-300">
                      {link.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/55">
                      {link.description}
                    </p>

                    <p className="mt-5 text-xs font-black text-white/35 transition group-hover:text-sky-200">
                      Open →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <Panel
            eyebrow="Catalog Activity"
            title="Recently Updated Titles"
            description="Latest titles touched in the SourceTV catalog."
          >
            {recentTitles.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {recentTitles.map((title) => (
                  <ActivityRow
                    key={title.id}
                    title={title.title}
                    meta={`${title.workflowStage || title.status || "unknown"}${
                      title.creatorName ? ` • ${title.creatorName}` : ""
                    }`}
                    href={`/admin/content/${title.id}/edit`}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel
            eyebrow="Partner Activity"
            title="Recent Applications"
            description="Newest partner submissions and their review status."
          >
            {recentApplications.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {recentApplications.map((application) => (
                  <ActivityRow
                    key={application.id}
                    title={application.fullName}
                    meta={`${application.status}${
                      application.company ? ` • ${application.company}` : ""
                    }`}
                    href="/admin/partners"
                  />
                ))}
              </div>
            )}
          </Panel>
        </section>
      </div>
    </main>
  );
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: value > 0 && value < 100 ? 2 : 0,
    maximumFractionDigits: value > 0 && value < 100 ? 2 : 0,
  })}`;
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function MoneyCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-sky-300/20 bg-sky-400/10 p-5 shadow-[0_0_35px_rgba(56,189,248,0.07)]">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-200">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>

      <p className="mt-2 text-xs leading-5 text-white/45">{note}</p>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-[1.65rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black">{title}</h2>

      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>

      <div className="mt-5">{children}</div>
    </div>
  );
}

function ActivityRow({
  title,
  meta,
  href,
}: {
  title: string;
  meta: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 transition hover:border-sky-300/35 hover:bg-sky-300/8"
    >
      <div className="min-w-0">
        <p className="truncate font-black text-white/80">{title}</p>
        <p className="mt-1 truncate text-xs font-bold uppercase tracking-[0.12em] text-white/35">
          {meta}
        </p>
      </div>

      <span className="shrink-0 text-xs font-black text-sky-300">Open</span>
    </Link>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-white/45">
      No data yet.
    </div>
  );
}