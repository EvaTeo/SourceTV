import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const card =
  "rounded-2xl border border-white/10 bg-white/[0.035] transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055] hover:shadow-[0_18px_60px_rgba(0,0,0,0.28)]";

const panel = "rounded-2xl border border-white/10 bg-white/[0.035]";

const reviewStages = [
  "submission",
  "metadata_review",
  "content_review",
  "rights_review",
];

function formatNumber(value: number) {
  return value.toLocaleString();
}

function label(value?: string | null) {
  if (!value) return "Unknown";
  return value.replaceAll("_", " ");
}

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

  const totalViews = submissions.reduce(
    (sum, submission) => sum + (submission.views || 0),
    0
  );

  const inReview = submissions.filter((s) =>
    reviewStages.includes(s.workflowStage || "")
  );

  const published = submissions.filter((s) => s.workflowStage === "published");
  const scheduled = submissions.filter((s) => s.workflowStage === "scheduled");
  const featured = submissions.filter((s) => s.featured);

  const pendingApplications = partnerApplications.filter(
    (app) => app.status === "pending"
  );

  const metrics = [
    { label: "Titles", value: submissions.length, href: "/admin/content" },
    { label: "Published", value: published.length, href: "/admin/content" },
    { label: "In Review", value: inReview.length, href: "/admin/review" },
    { label: "Views", value: totalViews, href: "/admin/analytics" },
    {
      label: "Applications",
      value: partnerApplications.length,
      href: "/admin/partners",
    },
    {
      label: "Pending",
      value: pendingApplications.length,
      href: "/admin/partners",
    },
    { label: "Scheduled", value: scheduled.length, href: "/admin/content" },
    { label: "Featured", value: featured.length, href: "/admin/content" },
  ];

  const quickActions = [
    {
      icon: "＋",
      title: "Upload Content",
      description: "Add a new title",
      href: "/admin/upload",
    },
    {
      icon: "✓",
      title: "Review Queue",
      description: `${inReview.length} needs review`,
      href: "/admin/review",
      badge: inReview.length,
    },
    {
      icon: "👥",
      title: "Review Partners",
      description: `${pendingApplications.length} pending`,
      href: "/admin/partners",
      badge: pendingApplications.length,
    },
    {
      icon: "✉",
      title: "Open Inbox",
      description: "Partner messages",
      href: "/admin/inbox",
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Platform metrics",
      href: "/admin/analytics",
    },
  ];

  const tools = [
    { icon: "📁", title: "Content", href: "/admin/content" },
    { icon: "✓", title: "Review", href: "/admin/review" },
    { icon: "👥", title: "Partners", href: "/admin/partners" },
    { icon: "✉", title: "Inbox", href: "/admin/inbox" },
    { icon: "📄", title: "Contracts", href: "/admin/contracts" },
    { icon: "📺", title: "Ads", href: "/admin/ads" },
    { icon: "👤", title: "Users", href: "/admin/users" },
    { icon: "📈", title: "Analytics", href: "/admin/analytics" },
    { icon: "💰", title: "Revenue", href: "/admin/revenue" },
  ];

  const recentTitles = submissions.slice(0, 6);
  const recentApplications = partnerApplications.slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            SourceTV Studio
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
            Your command center for content, partners, users, advertising,
            revenue, and publishing.
          </p>
        </div>

        <Link
          href="/browse"
          className="w-fit rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
        >
          Open Viewer Site
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Link key={metric.label} href={metric.href} className={`${card} p-4`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
              {formatNumber(metric.value)}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-3 lg:grid-cols-5">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href} className={`${card} p-4`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-sm">
                {action.icon}
              </div>

              {!!action.badge && (
                <span className="rounded-full bg-sky-300/10 px-2 py-0.5 text-xs font-semibold text-sky-300">
                  {action.badge}
                </span>
              )}
            </div>

            <h3 className="mt-3 text-sm font-semibold text-white">
              {action.title}
            </h3>

            <p className="mt-1 text-sm text-white/42">{action.description}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className={`${panel} overflow-hidden`}>
          <SectionHeader
            title="Recent Activity"
            description="Latest movement across the publishing pipeline."
            href="/admin/content"
          />

          <div className="divide-y divide-white/10">
            {recentTitles.length === 0 ? (
              <EmptyState
                title="No recent activity."
                description="Content updates will appear here once titles are added."
              />
            ) : (
              recentTitles.map((title) => (
                <Link
                  key={title.id}
                  href={`/admin/content/${title.id}/edit`}
                  className="grid gap-3 px-5 py-3.5 transition hover:bg-white/[0.03] md:grid-cols-[1fr_150px_70px]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {title.title}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {label(title.workflowStage || title.status)}
                      {title.creatorName ? ` • ${title.creatorName}` : ""}
                    </p>
                  </div>

                  <p className="text-xs text-white/35 md:text-right">
                    {title.views ? `${formatNumber(title.views)} views` : "No views"}
                  </p>

                  <p className="text-xs font-semibold text-sky-300 md:text-right">
                    Open
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className={`${panel} overflow-hidden`}>
          <SectionHeader
            title="System Status"
            description="Core services and platform health."
          />

          <div className="space-y-1 px-5 pb-5">
            <StatusRow label="Bunny Stream" value="Connected" />
            <StatusRow label="Stripe" value="Connected" />
            <StatusRow label="Database" value="Healthy" />
            <StatusRow label="Admin Shell" value="Active" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className={`${panel} overflow-hidden`}>
          <SectionHeader
            title="Recent Partner Applications"
            description="Creators, studios, and distributors requesting access."
            href="/admin/partners"
          />

          <div className="divide-y divide-white/10">
            {recentApplications.length === 0 ? (
              <EmptyState
                title="No recent partner applications."
                description="New creator applications will appear here."
              />
            ) : (
              recentApplications.map((application) => (
                <Link
                  key={application.id}
                  href="/admin/partners"
                  className="grid gap-3 px-5 py-3.5 transition hover:bg-white/[0.03] md:grid-cols-[1fr_140px_70px]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {application.fullName || "Untitled application"}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/40">
                      {application.company || "Independent creator"}
                    </p>
                  </div>

                  <p className="text-xs capitalize text-white/35 md:text-right">
                    {application.status || "pending"}
                  </p>

                  <p className="text-xs font-semibold text-sky-300 md:text-right">
                    Review
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className={`${panel} p-5`}>
          <div>
            <h2 className="text-base font-semibold text-white">Admin Tools</h2>
            <p className="mt-1 text-sm text-white/40">
              Run every part of SourceTV from one place.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-xl border border-white/10 bg-white/[0.025] p-3 text-center transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="text-base">{tool.icon}</div>
                <p className="mt-2 truncate text-xs font-semibold text-white/65">
                  {tool.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/40">{description}</p>
      </div>

      {href && (
        <Link
          href={href}
          className="shrink-0 text-sm font-medium text-sky-300 transition hover:text-sky-200"
        >
          View all
        </Link>
      )}
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
        <span className="text-sm text-white/65">{label}</span>
      </div>

      <span className="text-xs font-medium text-white/35">{value}</span>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-5 py-8">
      <p className="text-sm font-medium text-white/65">{title}</p>
      <p className="mt-1 text-sm text-white/35">{description}</p>
    </div>
  );
}