"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const iconClass = "h-6 w-6 stroke-[2.35]";

const links = [
  {
    label: "Home",
    href: "/browse",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={iconClass}
      >
        <path
          d="M4 10.7 12 4l8 6.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 10.5V20h11V10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Search",
    href: "/search",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={iconClass}
      >
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="M16.2 16.2 20 20" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "List",
    href: "/watchlist",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={iconClass}
      >
        <path
          d="M7 4.5h10v15L12 16.4l-5 3.1v-15z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/profiles",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <circle
          cx="12"
          cy="12"
          r="8.2"
          stroke="currentColor"
          strokeWidth="2.35"
        />
        <circle cx="12" cy="12" r="3.2" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
<nav className="fixed bottom-0 left-0 right-0 z-[200] overflow-hidden border-t border-white/10 bg-[rgba(10,10,10,0.62)] px-2 pb-safe text-white shadow-[0_-10px_45px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:hidden">
      <div className="pointer-events-none absolute left-0 top-0 h-[1.5px] w-full bg-gradient-to-r from-transparent via-sky-200/40 to-transparent shadow-[0_0_24px_rgba(56,189,248,0.5)]" />

      <div className="grid grid-cols-4">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`group relative flex flex-col items-center justify-center gap-1.5 py-3 text-[11px] font-black transition-all duration-300 active:scale-95 ${
                active ? "text-white" : "text-white/42"
              }`}
            >
              <span
                className={`pointer-events-none absolute -top-[1px] h-[2px] rounded-full bg-sky-200 blur-[1px] transition-all duration-500 ${
                  active ? "w-16 opacity-100" : "w-0 opacity-0"
                }`}
              />

              <span
                className={`pointer-events-none absolute top-0 h-10 rounded-full bg-sky-300/35 blur-2xl transition-all duration-500 ${
                  active ? "w-24 opacity-100" : "w-0 opacity-0"
                }`}
              />

              <span
                className={`relative flex h-8 w-8 items-center justify-center transition-all duration-300 ${
                  active
                    ? "-translate-y-1 scale-110 text-sky-100 drop-shadow-[0_0_14px_rgba(56,189,248,0.85)]"
                    : "text-white/42 group-hover:-translate-y-0.5 group-hover:text-white/75"
                }`}
              >
                {link.icon}
              </span>

              <span
                className={`transition-all duration-300 ${
                  active
                    ? "text-white"
                    : "text-white/42 group-hover:text-white/75"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}