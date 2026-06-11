import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function AdminAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const titles = await prisma.projectSubmission.findMany();

  const totalViews = titles.reduce((sum, title) => sum + (title.views || 0), 0);
  const published = titles.filter((t) => t.workflowStage === "published");
  const inReview = titles.filter((t) =>
    ["submission", "metadata_review", "content_review", "rights_review"].includes(
      t.workflowStage
    )
  );

  const topTitles = [...titles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const genreCounts = titles.reduce((map: Record<string, number>, title) => {
    const genre = title.genre || "Uncategorized";
    map[genre] = (map[genre] || 0) + 1;
    return map;
  }, {});

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const partnerCounts = titles.reduce((map: Record<string, number>, title) => {
    const partner = title.creatorName || title.creatorEmail || "Unknown";
    map[partner] = (map[partner] || 0) + 1;
    return map;
  }, {});

  const topPartners = Object.entries(partnerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm font-bold text-sky-300">
          ← Back to Admin
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            SourceTV Analytics
          </p>

          <h1 className="mt-3 text-5xl font-black leading-tight md:text-7xl">
            Platform Insights
          </h1>

          <p className="mt-5 max-w-2xl text-white/60">
            Track catalog performance, workflow health, top titles, partner
            contribution, and early platform growth signals.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Titles" value={titles.length} />
          <StatCard label="Published" value={published.length} />
          <StatCard label="In Review" value={inReview.length} />
          <StatCard label="Total Views" value={totalViews} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Top Titles">
            {topTitles.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topTitles.map((title, index) => (
                  <Row
                    key={title.id}
                    label={`${index + 1}. ${title.title}`}
                    value={`${title.views || 0} views`}
                  />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Top Genres">
            {topGenres.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topGenres.map(([genre, count]) => (
                  <Row key={genre} label={genre} value={`${count} titles`} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Top Partners">
            {topPartners.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3">
                {topPartners.map(([partner, count]) => (
                  <Row key={partner} label={partner} value={`${count} titles`} />
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Workflow Health">
            <div className="space-y-3">
              <Row
                label="Submissions"
                value={
                  titles.filter((t) => t.workflowStage === "submission").length
                }
              />
              <Row
                label="Metadata Review"
                value={
                  titles.filter((t) => t.workflowStage === "metadata_review")
                    .length
                }
              />
              <Row
                label="Content Review"
                value={
                  titles.filter((t) => t.workflowStage === "content_review")
                    .length
                }
              />
              <Row
                label="Rights Review"
                value={
                  titles.filter((t) => t.workflowStage === "rights_review")
                    .length
                }
              />
              <Row
                label="Scheduled"
                value={
                  titles.filter((t) => t.workflowStage === "scheduled").length
                }
              />
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_25px_rgba(14,165,233,0.08)]">
      <p className="text-sm font-bold text-white/45">{label}</p>
      <h2 className="mt-3 text-4xl font-black text-sky-300">
        {value.toLocaleString()}
      </h2>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="font-bold text-white/70">{label}</p>
      <p className="shrink-0 font-black text-sky-300">{value}</p>
    </div>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-white/45">
      No data yet.
    </div>
  );
}