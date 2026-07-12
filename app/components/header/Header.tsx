"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useState,
} from "react";
import LogoutButton from "../LogoutButton";
import HeaderLink from "./HeaderLink";
import MobileMenu from "./MobileMenu";
import ViewerActions from "./ViewerActions";
import ViewerNav from "./ViewerNav";
import { partnerLinks } from "./headerLinks";

export default function Header() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [isPremium, setIsPremium] =
    useState(false);

  const isLanding = pathname === "/";

  const isAdmin =
    pathname.startsWith("/admin");

  const isPartner =
    pathname.startsWith("/partner") ||
    pathname.startsWith("/creator");

  const isViewer =
    pathname.startsWith("/browse") ||
    pathname.startsWith("/watch") ||
    pathname.startsWith("/watchlist") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/profiles") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/films") ||
    pathname.startsWith("/shows") ||
    pathname.startsWith("/animation") ||
    pathname.startsWith("/documentaries") ||
    pathname.startsWith("/genres");

  const logoHref = isLanding
    ? "/"
    : "/browse";

  function isPartnerLinkActive(
    href: string
  ) {
    if (href === "/partner") {
      return pathname === "/partner";
    }

    return pathname.startsWith(href);
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    async function loadSubscription() {
      try {
        const res = await fetch(
          "/api/stripe/subscription",
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          setIsPremium(false);
          return;
        }

        const data = await res.json();

        setIsPremium(
          data?.isPremium === true
        );
      } catch {
        setIsPremium(false);
      }
    }

    if (isViewer) {
      loadSubscription();
    }
  }, [isViewer]);

  if (isAdmin) {
    return null;
  }

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
            Source
            <span className="text-sky-400">
              TV
            </span>
          </Link>

          {isViewer && <ViewerNav />}

          {isPartner && !isViewer && (
            <nav className="hidden items-center gap-5 md:flex">
              {partnerLinks.map((link) => (
                <HeaderLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={isPartnerLinkActive(
                    link.href
                  )}
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

            </>
          )}

          {isViewer && (
            <ViewerActions
              isPremium={isPremium}
            />
          )}

          {isPartner && !isViewer && (
            <LogoutButton />
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(
              (value) => !value
            )
          }
          className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] text-white backdrop-blur-xl transition hover:border-sky-300/40 md:hidden"
          aria-label="Open mobile menu"
          aria-expanded={mobileOpen}
        >
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-70" />

          <span
            className={`relative transition-all duration-300 ${
              mobileOpen
                ? "rotate-90 scale-110"
                : ""
            }`}
          >
            {mobileOpen ? "×" : "⋯"}
          </span>
        </button>
      </div>

      <MobileMenu
        open={mobileOpen}
        isLanding={isLanding}
        isViewer={isViewer}
        isPartner={isPartner}
        isPremium={isPremium}
        close={() => setMobileOpen(false)}
      />
    </header>
  );
}