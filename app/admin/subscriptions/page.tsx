import Link from "next/link";
import { redirect } from "next/navigation";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import EmptyState from "@/app/components/admin/EmptyState";
import MetricCard from "@/app/components/admin/MetricCard";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { SUBSCRIPTION } from "@/app/lib/subscription";

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

  const freeUsers = users.filter(
    (item) => item.subscriptionTier !== "premium"
  );

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

  const stats = [
    { label: "Total Users", value: totalUsers },
    { label: "Premium Members", value: premiumUsers.length },
    { label: "Free Members", value: freeUsers.length },
    { label: "Active Subscriptions", value: activeSubscriptions },
    { label: "Past Due", value: pastDueUsers.length },
    { label: "Canceled / Unpaid", value: canceledUsers.length },
    { label: "Conversion Rate", value: `${conversionRate}%` },
    {
      label: "Annual Run Rate",
      value: `$${arr.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`,
    },
  ];

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Subscriptions"
        title="Premium Dashboard"
        description="Track SourceTV Premium members, free users, subscription status, renewal dates, Stripe records, and recurring revenue."
        actions={
          <>
            <Link
              href="/admin/analytics"
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Analytics
            </Link>

            <Link
              href="/admin/revenue"
              className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              Revenue
            </Link>

            <Link
              href="/account/billing"
              className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
            >
              Billing Page
            </Link>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.07] p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              Monthly Recurring Revenue
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
              ${mrr.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>

          <p className="max-w-md text-sm leading-6 text-white/45">
            Based on {activeSubscriptions.toLocaleString()} active Premium
            members at ${monthlyPrice.toFixed(2)} per month.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          eyebrow="Subscribers"
          title="Recent Premium Members"
          description="Newest accounts currently marked as active or trialing Premium members."
        >
          {recentSubscribers.length === 0 ? (
            <EmptyState title="No Premium subscribers yet." />
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
            <EmptyState title="No upcoming renewals yet." />
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

      <section className="grid gap-6 xl:grid-cols-3">
        <Panel
          eyebrow="Status"
          title="Subscription Health"
          description="Subscription state across the entire SourceTV user base."
        >
          <div className="space-y-4">
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
          description="Recurring revenue estimates from the current Premium member count."
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
          description="Users with Stripe customer and subscription records."
        >
          <div className="space-y-3">
            <InfoRow
              label="Stripe Customers"
              value={users.filter((item) => item.stripeCustomerId).length}
            />

            <InfoRow
              label="Stripe Subscriptions"
              value={users.filter((item) => item.stripeSubscriptionId).length}
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

      <Panel
        eyebrow="Users"
        title="All Subscription Accounts"
        description="Every SourceTV user with their plan, status, renewal date, and Stripe records."
      >
        {users.length === 0 ? (
          <EmptyState title="No users yet." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="hidden grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr_1fr] border-b border-white/10 bg-white/[0.025] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35 md:grid">
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
                  className="grid gap-3 bg-white/[0.015] px-4 py-4 text-sm transition hover:bg-white/[0.03] md:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr_1fr] md:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {account.name || "Unnamed User"}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/38">
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

                  <p className="text-xs font-medium text-white/55">
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

      <Panel
        eyebrow="Growth"
        title="Recent Signups"
        description="Newest SourceTV accounts, including free and Premium members."
      >
        {recentUsers.length === 0 ? (
          <EmptyState title="No recent signups." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {recentUsers.map((account) => (
              <div
                key={account.id}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      {account.name || "Unnamed User"}
                    </p>

                    <p className="mt-1 truncate text-xs text-white/38">
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

                <p className="mt-3 text-xs font-medium text-white/40">
                  Joined {formatDate(account.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </main>
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
    <section className="h-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>

      <div className="mt-5">{children}</div>
    </section>
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-white">
            {user.name || "Unnamed User"}
          </p>

          <p className="mt-1 truncate text-xs text-white/38">{user.email}</p>
        </div>

        <Badge tone="gold">Premium</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-xs">
        <p className="font-medium capitalize text-white/45">
          {user.subscriptionStatus}
        </p>

        <p className="font-semibold text-sky-300">
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
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white/70">{label}</p>

        {sublabel && (
          <p className="mt-1 truncate text-xs text-white/35">{sublabel}</p>
        )}
      </div>

      <p className="shrink-0 text-right text-sm font-semibold text-sky-300">
        {value}
      </p>
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
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm text-white/60">{label}</p>

        <p className="text-sm font-semibold text-white">
          {value.toLocaleString()}
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-sky-300"
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
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${className}`}
    >
      {children}
    </span>
  );
}