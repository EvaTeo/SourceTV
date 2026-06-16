"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const adminLinks = [
  { label: "Admin Home", href: "/admin" },
  { label: "Content", href: "/admin/content" },
  { label: "Applications", href: "/admin/partners" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Revenue", href: "/admin/revenue" },
];

const partnerLinks = [
  { label: "Dashboard", href: "/partner" },
  { label: "Inbox", href: "/partner/inbox" },
  { label: "Submit", href: "/creator/submit" },
];

export default function Header() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  const isLanding = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");
  const isPartner =
    pathname.startsWith("/partner") || pathname.startsWith("/creator");
  const isViewer =
    pathname.startsWith("/browse") ||
    pathname.startsWith("/watch") ||
    pathname.startsWith("/watchlist") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/profiles");

  const logoHref = isLanding ? "/" : "/browse";

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/browse") return pathname === "/browse";
    return pathname.startsWith(href);
  }

  function runSearch() {
    const cleanQuery = searchQuery.trim();

    if (!cleanQuery) {
      setSearchOpen(true);
      return;
    }

    window.location.href = `/search?q=${encodeURIComponent(cleanQuery)}`;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }

      if (categoriesRef.current && !categoriesRef.current.contains(target)) {
        setCategoriesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 w-full">
      <div
        className={`absolute inset-0 ${
          isViewer
            ? "bg-gradient-to-b from-black/78 via-black/30 to-transparent backdrop-blur-[1.5px]"
            : "border-b border-white/10 bg-black/92 backdrop-blur-xl"
        }`}
      />

      <div className="relative flex w-full items-center justify-between px-4 py-4 text-white md:px-10">
        <div className="flex min-w-0 items-center gap-7">
          <Link
            href={logoHref}
            className="shrink-0 text-[1.55rem] font-black tracking-tight text-white"
          >
            Source<span className="text-sky-400">TV</span>
          </Link>

          {isViewer && (
            <nav className="hidden items-center gap-5 md:flex">
              <HeaderLink
                href="/browse"
                label="Home"
                active={pathname === "/browse"}
              />

              <HeaderLink
                href="/browse?type=Film"
                label="Films"
                active={false}
              />

              <HeaderLink
                href="/browse?type=Series"
                label="Shows"
                active={false}
              />

              <HeaderLink
                href="/browse?type=Animation"
                label="Animation"
                active={false}
              />

              <div ref={categoriesRef} className="relative">
                <button
                  onClick={() => setCategoriesOpen((value) => !value)}
                  className={`text-sm font-semibold transition ${
                    categoriesOpen ? "text-sky-300" : "text-white/68 hover:text-white"
                  }`}
                >
                  Categories
                </button>

                {categoriesOpen && (
                  <div className="absolute left-0 top-full mt-5 w-[380px] overflow-hidden rounded-2xl border border-white/10 bg-black/92 p-3 shadow-[0_28px_80px_rgba(0,0,0,0.72)] backdrop-blur-2xl">
                    <nav className="grid grid-cols-2 gap-1">
                      <div className="col-span-2 px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                        Popular Genres
                      </div>

                      {[
                        { label: "Drama", href: "/browse?genre=Drama" },
                        { label: "Comedy", href: "/browse?genre=Comedy" },
                        { label: "Action", href: "/browse?genre=Action" },
                        { label: "Horror", href: "/browse?genre=Horror" },
                      ].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setCategoriesOpen(false)}
                          className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          {link.label}
                        </Link>
                      ))}

                      <div className="col-span-2 mt-2 px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                        More Genres
                      </div>

                      {[
                        {
                          label: "Documentary",
                          href: "/browse?genre=Documentary",
                        },
                        { label: "Sci-Fi", href: "/browse?genre=Sci-Fi" },
                        { label: "Romance", href: "/browse?genre=Romance" },
                        { label: "Thriller", href: "/browse?genre=Thriller" },
                        { label: "Reality", href: "/browse?genre=Reality" },
                        {
                          label: "Game Shows",
                          href: "/browse?genre=Game%20Show",
                        },
                      ].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setCategoriesOpen(false)}
                          className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                )}
              </div>
            </nav>
          )}

          {isAdmin && (
            <nav className="hidden items-center gap-5 md:flex">
              {adminLinks.map((link) => (
                <HeaderLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isActive(link.href)}
                />
              ))}
            </nav>
          )}

          {isPartner && !isAdmin && (
            <nav className="hidden items-center gap-5 md:flex">
              {partnerLinks.map((link) => (
                <HeaderLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isActive(link.href)}
                />
              ))}
            </nav>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isLanding && (
            <>
              <Link
                href="/browse"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-black shadow-[0_0_28px_rgba(255,255,255,0.18)] transition hover:bg-sky-200 hover:shadow-[0_0_34px_rgba(125,211,252,0.28)]"
              >
                Watch Free
              </Link>

              <Link
                href="/login"
                className="rounded-full border border-white/20 bg-black/45 px-5 py-2.5 text-sm font-black text-white shadow-[0_0_24px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-white/40 hover:bg-white/10"
              >
                Login
              </Link>

              <Link
                href="/partner/apply"
                className="rounded-full border border-sky-300/45 bg-sky-400/18 px-5 py-2.5 text-sm font-black text-sky-100 shadow-[0_0_28px_rgba(56,189,248,0.25)] backdrop-blur-xl transition hover:border-sky-200 hover:bg-sky-400/28 hover:text-white"
              >
                Become a Partner
              </Link>
            </>
          )}

          {isViewer && (
            <>
              <div
                ref={searchRef}
                className={`flex items-center overflow-hidden rounded-full border border-white/10 bg-black/42 backdrop-blur-2xl transition-all duration-300 ${
                  searchOpen ? "w-72 px-4" : "w-11 px-0"
                }`}
              >
                <button
                  onClick={() => {
                    if (!searchOpen) {
                      setSearchOpen(true);
                      return;
                    }

                    runSearch();
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center text-white/80 transition hover:text-white"
                  aria-label="Search"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5 stroke-[2.4]"
                  >
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4 4" strokeLinecap="round" />
                  </svg>
                </button>

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runSearch();

                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  placeholder="Search SourceTV..."
                  className={`w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/35 transition ${
                    searchOpen ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                />
              </div>

              <Link
                href="/watchlist"
                className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-bold text-white/70 backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
              >
                My List
              </Link>

              <Link
                href="/profiles"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/35 backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.08]"
                aria-label="Profiles"
              >
                <div className="h-5 w-5 rounded-full bg-white/70" />
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((value) => !value)}
          className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] text-white backdrop-blur-xl transition hover:border-sky-300/40 md:hidden"
          aria-label="Open mobile menu"
        >
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-70" />

          <span
            className={`relative transition-all duration-300 ${
              mobileOpen ? "rotate-90 scale-110" : ""
            }`}
          >
            {mobileOpen ? "×" : "⋯"}
          </span>
        </button>
      </div>

      {mobileOpen && (
        <div className="relative z-50 mx-4 mt-2 overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(10,10,10,0.78)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:hidden">
          <nav className="grid gap-2">
            {isLanding &&
              [
                { label: "Watch Free", href: "/browse" },
                { label: "Login", href: "/login" },
                { label: "Become a Partner", href: "/partner/apply" },
              ].map((link) => (
                <MobileLink
                  key={link.href}
                  link={link}
                  close={() => setMobileOpen(false)}
                />
              ))}

            {isViewer &&
              [
                { label: "Home", href: "/browse" },
                { label: "Films", href: "/browse?type=Film" },
                { label: "Shows", href: "/browse?type=Series" },
                { label: "Animation", href: "/browse?type=Animation" },
                { label: "Drama", href: "/browse?genre=Drama" },
                { label: "Comedy", href: "/browse?genre=Comedy" },
                { label: "Action", href: "/browse?genre=Action" },
                { label: "Horror", href: "/browse?genre=Horror" },
                { label: "Search", href: "/search" },
                { label: "My List", href: "/watchlist" },
                { label: "Profiles", href: "/profiles" },
                { label: "Partner Program", href: "/partner/apply" },
              ].map((link) => (
                <MobileLink
                  key={link.href}
                  link={link}
                  close={() => setMobileOpen(false)}
                />
              ))}

            {isAdmin &&
              adminLinks.map((link) => (
                <MobileLink
                  key={link.href}
                  link={link}
                  close={() => setMobileOpen(false)}
                />
              ))}

            {isPartner &&
              !isAdmin &&
              partnerLinks.map((link) => (
                <MobileLink
                  key={link.href}
                  link={link}
                  close={() => setMobileOpen(false)}
                />
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function HeaderLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "text-sm font-black text-sky-300"
          : "text-sm font-semibold text-white/68 transition hover:text-white"
      }
    >
      {label}
    </Link>
  );
}

function MobileLink({
  link,
  close,
}: {
  link: { label: string; href: string };
  close: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={close}
      className="rounded-2xl border border-transparent bg-white/[0.03] px-4 py-3 font-bold text-white/75 transition hover:border-sky-300/20 hover:bg-white/[0.07] hover:text-white active:scale-[0.98]"
    >
      {link.label}
    </Link>
  );
}