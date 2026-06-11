import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export default async function AdminRevenuePage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const titles = await prisma.projectSubmission.findMany({
    orderBy: { views: "desc" },
  });

  const published = titles.filter((t) => t.workflowStage === "published");
  const totalViews = titles.reduce((sum, t) => sum + (t.views || 0), 0);

  const estimatedCPM = 12;
  const estimatedAdRevenue = (totalViews / 1000) * estimatedCPM;
  const participationEarnings = estimatedAdRevenue * 0.45;
  const sourceTVProfit = estimatedAdRevenue - participationEarnings;

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="text-sm font-bold text-sky-300">
          ← Back to Admin
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            SourceTV Revenue Center
          </p>

          <h1 className="mt-3 text-5xl font-black md:text-7xl">
            Revenue & Participation
          </h1>

          <p className="mt-5 max-w-2xl text-white/60">
            Prototype financial overview for ad revenue, SourceTV profit, and
            partner participation earnings. Final numbers will connect to ad
            reports later.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <Card label="Total Views" value={totalViews.toLocaleString()} />
          <Card label="Published Titles" value={published.length} />
          <Card
            label="Estimated Ad Revenue"
            value={`$${estimatedAdRevenue.toFixed(2)}`}
          />
          <Card
            label="SourceTV Profit"
            value={`$${sourceTVProfit.toFixed(2)}`}
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Participation Earnings">
            <BigMoney value={`$${participationEarnings.toFixed(2)}`} />
            <p className="mt-3 text-sm leading-6 text-white/45">
              Prototype estimate using 45% of estimated ad revenue as the
              participation pool. This is not shown publicly to partners.
            </p>
          </Panel>

          <Panel title="Revenue Assumptions">
            <Row label="Estimated CPM" value={`$${estimatedCPM}`} />
            <Row label="Ad Revenue Formula" value="views ÷ 1000 × CPM" />
            <Row label="Participation Pool" value="45%" />
            <Row label="SourceTV Retained" value="55%" />
          </Panel>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
          <h2 className="text-3xl font-black">Top Revenue Titles</h2>

          <div className="mt-5 space-y-3">
            {titles.slice(0, 10).map((title) => {
              const titleRevenue = ((title.views || 0) / 1000) * estimatedCPM;

              return (
                <Row
                  key={title.id}
                  label={title.title}
                  value={`$${titleRevenue.toFixed(2)} est.`}
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <p className="text-sm font-bold text-white/45">{label}</p>
      <h2 className="mt-3 text-3xl font-black text-sky-300">{value}</h2>
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
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function BigMoney({ value }: { value: string }) {
  return <h3 className="text-5xl font-black text-sky-300">{value}</h3>;
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="font-bold text-white/70">{label}</p>
      <p className="font-black text-sky-300">{value}</p>
    </div>
  );
}