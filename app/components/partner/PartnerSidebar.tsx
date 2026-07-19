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
    title: "Workspace",
    items: [
      {
        href: "/partner",
        label: "Overview",
        icon: "overview",
      },
      {
        href: "/partner/projects",
        label: "Projects",
        icon: "projects",
      },
      {
        href: "/partner/submit",
        label: "Submit New Work",
        icon: "upload",
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        href: "/partner/contracts",
        label: "Contracts",
        icon: "contracts",
      },
      {
        href: "/partner/revenue",
        label: "Revenue",
        icon: "revenue",
      },
      {
        href: "/partner/inbox",
        label: "Messages",
        icon: "messages",
      },
    ],
  },
];

export default function PartnerSidebar() {
  const pathname = usePathname();

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      localStorage.removeItem("sourcetvUser");
      window.location.href = "/login";
    }
  }

  function isActive(href: string) {
    if (href === "/partner") {
      return pathname === "/partner";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-white/[0.08] bg-[#05070d]">
      <div className="px-7 pb-7 pt-8">
        <Link
          href="/partner"
          className="inline-block"
        >
          <h1 className="text-[1.65rem] font-black leading-none tracking-[-0.04em] text-white">
            Source
            <span className="text-sky-300">
              TV
            </span>
          </h1>

          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            Partner Portal
          </p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-5">
        {navGroups.map((group) => (
          <div
            key={group.title}
            className="mb-6"
          >
            <p className="mb-2 px-4 text-[9px] font-black uppercase tracking-[0.28em] text-white/22">
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
                        : "text-white/42 hover:bg-white/[0.035] hover:text-white/85"
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full transition ${
                        active
                          ? "bg-sky-300"
                          : "bg-transparent"
                      }`}
                    />

                    <PartnerIcon
                      name={item.icon}
                      active={active}
                    />

                    <span className="text-sm font-bold">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.08] px-4 pb-5 pt-4">
        <div className="space-y-1">
          <Link
            href="/browse"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/42 transition hover:bg-white/[0.035] hover:text-white"
          >
            <PartnerIcon
              name="external"
              active={false}
            />

            View SourceTV
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/42 transition hover:bg-red-500/[0.08] hover:text-red-300"
          >
            <PartnerIcon
              name="logout"
              active={false}
            />

            Log Out
          </button>
        </div>

        <p className="mt-5 px-4 text-[10px] font-semibold text-white/18">
          SourceTV Partner Portal
        </p>
      </div>
    </aside>
  );
}

function PartnerIcon({
  name,
  active,
}: {
  name: string;
  active: boolean;
}) {
  const color = active
    ? "text-sky-300"
    : "text-white/38";

  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center transition ${color}`}
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
            <rect
              x="4"
              y="4"
              width="6"
              height="6"
              rx="1"
            />
            <rect
              x="14"
              y="4"
              width="6"
              height="10"
              rx="1"
            />
            <rect
              x="4"
              y="14"
              width="6"
              height="6"
              rx="1"
            />
            <rect
              x="14"
              y="18"
              width="6"
              height="2"
              rx="1"
            />
          </>
        )}

        {name === "projects" && (
          <>
            <rect
              x="4"
              y="5"
              width="16"
              height="14"
              rx="2"
            />
            <path d="m10 9 5 3-5 3z" />
          </>
        )}

        {name === "upload" && (
          <>
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M5 20h14" />
          </>
        )}

        {name === "revenue" && (
          <>
            <circle
              cx="12"
              cy="12"
              r="9"
            />
            <path d="M15.5 8.5c-.7-.9-1.8-1.4-3.2-1.4h-.7a2.3 2.3 0 0 0 0 4.6h1a2.3 2.3 0 0 1 0 4.6h-.8c-1.4 0-2.5-.5-3.3-1.4" />
            <path d="M12 5.5v13" />
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