import Link from "next/link";

const footerSections = [
  {
    title: "Account",
    links: [
      { label: "Account", href: "/account" },
      { label: "Switch Profile", href: "/profiles" },
      { label: "Manage Profiles", href: "/profiles" },
      { label: "My List", href: "/watchlist" },
      { label: "Settings", href: "/settings" },
      { label: "Subscription", href: "/subscription" },
    ],
  },
  {
    title: "Creators & Partners",
    links: [
      { label: "Become a Partner", href: "/partner/apply" },
      { label: "Partner Portal", href: "/partner" },
      { label: "Submit Content", href: "/creator/submit" },
      { label: "Partner Support", href: "/partner/inbox" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "DMCA", href: "/dmca" },
      { label: "Report Content", href: "/report-content" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-transparent">
      <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-12 sm:px-8 sm:pb-24 lg:px-12 lg:pb-14 lg:pt-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-20">
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-16 lg:max-w-3xl">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.17em] text-white/35">
                  {section.title}
                </h2>

                <ul className="mt-5 space-y-3.5">
                  {section.links.map((link) => (
                    <li key={`${section.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/50 transition duration-200 hover:text-sky-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start lg:items-end lg:pt-1">
            <Link
              href="/"
              aria-label="SourceTV home"
              className="inline-flex items-baseline text-lg font-semibold tracking-[-0.04em] text-white/85 transition hover:text-white"
            >
              Source
              <span className="text-sky-400">TV</span>
            </Link>

<p className="mt-2 max-w-[220px] text-left text-xs leading-5 text-white/35 lg:text-right">
              The next generation of entertainment.
            </p>

          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 SourceTV. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span>United States</span>
            <span className="h-1 w-1 rounded-full bg-white/15" />
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
}