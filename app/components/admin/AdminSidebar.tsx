"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Platform",
    items: [
      { href: "/admin", label: "Overview", icon: "overview" },
      { href: "/admin/analytics", label: "Analytics", icon: "analytics" },
      { href: "/admin/revenue", label: "Revenue", icon: "revenue" },
    ],
  },
  
  {
  title: "Content",
  items: [
    { href: "/admin/content", label: "Library", icon: "content" },
    {
      href: "/admin/editorial",
      label: "Editorial",
      icon: "editorial",
    },
    { href: "/admin/review", label: "Review Queue", icon: "review" },
    { href: "/admin/upload", label: "Upload", icon: "upload" },
  ],
},
  {
    title: "Partners",
    items: [
      { href: "/admin/partners", label: "Applications", icon: "applications" },
      { href: "/admin/contracts", label: "Contracts", icon: "contracts" },
      { href: "/admin/inbox", label: "Messages", icon: "messages" },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/admin/users", label: "Users", icon: "users" },
      { href: "/admin/ads", label: "Advertising", icon: "ads" },
      {
        href: "/admin/subscriptions",
        label: "Subscriptions",
        icon: "subscriptions",
      },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    localStorage.removeItem("sourcetvUser");
    window.location.href = "/login";
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="fixed left-0 top-0 z-[9999] flex h-screen w-[270px] flex-col border-r border-white/10 bg-[#05070d]">
      <div className="relative px-7 pb-6 pt-7">
        <Link href="/admin" className="group inline-flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition group-hover:border-sky-300/35 group-hover:bg-white/[0.06]">
            <div className="h-5 w-5 rounded-md border-2 border-sky-300" />
          </div>

          <div>
            <h1 className="text-2xl font-black leading-none tracking-tight text-white">
              Source<span className="text-sky-300">TV</span>
            </h1>
            <p className="mt-1 text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
              Admin Studio
            </p>
          </div>
        </Link>
      </div>

      <nav className="relative flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-1.5 px-4 text-[10px] font-black uppercase tracking-[0.26em] text-white/25">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-4 py-2.5 transition ${
                      active
                        ? "bg-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                        : "text-white/46 hover:bg-white/[0.035] hover:text-white/85"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full transition ${
                        active
                          ? "bg-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.65)]"
                          : "bg-transparent"
                      }`}
                    />

                    <span className="relative">
                      <SourceIcon name={item.icon} active={active} />
                    </span>

                    <span className="relative text-sm font-black">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
            System Status
          </p>

          <div className="mt-4 space-y-3">
            <StatusRow label="Bunny Stream" />
            <StatusRow label="Stripe" />
            <StatusRow label="Database" />
            <StatusRow label="Email Service" />
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-semibold text-white/55 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
        >
          <SourceIcon name="logout" active={false} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function StatusRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-sm text-white/75">{label}</span>
      </div>

      <span className="text-xs text-emerald-400">Healthy</span>
    </div>
  );
}

function SourceIcon({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  const color = active ? "text-sky-300" : "text-white/42";

  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center ${color}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        {name === "overview" && (
          <>
            <path d="M4 5.5h7v6H4z" />
            <path d="M13 5.5h7v13h-7z" />
            <path d="M4 13.5h7v5H4z" />
          </>
        )}

        {name === "analytics" && (
          <>
            <path d="M4 19V5" />
            <path d="M4 19h16" />
            <path d="M8 15v-4" />
            <path d="M12 15V8" />
            <path d="M16 15v-7" />
          </>
        )}

        {name === "revenue" && (
          <>
            <path d="M12 3v18" />
            <path d="M17 7.5c-.8-1.2-2.3-2-4.3-2H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-2.7c-2 0-3.5-.8-4.3-2" />
          </>
        )}

        {name === "content" && (
          <>
            <path d="M5 5h14v14H5z" />
            <path d="m10 9 5 3-5 3z" />
          </>
        )}

        {name === "editorial" && (
  <>
    <path d="M4 5.5h16v4H4z" />
    <path d="M4 12h10v6.5H4z" />
    <path d="M16.5 12H20v6.5h-3.5z" />
    <path d="M7 7.5h6" />
  </>
)}

        {name === "review" && (
          <>
            <path d="M5 4h14v16H5z" />
            <path d="m8 12 2.5 2.5L16 9" />
          </>
        )}

        {name === "upload" && (
          <>
            <path d="M12 17V5" />
            <path d="m7 10 5-5 5 5" />
            <path d="M5 19h14" />
          </>
        )}

        {name === "applications" && (
          <>
            <path d="M7 4h10v16H7z" />
            <path d="M9.5 8h5" />
            <path d="M9.5 12h5" />
            <path d="M9.5 16h3" />
          </>
        )}

        {name === "contracts" && (
          <>
            <path d="M6 3h9l3 3v15H6z" />
            <path d="M15 3v4h4" />
            <path d="M9 13h6" />
            <path d="M9 17h4" />
          </>
        )}

        {name === "messages" && (
          <>
            <path d="M5 6h14v10H8l-3 3z" />
            <path d="M9 10h6" />
            <path d="M9 13h4" />
          </>
        )}

        {name === "users" && (
          <>
            <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M3.8 19c.7-3.1 2.5-5 5.2-5s4.5 1.9 5.2 5" />
            <path d="M16.5 11.5a2.5 2.5 0 1 0 0-5" />
            <path d="M15.5 14.2c2 .4 3.3 2 3.8 4.8" />
          </>
        )}

        {name === "ads" && (
          <>
            <path d="M4 8h4l7-3v14l-7-3H4z" />
            <path d="M18 9.5c1 .7 1.5 1.5 1.5 2.5s-.5 1.8-1.5 2.5" />
          </>
        )}

        {name === "subscriptions" && (
          <>
            <path d="M5 7h14v10H5z" />
            <path d="M8 11h3" />
            <path d="M15 11h1" />
            <path d="M8 15h8" />
          </>
        )}

        {name === "settings" && (
          <>
            <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            <path d="M4 12h2" />
            <path d="M18 12h2" />
            <path d="M12 4v2" />
            <path d="M12 18v2" />
            <path d="m6.6 6.6 1.4 1.4" />
            <path d="m16 16 1.4 1.4" />
            <path d="m17.4 6.6-1.4 1.4" />
            <path d="m8 16-1.4 1.4" />
          </>
        )}

        {name === "storage" && (
          <>
            <path d="M5 6c0-1.7 3.1-3 7-3s7 1.3 7 3-3.1 3-7 3-7-1.3-7-3z" />
            <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
            <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
          </>
        )}

        {name === "logout" && (
          <>
            <path d="M10 6H6v12h4" />
            <path d="M14 8l4 4-4 4" />
            <path d="M18 12H9" />
          </>
        )}
      </svg>
    </span>
  );
}