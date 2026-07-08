"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import EmptyState from "@/app/components/admin/EmptyState";
import MetricCard from "@/app/components/admin/MetricCard";
import SearchInput from "@/app/components/admin/SearchInput";
import StatusBadge from "@/app/components/admin/StatusBadge";
import Toolbar from "@/app/components/admin/Toolbar";

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

  const stats = useMemo(() => {
    return [
      { label: "Total Users", value: users.length },
      {
        label: "Premium",
        value: users.filter((user) => user.subscriptionTier === "premium").length,
      },
      {
        label: "Partners",
        value: users.filter((user) => user.role === "partner").length,
      },
      {
        label: "Admins",
        value: users.filter((user) => user.role === "admin").length,
      },
    ];
  }, [users]);

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
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Studio"
        title="Users"
        description="Manage SourceTV accounts, roles, Premium access, subscription status, and Stripe records."
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <Toolbar>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search name, email, role, plan, or status..."
        />

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`h-11 rounded-xl px-3 text-sm font-medium transition ${
                activeFilter === filter.value
                  ? "bg-sky-300 text-[#05070d]"
                  : "border border-white/10 bg-white/[0.035] text-white/55 hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </Toolbar>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">Accounts</h2>
            <p className="mt-1 text-sm text-white/40">
              Showing {filteredUsers.length} of {users.length} users.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-white/[0.025]">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  User
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Role
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Plan
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-5 py-8" colSpan={5}>
                    <EmptyState title="Loading users..." />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td className="px-5 py-8" colSpan={5}>
                    <EmptyState
                      title="No users found."
                      description="Try changing the search or selected filter."
                    />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUserId(user.id)}
                    className="cursor-pointer transition hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-sky-300">
                          {getInitial(user)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="mt-1 truncate text-xs text-white/40">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={savingUserId === user.id}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="rounded-xl border border-white/10 bg-[#05070d] px-3 py-2 text-sm font-medium capitalize text-white outline-none transition hover:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm capitalize text-white/60">
                        {user.subscriptionTier}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={user.subscriptionStatus || "inactive"} />
                    </td>

                    <td className="px-5 py-4 text-sm text-white/45">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          saving={savingUserId === selectedUser.id}
          onClose={() => setSelectedUserId(null)}
          updateRole={updateRole}
          updatePremiumAction={updatePremiumAction}
        />
      )}
    </main>
  );
}

function UserDrawer({
  user,
  saving,
  onClose,
  updateRole,
  updatePremiumAction,
}: {
  user: UserRow;
  saving: boolean;
  onClose: () => void;
  updateRole: (userId: string, role: string) => Promise<void>;
  updatePremiumAction: (userId: string, action: string) => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-sm" onClick={onClose}>
      <aside
        onClick={(event) => event.stopPropagation()}
        className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#05070d] shadow-[0_0_90px_rgba(0,0,0,0.72)]"
      >
        <div className="sticky top-0 z-20 border-b border-white/10 bg-[#05070d]/95 px-6 py-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
              User Management
            </p>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-white/60 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
              aria-label="Close user drawer"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 pb-10 pt-7">
          <section>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl font-semibold text-sky-300">
                {getInitial(user)}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-2xl font-semibold tracking-tight text-white">
                  {user.name || "Unnamed User"}
                </h2>
                <p className="mt-1 break-all text-sm text-white/45">{user.email}</p>
              </div>
            </div>
          </section>

          <DrawerSection title="Account">
            <InfoLine label="Role" value={user.role} />
            <InfoLine label="Member Since" value={formatDate(user.createdAt)} />
          </DrawerSection>

          <DrawerSection title="Membership">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                    Current Plan
                  </p>

                  <p className="mt-2 text-2xl font-semibold capitalize text-white">
                    {user.subscriptionTier === "premium" ? "Premium" : "Free"}
                  </p>
                </div>

                <StatusBadge status={user.subscriptionStatus || "inactive"} />
              </div>

              <div className="mt-5 grid gap-3">
                <InfoLine label="Status" value={user.subscriptionStatus} />
                <InfoLine label="Renews / Ends" value={formatDate(user.subscriptionEndsAt)} />
              </div>
            </div>
          </DrawerSection>

          <DrawerSection title="Premium Controls">
            <div className="grid gap-3">
              <DrawerAction
                label="Grant Premium — 1 Year"
                description="Comp this account with Premium access for one year."
                disabled={saving}
                onClick={() => updatePremiumAction(user.id, "grant_premium")}
              />

              <DrawerAction
                label="Grant Lifetime Premium"
                description="Give this account Premium access through 2099."
                disabled={saving}
                onClick={() => updatePremiumAction(user.id, "lifetime_premium")}
              />

              <DrawerAction
                label="Remove Premium"
                description="Return this account to the free plan."
                disabled={saving}
                destructive
                onClick={() => updatePremiumAction(user.id, "remove_premium")}
              />
            </div>
          </DrawerSection>

          <DrawerSection title="Security">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm font-semibold text-white">Change Role</p>

              <select
                value={user.role}
                disabled={saving}
                onChange={(e) => updateRole(user.id, e.target.value)}
                className="mt-4 w-full rounded-xl border border-white/10 bg-[#05070d] px-4 py-3 text-sm font-medium capitalize text-white outline-none transition hover:border-sky-300/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </DrawerSection>

          <DrawerSection title="Stripe">
            <div className="grid gap-3">
              <CodeLine label="Customer" value={user.stripeCustomerId || "No customer ID"} />
              <CodeLine
                label="Subscription"
                value={user.stripeSubscriptionId || "No subscription ID"}
              />
            </div>
          </DrawerSection>
        </div>
      </aside>
    </div>
  );
}

function DrawerSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
        {title}
      </p>
      {children}
    </section>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="break-all text-right text-sm font-medium capitalize text-white/70">
        {value}
      </p>
    </div>
  );
}

function DrawerAction({
  label,
  description,
  disabled,
  destructive,
  onClick,
}: {
  label: string;
  description: string;
  disabled: boolean;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-45 ${
        destructive
          ? "border-red-300/25 bg-red-300/10 text-red-300 hover:border-red-300/45"
          : "border-sky-300/25 bg-sky-300/10 text-sky-300 hover:border-sky-300/45"
      }`}
    >
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs leading-5 text-white/42">{description}</p>
    </button>
  );
}

function CodeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="mt-2 break-all font-mono text-xs text-white/60">{value}</p>
    </div>
  );
}