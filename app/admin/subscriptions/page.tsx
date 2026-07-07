import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { SUBSCRIPTION } from "@/app/lib/subscription";
import Link from "next/link";
import { redirect } from "next/navigation";

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function formatDate(value?: Date | null) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminSubscriptionsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionPriceId: true,
      subscriptionEndsAt: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const totalUsers = users.length;

  const premiumUsers = users.filter(
    (item) =>
      item.subscriptionTier === "premium" &&
      ["active", "trialing"].includes(item.subscriptionStatus)
  );

  const freeUsers = users.filter((item) => item.subscriptionTier !== "premium");

  const pastDueUsers = users.filter(
    (item) => item.subscriptionStatus === "past_due"
  );

  const canceledUsers = users.filter((item) =>
    ["canceled", "cancelled", "unpaid", "incomplete_expired"].includes(
      item.subscriptionStatus
    )
  );

  const activeSubscriptions = premiumUsers.length;

  const monthlyPrice = SUBSCRIPTION.premium.monthlyPrice;
  const mrr = activeSubscriptions * monthlyPrice;
  const arr = mrr * 12;
  const conversionRate = percent(premiumUsers.length, totalUsers);

  const upcomingRenewals = premiumUsers
    .filter((item) => item.subscriptionEndsAt)
    .sort(
      (a, b) =>
        new Date(a.subscriptionEndsAt || 0).getTime() -
        new Date(b.subscriptionEndsAt || 0).getTime()
    )
    .slice(0, 8);

  const recentSubscribers = premiumUsers.slice(0, 10);
  const recentUsers = users.slice(0, 10);

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2.6rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-9">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Subscriptions
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
                Premium Dashboard
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
                Track SourceTV Premium members, free users, subscription
                status, renewal dates, Stripe IDs, and recurring revenue.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href="/admin/analytics"
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200"
                >
                  Analytics
                </Link>

                <Link
                  href="/admin/revenue"
                  className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:text-sky-200"
                >
                  Revenue
                </Link>

                <Link
                  href="/account/billing"
                  className="rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-black text-black transition hover:bg-sky-300"
                >
                  View Billing Page
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-yellow-100">
                Monthly Recurring Revenue
              </p>
              <p className="mt-3 text-4xl font-black">
                ${mrr.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/45">
                Based on active Premium members at $
                {monthlyPrice.toFixed(2)}/month.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={totalUsers} />
          <StatCard label="Premium Members" value={premiumUsers.length} />
          <StatCard label="Free Members" value={freeUsers.length} />
          <StatCard label="Active Subscriptions" value={activeSubscriptions} />
          <StatCard label="Past Due" value={pastDueUsers.length} />
          <StatCard label="Canceled / Unpaid" value={canceledUsers.length} />
          <StatCard label="Conversion Rate" value={`${conversionRate}%`} />
          <StatCard
            label="Annual Run Rate"
            value={`$${arr.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}`}
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel
            eyebrow="Subscribers"
            title="Recent Premium Members"
            description="Newest users currently marked as active or trialing Premium members."
          >
            {recentSubscribers.length === 0 ? (
              <Empty text="No Premium subscribers yet." />
            ) : (
              <div className="space-y-3">
                {recentSubscribers.map((member) => (
                  <UserRow key={member.id} user={member} />
                ))}
              </div>
            )}
          </Panel>

          <Panel
            eyebrow="Renewals"
            title="Upcoming Renewals"
            description="Premium accounts sorted by the closest billing or subscription end date."
          >
            {upcomingRenewals.length === 0 ? (
              <Empty text="No upcoming renewals yet." />
            ) : (
              <div className="space-y-3">
                {upcomingRenewals.map((member) => (
                  <InfoRow
                    key={member.id}
                    label={member.name || member.email}
                    value={formatDate(member.subscriptionEndsAt)}
                    sublabel={member.email}
                  />
                ))}
              </div>
            )}
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <Panel
            eyebrow="Status"
            title="Subscription Health"
            description="Quick view of subscription state across the whole platform."
          >
            <div className="space-y-3">
              <ProgressRow
                label="Premium"
                value={premiumUsers.length}
                total={Math.max(totalUsers, 1)}
              />
              <ProgressRow
                label="Free"
                value={freeUsers.length}
                total={Math.max(totalUsers, 1)}
              />
              <ProgressRow
                label="Past Due"
                value={pastDueUsers.length}
                total={Math.max(totalUsers, 1)}
              />
              <ProgressRow
                label="Canceled / Unpaid"
                value={canceledUsers.length}
                total={Math.max(totalUsers, 1)}
              />
            </div>
          </Panel>

          <Panel
            eyebrow="Revenue"
            title="Revenue Snapshot"
            description="Simple recurring revenue estimates from current Premium member count."
          >
            <div className="space-y-3">
              <InfoRow
                label="Premium Price"
                value={`$${monthlyPrice.toFixed(2)}/mo`}
              />
              <InfoRow
                label="MRR"
                value={`$${mrr.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
              />
              <InfoRow
                label="ARR"
                value={`$${arr.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
              />
              <InfoRow label="Conversion" value={`${conversionRate}%`} />
            </div>
          </Panel>

          <Panel
            eyebrow="Stripe"
            title="Stripe Connection"
            description="How many users have Stripe customer and subscription records."
          >
            <div className="space-y-3">
              <InfoRow
                label="Stripe Customers"
                value={
                  users.filter((item) => item.stripeCustomerId).length
                }
              />
              <InfoRow
                label="Stripe Subscriptions"
                value={
                  users.filter((item) => item.stripeSubscriptionId).length
                }
              />
              <InfoRow
                label="Missing Customer ID"
                value={
                  premiumUsers.filter((item) => !item.stripeCustomerId).length
                }
              />
              <InfoRow
                label="Missing Subscription ID"
                value={
                  premiumUsers.filter((item) => !item.stripeSubscriptionId)
                    .length
                }
              />
            </div>
          </Panel>
        </section>

        <section className="mt-8">
          <Panel
            eyebrow="Users"
            title="All Subscription Accounts"
            description="Every SourceTV user with their plan, status, renewal date, and Stripe IDs."
          >
            {users.length === 0 ? (
              <Empty text="No users yet." />
            ) : (
              <div className="overflow-hidden rounded-3xl border border-white/10">
                <div className="hidden grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr_1fr] border-b border-white/10 bg-white/[0.045] px-4 py-3 text-[10px] font-black uppercase tracking-[0.22em] text-white/35 md:grid">
                  <div>User</div>
                  <div>Plan</div>
                  <div>Status</div>
                  <div>Renews / Ends</div>
                  <div>Stripe</div>
                </div>

                <div className="divide-y divide-white/10">
                  {users.map((account) => (
                    <div
                      key={account.id}
                      className="grid gap-3 bg-black/20 px-4 py-4 text-sm md:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr_1fr] md:items-center"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-black text-white/82">
                          {account.name || "Unnamed User"}
                        </p>
                        <p className="mt-1 truncate text-xs font-bold text-white/38">
                          {account.email}
                        </p>
                      </div>

                      <Badge
                        tone={
                          account.subscriptionTier === "premium"
                            ? "gold"
                            : "neutral"
                        }
                      >
                        {account.subscriptionTier}
                      </Badge>

                      <Badge
                        tone={
                          ["active", "trialing"].includes(
                            account.subscriptionStatus
                          )
                            ? "green"
                            : account.subscriptionStatus === "past_due"
                              ? "red"
                              : "neutral"
                        }
                      >
                        {account.subscriptionStatus}
                      </Badge>

                      <p className="text-xs font-bold text-white/55">
                        {formatDate(account.subscriptionEndsAt)}
                      </p>

                      <div className="min-w-0 text-xs text-white/40">
                        <p className="truncate">
                          {account.stripeCustomerId || "No customer"}
                        </p>
                        <p className="mt-1 truncate">
                          {account.stripeSubscriptionId || "No subscription"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Panel>
        </section>

        <section className="mt-8">
          <Panel
            eyebrow="Growth"
            title="Recent Signups"
            description="Newest SourceTV accounts, including free and Premium users."
          >
            <div className="grid gap-3 md:grid-cols-2">
              {recentUsers.map((account) => (
                <div
                  key={account.id}
                  className="rounded-2xl border border-white/10 bg-black/25 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-black text-white/82">
                        {account.name || "Unnamed User"}
                      </p>
                      <p className="mt-1 truncate text-xs font-bold text-white/38">
                        {account.email}
                      </p>
                    </div>

                    <Badge
                      tone={
                        account.subscriptionTier === "premium"
                          ? "gold"
                          : "neutral"
                      }
                    >
                      {account.subscriptionTier}
                    </Badge>
                  </div>

                  <p className="mt-3 text-xs font-bold text-white/40">
                    Joined {formatDate(account.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_25px_rgba(14,165,233,0.08)] md:p-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-white/38">
        {label}
      </p>
      <h2 className="mt-3 text-4xl font-black text-sky-300">{value}</h2>
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
    <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6">
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function UserRow({
  user,
}: {
  user: {
    name: string | null;
    email: string;
    subscriptionStatus: string;
    subscriptionEndsAt: Date | null;
  };
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-black text-white/82">
            {user.name || "Unnamed User"}
          </p>
          <p className="mt-1 truncate text-xs font-bold text-white/38">
            {user.email}
          </p>
        </div>

        <Badge tone="gold">Premium</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-xs">
        <p className="font-bold capitalize text-white/45">
          {user.subscriptionStatus}
        </p>
        <p className="font-black text-sky-300">
          {formatDate(user.subscriptionEndsAt)}
        </p>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-bold text-white/70">{label}</p>
        {sublabel && (
          <p className="mt-1 truncate text-xs font-bold text-white/35">
            {sublabel}
          </p>
        )}
      </div>
      <p className="shrink-0 text-right font-black text-sky-300">{value}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const width = Math.max(4, Math.round((value / total) * 100));

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-bold text-white/70">{label}</p>
        <p className="font-black text-sky-300">{value.toLocaleString()}</p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.6)]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "gold" | "green" | "red" | "neutral";
}) {
  const className =
    tone === "gold"
      ? "border-yellow-300/35 bg-yellow-300/12 text-yellow-100"
      : tone === "green"
        ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100"
        : tone === "red"
          ? "border-red-300/35 bg-red-300/10 text-red-100"
          : "border-white/10 bg-white/[0.04] text-white/55";

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${className}`}
    >
      {children}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-white/45">
      {text}
    </div>
  );
}