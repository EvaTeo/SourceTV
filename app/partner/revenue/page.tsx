import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const ESTIMATED_CPM = 12;

export default async function PartnerRevenuePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "partner" && user.role !== "admin") {
    redirect("/partner");
  }

  const titles = await prisma.projectSubmission.findMany({
    where:
      user.role === "admin"
        ? {}
        : {
            creatorEmail: user.email,
          },
    orderBy: [
      {
        views: "desc",
      },
    ],
  });

  const totalViews = titles.reduce(
    (sum, title) => sum + (title.views || 0),
    0
  );

  const estimatedRevenue = (totalViews / 1000) * ESTIMATED_CPM;

  const estimatedPartnerRevenue = titles.reduce((sum, title) => {
    const revenue = ((title.views || 0) / 1000) * ESTIMATED_CPM;

    return (
      sum +
      revenue * ((title.revenueShare ?? 50) / 100)
    );
  }, 0);

  const publishedTitles = titles.filter(
    (title) => title.workflowStage === "published"
  );

  const scheduledTitles = titles.filter(
    (title) => title.workflowStage === "scheduled"
  );

  const topTitles = [...titles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Partner Revenue
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
                Earnings Center
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
                Track estimated earnings, title performance,
                participation revenue, and future payout activity.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-200">
                Estimated Earnings
              </p>

              <p className="mt-3 text-4xl font-black text-sky-300">
                {money(estimatedPartnerRevenue)}
              </p>

              <p className="mt-2 text-xs leading-5 text-white/45">
                Prototype estimate based on views and
                participation percentages.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="My Titles"
            value={titles.length}
          />

          <StatCard
            label="Published"
            value={publishedTitles.length}
          />

          <StatCard
            label="Scheduled"
            value={scheduledTitles.length}
          />

          <StatCard
            label="Total Views"
            value={totalViews.toLocaleString()}
          />

          <StatCard
            label="Gross Revenue"
            value={money(estimatedRevenue)}
          />

          <StatCard
            label="My Share"
            value={money(estimatedPartnerRevenue)}
          />

          <StatCard
            label="Avg Views"
            value={
              titles.length
                ? Math.round(totalViews / titles.length)
                : 0
            }
          />

          <StatCard
            label="Payout Status"
            value="Coming Soon"
          />
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
            Top Performing Titles
          </p>

          <h2 className="mt-2 text-2xl font-black md:text-4xl">
            Performance Breakdown
          </h2>

          {topTitles.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-6 text-white/50">
              No titles available yet.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {topTitles.map((title, index) => {
                const views = title.views || 0;

                const revenue =
                  (views / 1000) * ESTIMATED_CPM;

                const partnerRevenue =
                  revenue *
                  ((title.revenueShare ?? 50) / 100);

                return (
                  <div
                    key={title.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-400 text-sm font-black text-black">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-lg font-black">
                        {title.title}
                      </p>

                      <p className="mt-1 text-xs font-bold text-white/40">
                        {(views || 0).toLocaleString()} views
                        {title.genre
                          ? ` • ${title.genre}`
                          : ""}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-sky-300">
                        {money(partnerRevenue)}
                      </p>

                      <p className="text-xs text-white/40">
                        Estimated Share
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">

            <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
  <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
    Future Payout History
  </p>

  <h2 className="mt-2 text-2xl font-black md:text-4xl">
    Payment Activity
  </h2>

  <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-6">
    <p className="text-lg font-black text-white">
      No payouts issued yet.
    </p>

    <p className="mt-2 text-sm leading-6 text-white/50">
      When SourceTV begins revenue distributions, completed payouts,
      pending payments, tax reporting, and monthly statements will
      appear here.
    </p>
  </div>
</section>

          <InfoCard
            title="Monthly Payouts"
            text="Automated payouts will appear here when SourceTV activates revenue distributions."
          />

          <InfoCard
            title="Tax Documents"
            text="1099s and future payout reporting will be available here."
          />

          <InfoCard
            title="Revenue Reports"
            text="Monthly and yearly earnings exports will appear here."
          />
        </section>
      </div>
    </main>
  );
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_25px_rgba(14,165,233,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {label}
      </p>

      <h2 className="mt-3 text-3xl font-black text-sky-300">
        {value}
      </h2>
    </div>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl">
      <h3 className="text-xl font-black">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-white/50">
        {text}
      </p>
    </div>
  );
}