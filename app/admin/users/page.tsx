"use client";

import { useEffect, useMemo, useState } from "react";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionEndsAt?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  createdAt: string;
};

const roleOptions = ["user", "viewer", "partner", "admin"];

const filters = [
  { label: "All", value: "all" },
  { label: "Admins", value: "admin" },
  { label: "Partners", value: "partner" },
  { label: "Premium", value: "premium" },
  { label: "Free", value: "free" },
  { label: "Past Due", value: "past_due" },
];

function formatDate(value?: string | null) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function getInitial(user: UserRow) {
  return (user.name || user.email || "U").trim().charAt(0).toUpperCase();
}

function getMembershipLabel(user: UserRow) {
  if (user.subscriptionStatus === "lifetime") return "Lifetime Premium";
  if (user.subscriptionTier === "premium") return "Premium Member";
  return "Free Member";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const selectedUser = useMemo(() => {
    return users.find((user) => user.id === selectedUserId) || null;
  }, [users, selectedUserId]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.email.toLowerCase().includes(query) ||
        (user.name || "").toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.subscriptionTier.toLowerCase().includes(query) ||
        user.subscriptionStatus.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "all" ||
        user.role === activeFilter ||
        user.subscriptionTier === activeFilter ||
        user.subscriptionStatus === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [users, searchQuery, activeFilter]);

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateRole(userId: string, role: string) {
    try {
      setSavingUserId(userId);

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update role.");
      }

      setUsers((current) =>
        current.map((user) => (user.id === userId ? data : user))
      );
    } catch (error) {
      console.error("UPDATE ROLE ERROR:", error);
      alert(error instanceof Error ? error.message : "Failed to update role.");
    } finally {
      setSavingUserId(null);
    }
  }

  async function updatePremiumAction(userId: string, action: string) {
    try {
      setSavingUserId(userId);

      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update Premium.");
      }

      setUsers((current) =>
        current.map((user) => (user.id === userId ? data : user))
      );
    } catch (error) {
      console.error("UPDATE PREMIUM ERROR:", error);
      alert(error instanceof Error ? error.message : "Failed to update Premium.");
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-5xl font-black">Users</h1>
        <p className="mt-3 text-white/60">
          Manage SourceTV accounts, subscriptions, Stripe records, and roles.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, role, plan, or status..."
              className="w-full rounded-2xl border border-white/10 bg-black px-5 py-3 text-sm font-bold text-white outline-none placeholder:text-white/30 transition focus:border-sky-300/50 lg:max-w-xl"
            />

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                    activeFilter === filter.value
                      ? "border-sky-300/50 bg-sky-300/15 text-sky-100"
                      : "border-white/10 bg-black/30 text-white/50 hover:border-sky-300/30 hover:text-sky-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs font-bold text-white/35">
            Showing {filteredUsers.length} of {users.length} users.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-sm">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-6" colSpan={6}>
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td className="p-6" colSpan={6}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className="cursor-pointer border-t border-white/10 transition hover:bg-white/[0.05]"
                  >
                    <td className="p-4 font-bold">{user.name || "—"}</td>
                    <td className="p-4 text-white/65">{user.email}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        disabled={savingUserId === user.id}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="rounded-xl border border-white/10 bg-black px-3 py-2 text-sm font-bold capitalize text-white outline-none transition hover:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 capitalize">{user.subscriptionTier}</td>
                    <td className="p-4 capitalize">
                      {user.subscriptionStatus}
                    </td>
                    <td className="p-4">{formatDate(user.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-sm"
          onClick={() => setSelectedUserId(null)}
        >
          <aside
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#05070d] shadow-[0_0_90px_rgba(0,0,0,0.72)]"
          >
            <div className="sticky top-0 z-20 border-b border-white/10 bg-[#05070d]/92 px-6 py-5 backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
                  User Management
                </p>

                <button
                  onClick={() => setSelectedUserId(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl font-light text-white/60 transition hover:border-sky-300/35 hover:text-white"
                  aria-label="Close user drawer"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="px-6 pb-10 pt-8">
              <section className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-sky-300/25 via-white/[0.08] to-yellow-300/10 text-4xl font-black text-white shadow-[0_0_60px_rgba(56,189,248,0.18)]">
                  {getInitial(selectedUser)}
                </div>

                <h2 className="mt-5 text-4xl font-black tracking-tight">
                  {selectedUser.name || "Unnamed User"}
                </h2>

                <p className="mt-2 break-all text-sm font-semibold text-white/45">
                  {selectedUser.email}
                </p>

                <div className="mt-4 flex justify-center">
                  <MembershipBadge user={selectedUser} />
                </div>
              </section>

              <DrawerSection title="Account">
                <InfoLine label="Role" value={selectedUser.role} />
                <InfoLine label="Member Since" value={formatDate(selectedUser.createdAt)} />
              </DrawerSection>

              <DrawerSection title="Membership">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                        Current Plan
                      </p>

                      <p className="mt-2 text-2xl font-black capitalize">
                        {selectedUser.subscriptionTier === "premium"
                          ? "Premium"
                          : "Free"}
                      </p>
                    </div>

                    <StatusDot status={selectedUser.subscriptionStatus} />
                  </div>

                  <div className="mt-5 grid gap-3">
                    <InfoLine
                      label="Status"
                      value={selectedUser.subscriptionStatus}
                    />
                    <InfoLine
                      label="Renews / Ends"
                      value={formatDate(selectedUser.subscriptionEndsAt)}
                    />
                  </div>
                </div>
              </DrawerSection>

              <DrawerSection title="Premium Controls">
                <div className="grid gap-3">
                  <ActionButton
                    label="Grant Premium — 1 Year"
                    description="Comp this account with Premium access for one year."
                    disabled={savingUserId === selectedUser.id}
                    onClick={() =>
                      updatePremiumAction(selectedUser.id, "grant_premium")
                    }
                    tone="blue"
                  />

                  <ActionButton
                    label="Grant Lifetime Premium"
                    description="Give this account Premium access through 2099."
                    disabled={savingUserId === selectedUser.id}
                    onClick={() =>
                      updatePremiumAction(selectedUser.id, "lifetime_premium")
                    }
                    tone="gold"
                  />

                  <ActionButton
                    label="Remove Premium"
                    description="Return this account to the free plan."
                    disabled={savingUserId === selectedUser.id}
                    onClick={() =>
                      updatePremiumAction(selectedUser.id, "remove_premium")
                    }
                    tone="red"
                  />
                </div>
              </DrawerSection>

              <DrawerSection title="Security">
                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-sm font-black text-white/80">
                    Change Role
                  </p>

                  <select
                    value={selectedUser.role}
                    disabled={savingUserId === selectedUser.id}
                    onChange={(e) =>
                      updateRole(selectedUser.id, e.target.value)
                    }
                    className="mt-4 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm font-black capitalize text-white outline-none transition hover:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>

                  <div className="mt-4 grid gap-3">
                    <DisabledAction label="Reset Password" />
                    <DisabledAction label="Suspend Account" />
                  </div>
                </div>
              </DrawerSection>

              <DrawerSection title="Stripe">
                <div className="grid gap-3">
                  <CodeLine
                    label="Customer"
                    value={selectedUser.stripeCustomerId || "No customer ID"}
                  />
                  <CodeLine
                    label="Subscription"
                    value={
                      selectedUser.stripeSubscriptionId ||
                      "No subscription ID"
                    }
                  />

                  <button
                    type="button"
                    disabled={!selectedUser.stripeCustomerId}
                    className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm font-black text-white/55 transition hover:border-sky-300/35 hover:text-sky-100 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Open Stripe Customer →
                  </button>
                </div>
              </DrawerSection>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
          {title}
        </p>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {children}
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>
      <p className="break-all text-right text-sm font-black capitalize text-white/82">
        {value}
      </p>
    </div>
  );
}

function MembershipBadge({ user }: { user: UserRow }) {
  const isPremium = user.subscriptionTier === "premium";
  const isLifetime = user.subscriptionStatus === "lifetime";

  return (
    <span
      className={`inline-flex rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] ${
        isPremium
          ? "border-yellow-300/35 bg-yellow-300/12 text-yellow-100"
          : "border-white/10 bg-white/[0.04] text-white/45"
      }`}
    >
      {isPremium ? (isLifetime ? "♾ Lifetime Premium" : "👑 Premium Member") : "Free Member"}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const active = ["active", "trialing", "lifetime"].includes(status);

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
        active
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
          : status === "past_due"
            ? "border-red-300/30 bg-red-300/10 text-red-100"
            : "border-white/10 bg-white/[0.04] text-white/45"
      }`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  label,
  description,
  disabled,
  onClick,
  tone,
}: {
  label: string;
  description: string;
  disabled: boolean;
  onClick: () => void;
  tone: "blue" | "gold" | "red";
}) {
  const toneClass =
    tone === "blue"
      ? "border-sky-300/25 bg-sky-300/10 text-sky-100 hover:bg-sky-300/16"
      : tone === "gold"
        ? "border-yellow-300/25 bg-yellow-300/10 text-yellow-100 hover:bg-yellow-300/16"
        : "border-red-300/25 bg-red-300/10 text-red-100 hover:bg-red-300/16";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[1.45rem] border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${toneClass}`}
    >
      <p className="text-sm font-black">{label}</p>
      <p className="mt-1 text-xs leading-5 text-white/42">{description}</p>
    </button>
  );
}

function DisabledAction({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-left text-sm font-black text-white/28"
    >
      {label} <span className="text-white/18">— coming soon</span>
    </button>
  );
}

function CodeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.45rem] border border-white/10 bg-black/30 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>
      <p className="mt-2 break-all font-mono text-xs text-white/65">{value}</p>
    </div>
  );
}
