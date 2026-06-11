import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function AdminDashboard() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const submissions = await prisma.projectSubmission.findMany();
  const partnerApplications = await prisma.partnerApplication.findMany();

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

  const pendingPartnerApplications = partnerApplications.filter(
    (app) => app.status === "pending"
  ).length;

  const estimatedAdRevenue = published * 125;
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
    { label: "Partner Applications", value: pendingPartnerApplications },
  ];

  const moneyCards = [
    {
      label: "Estimated Ad Revenue",
      value: `$${estimatedAdRevenue.toLocaleString()}`,
    },
    {
      label: "Estimated Participation Earnings",
      value: `$${estimatedParticipationEarnings.toLocaleString()}`,
    },
    {
      label: "Estimated SourceTV Profit",
      value: `$${estimatedSourceTVProfit.toLocaleString()}`,
    },
  ];

  const adminLinks = [
    {
      title: "Content Control Center",
      href: "/admin/content",
      description:
        "Manage submissions, workflow stages, publishing, recognition, rights, and messaging.",
    },
    {
      title: "Applications",
      href: "/admin/partners",
      description:
        "Review filmmakers, studios, producers, and distributors applying to join SourceTV.",
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      description:
        "Track views, watch time, top titles, audience trends, and platform growth.",
    },
    {
      title: "Revenue Center",
      href: "/admin/revenue",
      description:
        "Track ads, participation earnings, platform profit, and future payout cycles.",
    },
    {
      title: "Admin Upload",
      href: "/admin/upload",
      description:
        "Upload or add SourceTV-controlled titles directly into the platform.",
    },
    {
      title: "Review Queue",
      href: "/admin/review",
      description:
        "Legacy review queue for older pending submissions and approval tools.",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-white/10 pb-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            Admin Portal
          </p>

          <h1 className="mt-3 text-5xl font-black leading-tight md:text-7xl">
            SourceTV Control Center
          </h1>

          <p className="mt-5 max-w-2xl text-white/60">
            Manage content operations, partner applications, publishing,
            recognition, analytics, revenue, and platform tools from one place.
          </p>
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_25px_rgba(14,165,233,0.08)]"
            >
              <p className="text-sm font-bold text-white/45">{card.label}</p>
              <h2 className="mt-3 text-4xl font-black text-sky-300">
                {card.value}
              </h2>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {moneyCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-6"
            >
              <p className="text-sm font-bold text-sky-200">{card.label}</p>
              <h2 className="mt-3 text-4xl font-black">{card.value}</h2>
              <p className="mt-3 text-xs leading-5 text-white/45">
                Temporary estimate for prototype mode. Later this connects to
                real ad reports, participation earnings, and financial records.
              </p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-3xl font-black">Admin Tools</h2>
            <p className="mt-2 text-white/50">
              The operating system for SourceTV content, partners, analytics,
              and monetization.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {adminLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <div className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-sky-300/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.18)]">
                  <h3 className="text-2xl font-black group-hover:text-sky-300">
                    {link.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}