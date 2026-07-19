import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

const ESTIMATED_CPM = 12;

export default async function PartnerRevenuePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "partner" && user.role !== "admin") {
    redirect("/partner/apply");
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

  const projectEarnings = titles.map((title) => {
    const grossRevenue =
      ((title.views || 0) / 1000) * ESTIMATED_CPM;

    const revenueShare = title.revenueShare ?? 50;

    const partnerRevenue =
      grossRevenue * (revenueShare / 100);

    return {
      id: title.id,
      title: title.title,
      genre: title.genre,
      workflowStage: title.workflowStage,
      revenueShare,
      grossRevenue,
      partnerRevenue,
    };
  });

  const estimatedEarnings = projectEarnings.reduce(
    (sum, project) => sum + project.partnerRevenue,
    0
  );

  const availableBalance = 0;
  const pendingBalance = estimatedEarnings;
  const lifetimePaid = 0;

  const publishedTitles = titles.filter(
    (title) => title.workflowStage === "published"
  );

  const earningTitles = projectEarnings
    .filter((project) => project.partnerRevenue > 0)
    .sort(
      (a, b) => b.partnerRevenue - a.partnerRevenue
    );

  return (
    <main className="mx-auto w-full max-w-[1240px] pb-16">
      <header className="border-b border-white/10 pb-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
              SourceTV Partner Studio
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Earnings &amp; Payouts
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/45 sm:text-[15px]">
              Review estimated project earnings, revenue-share
              participation, payout readiness, and future payment
              activity.
            </p>
          </div>

          <Link
            href="/partner/contracts"
            className="inline-flex w-fit rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-xs font-black text-white/65 transition hover:border-sky-300/30 hover:text-white"
          >
            Review Contracts
          </Link>
        </div>
      </header>

      <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <article className="border-b border-white/10 pb-7 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
            Estimated Partner Earnings
          </p>

          <p className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
            {money(estimatedEarnings)}
          </p>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/38">
            This amount is a prototype estimate based on current
            project participation percentages. Final earnings will
            be determined by SourceTV reporting and contract terms.
          </p>

          <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
            <BalanceItem
              label="Available"
              value={money(availableBalance)}
              detail="Ready for payout"
            />

            <BalanceItem
              label="Pending"
              value={money(pendingBalance)}
              detail="Awaiting settlement"
            />

            <BalanceItem
              label="Lifetime Paid"
              value={money(lifetimePaid)}
              detail="Completed payouts"
            />
          </div>
        </article>

        <article>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
            Payout Status
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Payout Setup Required
          </h2>

          <p className="mt-3 text-sm leading-6 text-white/38">
            Connect a verified payout account before SourceTV begins
            distributing partner earnings.
          </p>

          <div className="mt-6 space-y-4">
            <StatusLine
              label="Payout Method"
              value="Not connected"
              warning
            />

            <StatusLine
              label="Tax Information"
              value="Not submitted"
              warning
            />

            <StatusLine
              label="Payout Schedule"
              value="Monthly"
            />

            <StatusLine
              label="Currency"
              value="USD"
            />
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-sky-300 px-4 py-3 text-sm font-black text-black transition hover:bg-sky-200"
          >
            Set Up Payout Method
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-white/22">
            This button is visual until Stripe Connect is wired.
          </p>
        </article>
      </section>

      <section className="mt-10">
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
              Project Participation
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Earnings by Project
            </h2>

            <p className="mt-2 text-sm text-white/35">
              Estimated partner earnings based on the revenue share
              assigned to each title.
            </p>
          </div>

          <p className="text-xs text-white/25">
            {publishedTitles.length} published{" "}
            {publishedTitles.length === 1 ? "title" : "titles"}
          </p>
        </div>

        {earningTitles.length === 0 ? (
          <div className="mt-5 border-b border-white/10 py-10">
            <h3 className="text-lg font-black text-white">
              No project earnings yet
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/38">
              Revenue participation will appear here after an
              eligible project begins generating reportable
              earnings.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {earningTitles.map((project) => (
              <ProjectEarningRow
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
            Payment Activity
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Payout History
          </h2>

          <div className="mt-6 border-y border-white/10 py-8">
            <p className="text-base font-black text-white">
              No payouts issued yet
            </p>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/38">
              Completed payouts, pending transfers, payment dates,
              and transaction references will appear here after
              revenue distributions begin.
            </p>
          </div>
        </article>

        <article>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
            Statements
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Reports &amp; Documents
          </h2>

          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            <DocumentRow
              label="Monthly Statements"
              status="Not available"
            />

            <DocumentRow
              label="Annual Earnings Summary"
              status="Not available"
            />

            <DocumentRow
              label="Tax Documents"
              status="Not available"
            />
          </div>
        </article>
      </section>

      <section className="mt-10 border-t border-white/10 pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
          Revenue Information
        </p>

        <div className="mt-5 grid gap-7 md:grid-cols-3">
          <InfoBlock
            title="Revenue Share"
            text="Each project follows the participation percentage recorded in its SourceTV agreement."
          />

          <InfoBlock
            title="Monthly Payouts"
            text="Eligible balances will be grouped into monthly payouts after settlement and verification."
          />

          <InfoBlock
            title="Final Reporting"
            text="Prototype estimates are informational. Final statements and contracts determine payable amounts."
          />
        </div>
      </section>
    </main>
  );
}

function money(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function BalanceItem({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.17em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-white/25">
        {detail}
      </p>
    </div>
  );
}

function StatusLine({
  label,
  value,
  warning = false,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/[0.07] pb-3">
      <span className="text-xs font-semibold text-white/35">
        {label}
      </span>

      <span
        className={`text-xs font-black ${
          warning
            ? "text-yellow-100"
            : "text-white/65"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function ProjectEarningRow({
  project,
}: {
  project: {
    id: string;
    title: string;
    genre: string | null;
    workflowStage: string;
    revenueShare: number;
    grossRevenue: number;
    partnerRevenue: number;
  };
}) {
  return (
    <article className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_130px_150px_150px] sm:items-center">
      <div className="min-w-0">
        <h3 className="truncate text-base font-black text-white">
          {project.title}
        </h3>

        <p className="mt-1 text-xs text-white/28">
          {project.genre || "Uncategorized"} ·{" "}
          {formatStage(project.workflowStage)}
        </p>
      </div>

      <TableValue
        label="Revenue Share"
        value={`${project.revenueShare}%`}
      />

      <TableValue
        label="Gross Revenue"
        value={money(project.grossRevenue)}
      />

      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20 sm:hidden">
          Partner Earnings
        </p>

        <p className="mt-1 text-sm font-black text-sky-200 sm:mt-0">
          {money(project.partnerRevenue)}
        </p>
      </div>
    </article>
  );
}

function TableValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/20 sm:hidden">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-white/60 sm:mt-0">
        {value}
      </p>
    </div>
  );
}

function DocumentRow({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <span className="text-sm font-semibold text-white/48">
        {label}
      </span>

      <span className="text-[10px] font-black uppercase tracking-[0.13em] text-white/22">
        {status}
      </span>
    </div>
  );
}

function InfoBlock({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <article>
      <h3 className="text-base font-black text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-white/35">
        {text}
      </p>
    </article>
  );
}

function formatStage(stage: string) {
  return stage
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}