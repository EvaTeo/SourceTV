"use client";

import Link from "next/link";
import LogoutButton from "../LogoutButton";
import {
  landingMobileLinks,
  partnerLinks,
  viewerMobileLinks,
  type HeaderNavLink,
} from "./headerLinks";

function MobileLink({
  link,
  close,
}: {
  link: HeaderNavLink;
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

export default function MobileMenu({
  open,
  isLanding,
  isViewer,
  isPartner,
  isPremium,
  close,
}: {
  open: boolean;
  isLanding: boolean;
  isViewer: boolean;
  isPartner: boolean;
  isPremium: boolean;
  close: () => void;
}) {
  if (!open) {
    return null;
  }

  const premiumLink: HeaderNavLink = {
    label: isPremium
      ? "Premium Billing"
      : "Upgrade to Premium",
    href: "/account/billing",
  };

  return (
    <div className="relative z-50 mx-4 mt-2 overflow-hidden rounded-[2rem] border border-white/10 bg-[rgba(10,10,10,0.78)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:hidden">
      <nav className="grid gap-2">
        {isLanding &&
          landingMobileLinks.map((link) => (
            <MobileLink
              key={link.href}
              link={link}
              close={close}
            />
          ))}

        {isViewer &&
          [...viewerMobileLinks, premiumLink].map(
            (link) => (
              <MobileLink
                key={`${link.label}-${link.href}`}
                link={link}
                close={close}
              />
            )
          )}

        {isViewer && (
          <MobileLink
            link={{
              label: "Partner Program",
              href: "/partner/apply",
            }}
            close={close}
          />
        )}

        {isPartner &&
          !isViewer &&
          partnerLinks.map((link) => (
            <MobileLink
              key={link.href}
              link={link}
              close={close}
            />
          ))}

        {(isPartner || isViewer) && (
          <div className="pt-2">
            <LogoutButton />
          </div>
        )}
      </nav>
    </div>
  );
}