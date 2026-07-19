"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type PublicSettings = {
  platformName: string;
  tagline: string;
  supportEmail: string;
  contactEmail: string;
  partnerApplications: boolean;
};

const defaultSettings: PublicSettings = {
  platformName: "SourceTV",
  tagline:
    "The Next Generation of Entertainment",
  supportEmail: "support@sourcetv.com",
  contactEmail: "contact@sourcetv.com",
  partnerApplications: true,
};

export default function Footer() {
  const [settings, setSettings] =
    useState<PublicSettings>(
      defaultSettings
    );

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch(
          "/api/settings",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data: unknown =
          await response.json();

        if (
          !data ||
          typeof data !== "object"
        ) {
          return;
        }

        const result = data as {
          platformName?: unknown;
          tagline?: unknown;
          supportEmail?: unknown;
          contactEmail?: unknown;
          partnerApplications?: unknown;
        };

        setSettings({
          platformName:
            typeof result.platformName ===
              "string" &&
            result.platformName.trim()
              ? result.platformName.trim()
              : defaultSettings.platformName,

          tagline:
            typeof result.tagline ===
              "string" &&
            result.tagline.trim()
              ? result.tagline.trim()
              : defaultSettings.tagline,

          supportEmail:
            typeof result.supportEmail ===
              "string" &&
            result.supportEmail.trim()
              ? result.supportEmail.trim()
              : defaultSettings.supportEmail,

          contactEmail:
            typeof result.contactEmail ===
              "string" &&
            result.contactEmail.trim()
              ? result.contactEmail.trim()
              : defaultSettings.contactEmail,

          partnerApplications:
            typeof result.partnerApplications ===
            "boolean"
              ? result.partnerApplications
              : defaultSettings.partnerApplications,
        });
      } catch (error) {
        console.error(
          "Footer settings load error:",
          error
        );
      }
    }

    void loadSettings();
  }, []);

  const logoParts = useMemo(() => {
    const platformName =
      settings.platformName.trim() ||
      defaultSettings.platformName;

    if (
      platformName
        .toLowerCase()
        .endsWith("tv")
    ) {
      return {
        main: platformName.slice(0, -2),
        accent: platformName.slice(-2),
      };
    }

    return {
      main: platformName,
      accent: "",
    };
  }, [settings.platformName]);

  const footerSections = useMemo(() => {
    const creatorLinks = [
      ...(settings.partnerApplications
        ? [
            {
              label: "Become a Partner",
              href: "/partner/apply",
            },
          ]
        : []),
      {
        label: "Partner Portal",
        href: "/partner",
      },
      {
  label: "Submit Content",
  href: "/partner/submit",
},
      {
        label: "Partner Support",
        href: "/partner/inbox",
      },
    ];

    return [
      {
        title: "Account",
        links: [
          {
            label: "Account",
            href: "/account",
          },
          {
            label: "Switch Profile",
            href: "/profiles",
          },
          {
            label: "Manage Profiles",
            href: "/profiles",
          },
          {
            label: "My List",
            href: "/watchlist",
          },
          {
            label: "Settings",
            href: "/settings",
          },
          {
            label: "Subscription",
            href: "/subscription",
          },
        ],
      },
      {
        title: "Creators & Partners",
        links: creatorLinks,
      },
      {
        title: "Help",
        links: [
          {
            label: "Support",
            href: `mailto:${settings.supportEmail}`,
          },
          {
            label: "Contact",
            href: `mailto:${settings.contactEmail}`,
          },
          {
            label: "Report Content",
            href: "/report-content",
          },
        ],
      },
      {
        title: "Legal",
        links: [
          {
            label: "Terms of Use",
            href: "/terms",
          },
          {
            label: "Privacy Policy",
            href: "/privacy",
          },
          {
            label: "DMCA",
            href: "/dmca",
          },
        ],
      },
    ];
  }, [
    settings.contactEmail,
    settings.partnerApplications,
    settings.supportEmail,
  ]);

  return (
    <footer className="relative border-t border-white/[0.07] bg-transparent">
      <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-12 sm:px-8 sm:pb-24 lg:px-12 lg:pb-14 lg:pt-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-20">
          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4 sm:gap-x-12 lg:max-w-4xl">
            {footerSections.map(
              (section) => (
                <div key={section.title}>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.17em] text-white/35">
                    {section.title}
                  </h2>

                  <ul className="mt-5 space-y-3.5">
                    {section.links.map(
                      (link) => (
                        <li
                          key={`${section.title}-${link.label}`}
                        >
                          <Link
                            href={link.href}
                            className="text-sm text-white/50 transition duration-200 hover:text-sky-300"
                          >
                            {link.label}
                          </Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )
            )}
          </div>

          <div className="flex flex-col items-start lg:items-end lg:pt-1">
            <Link
              href="/"
              aria-label={`${settings.platformName} home`}
              className="inline-flex items-baseline text-lg font-semibold tracking-[-0.04em] text-white/85 transition hover:text-white"
            >
              {logoParts.main}

              {logoParts.accent && (
                <span className="text-sky-400">
                  {logoParts.accent}
                </span>
              )}
            </Link>

            <p className="mt-2 max-w-[240px] text-left text-xs leading-5 text-white/35 lg:text-right">
              {settings.tagline}
            </p>

            <div className="mt-5 space-y-1 text-left text-xs text-white/30 lg:text-right">
              <a
                href={`mailto:${settings.supportEmail}`}
                className="block transition hover:text-sky-300"
              >
                {settings.supportEmail}
              </a>

              {settings.contactEmail !==
                settings.supportEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="block transition hover:text-sky-300"
                >
                  {settings.contactEmail}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/[0.06] pt-6 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{" "}
            {settings.platformName}. All rights
            reserved.
          </p>

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