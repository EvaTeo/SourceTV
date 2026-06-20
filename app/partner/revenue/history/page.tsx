import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

const ESTIMATED_CPM = 12;

export default async function PartnerRevenueHistoryPage() {
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
    orderBy: {
      updatedAt: "desc",
    },
  });

  const monthlyRows = [
    {
      month: "January 2026",
      views: Math.round(
        titles.reduce((sum, title) => sum + (title.views || 0), 0) * 0.08
      ),
      status: "Paid",
    },
    {
      month: "February 2026",
      views: Math.round(
        titles.reduce((sum, title) => sum + (title.views || 0), 0) * 0.12
      ),
      status: "Paid",
    },
    {
      month: "March 2026",
      views: Math.round(
        titles.reduce((sum, title) => sum + (title.views || 0), 0) * 0.16
      ),
      status: "Paid",
    },
    {
      month: "April 2026",
      views: Math.round(
        titles.reduce((sum, title) => sum + (title.views || 0), 0) * 0.18
      ),
      status: "Processing",
    },
    {
      month: "May 2026",
      views: Math.round(
        titles.reduce((sum, title) => sum + (title.views || 0), 0) * 0.22
      ),
      status: "Pending",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/partner/revenue"
          className="text-sm font-black text-sky-300 transition hover:text-sky-200"
        >
          ← Back to Revenue Center
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            SourceTV Partner Revenue
          </p>

          <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
            Earnings History
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
            Historical payout estimates and future revenue reporting.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-7">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
            Monthly Earnings
          </p>

          <div className="mt-6 space-y-4">
            {monthlyRows.map((row) => {
              const revenue =
                (row.views / 1000) * ESTIMATED_CPM;

              return (
                <div
                  key={row.month}
                  className="rounded-2xl border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-black">
                        {row.month}
                      </h3>

                      <p className="mt-1 text-sm text-white/45">
                        {row.views.toLocaleString()} views
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-2xl font-black text-sky-300">
                        {money(revenue)}
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.15em] ${
                          row.status === "Paid"
                            ? "bg-emerald-400/15 text-emerald-300"
                            : row.status === "Processing"
                            ? "bg-yellow-400/15 text-yellow-300"
                            : "bg-sky-400/15 text-sky-300"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <InfoCard
            title="Revenue Exports"
            text="Monthly CSV exports will appear here in a future update."
          />

          <InfoCard
            title="Tax Documents"
            text="1099 reporting and tax documentation will be available here."
          />

          <InfoCard
            title="Automated Payouts"
            text="Future Stripe payout integration will manage earnings distribution."
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