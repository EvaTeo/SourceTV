"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const iconClass = "h-5 w-5 stroke-[2.25]";

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
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <circle
          cx="12"
          cy="12"
          r="8.2"
          stroke="currentColor"
          strokeWidth="2.25"
        />
        <circle cx="12" cy="12" r="3.2" fill="currentColor" opacity="0.35" />
      </svg>
    ),
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[200] overflow-hidden border-t border-white/10 bg-black/88 px-2 pb-safe text-white shadow-[0_-14px_44px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:hidden">
      <div className="grid grid-cols-4">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`group relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-bold transition-all duration-300 active:scale-95 ${
                active ? "text-white" : "text-white/42"
              }`}
            >
              <span
                className={`relative flex h-7 w-7 items-center justify-center transition-all duration-300 ${
                  active
                    ? "-translate-y-0.5 text-white"
                    : "text-white/42 group-hover:text-white/75"
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

              <span
                className={`pointer-events-none absolute top-0 h-[2px] rounded-full bg-white transition-all duration-300 ${
                  active ? "w-8 opacity-100" : "w-0 opacity-0"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}