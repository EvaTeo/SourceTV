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
      { href: "/admin/editorial", label: "Editorial", icon: "editorial" },
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

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("sourcetvUser");
    window.location.href = "/login";
  }

  return (
    <aside className="fixed left-0 top-0 z-[9999] flex h-screen w-[270px] flex-col border-r border-white/[0.08] bg-[#05070d]">
      <div className="px-7 pb-7 pt-8">
        <Link href="/admin" className="inline-block">
          <h1 className="text-[1.65rem] font-black leading-none tracking-[-0.04em] text-white">
            Source<span className="text-sky-300">TV</span>
          </h1>

          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Admin Studio
          </p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-5">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-2 px-4 text-[9px] font-black uppercase tracking-[0.28em] text-white/25">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                      active
                        ? "bg-white/[0.065] text-white"
                        : "text-white/45 hover:bg-white/[0.035] hover:text-white/85"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full ${
                        active ? "bg-sky-300" : "bg-transparent"
                      }`}
                    />

                    <SourceIcon name={item.icon} active={active} />

                    <span className="text-sm font-bold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.08] px-4 pb-5 pt-4">
        <div className="space-y-1">
          <SidebarAction
            href="/browse"
            icon="external"
            label="View SourceTV"
          />

          <SidebarAction
            href="/admin/settings"
            icon="settings"
            label="Platform Settings"
          />

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/45 transition hover:bg-red-500/[0.08] hover:text-red-300"
          >
            <SourceIcon name="logout" active={false} />
            Log Out
          </button>
        </div>

        <p className="mt-5 px-4 text-[10px] font-semibold text-white/20">
          SourceTV Admin Studio
        </p>
      </div>
    </aside>
  );
}

function SidebarAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/45 transition hover:bg-white/[0.035] hover:text-white"
    >
      <SourceIcon name={icon} active={false} />
      {label}
    </Link>
  );
}

function SourceIcon({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center transition ${
        active ? "text-sky-300" : "text-white/40"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        {name === "overview" && (
          <>
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="10" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="18" width="6" height="2" rx="1" />
          </>
        )}

        {name === "analytics" && (
          <>
            <path d="M5 19V5" />
            <path d="M5 19h14" />
            <path d="M9 15v-4" />
            <path d="M13 15V8" />
            <path d="M17 15v-7" />
          </>
        )}

        {name === "revenue" && (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M15.5 8.5c-.7-.9-1.8-1.4-3.2-1.4h-.7a2.3 2.3 0 0 0 0 4.6h1a2.3 2.3 0 0 1 0 4.6h-.8c-1.4 0-2.5-.5-3.3-1.4" />
            <path d="M12 5.5v13" />
          </>
        )}

        {name === "content" && (
          <>
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="m10 9 5 3-5 3z" />
          </>
        )}

        {name === "editorial" && (
          <>
            <rect x="4" y="5" width="16" height="4" rx="1" />
            <rect x="4" y="12" width="10" height="7" rx="1" />
            <rect x="17" y="12" width="3" height="7" rx="1" />
          </>
        )}

        {name === "review" && (
          <>
            <rect x="5" y="4" width="14" height="16" rx="2" />
            <path d="m8 12 2.5 2.5L16 9" />
          </>
        )}

        {name === "upload" && (
          <>
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M5 20h14" />
          </>
        )}

        {name === "applications" && (
          <>
            <rect x="7" y="4" width="10" height="16" rx="2" />
            <path d="M9.5 8h5" />
            <path d="M9.5 12h5" />
            <path d="M9.5 16h3" />
          </>
        )}

        {name === "contracts" && (
          <>
            <path d="M6 3h8l4 4v14H6z" />
            <path d="M14 3v5h5" />
            <path d="M9 13h6" />
            <path d="M9 17h4" />
          </>
        )}

        {name === "messages" && (
          <>
            <path d="M4 5h16v11H8l-4 4z" />
            <path d="M8 9h8" />
            <path d="M8 12h5" />
          </>
        )}

        {name === "users" && (
          <>
            <circle cx="9" cy="8" r="3" />
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
            <rect x="5" y="7" width="14" height="10" rx="2" />
            <path d="M8 11h3" />
            <path d="M15 11h1" />
            <path d="M8 15h8" />
          </>
        )}

        {name === "settings" && (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.6V21h-4v-.1A1.8 1.8 0 0 0 8.8 19a1.8 1.8 0 0 0-2 .4l-.1.1-2.8-2.8.1-.1a1.8 1.8 0 0 0 .4-2A1.8 1.8 0 0 0 2.8 13H2v-4h.8a1.8 1.8 0 0 0 1.6-1.1 1.8 1.8 0 0 0-.4-2l-.1-.1L6.7 3l.1.1a1.8 1.8 0 0 0 2 .4A1.8 1.8 0 0 0 9.9 2H14v.1a1.8 1.8 0 0 0 1.1 1.6 1.8 1.8 0 0 0 2-.4l.1-.1L20 6l-.1.1a1.8 1.8 0 0 0-.4 2A1.8 1.8 0 0 0 21.1 9h.9v4h-.9a1.8 1.8 0 0 0-1.7 2z" />
          </>
        )}

        {name === "external" && (
          <>
            <path d="M14 5h5v5" />
            <path d="m19 5-8 8" />
            <path d="M17 13v6H5V7h6" />
          </>
        )}

        {name === "logout" && (
          <>
            <path d="M10 5H5v14h5" />
            <path d="m15 8 4 4-4 4" />
            <path d="M19 12H9" />
          </>
        )}
      </svg>
    </span>
  );
}