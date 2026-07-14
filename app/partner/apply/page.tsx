"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

type PublicSettings = {
  platformName: string;
  partnerApplications: boolean;
};

const defaultSettings: PublicSettings = {
  platformName: "SourceTV",
  partnerApplications: true,
};

export default function PartnerApplyPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    company: "",
    roleTitle: "",
    website: "",
    portfolio: "",
    workType: "",
    bio: "",
    reason: "",
  });

  const [settings, setSettings] =
    useState<PublicSettings>(
      defaultSettings
    );

  const [loadingSettings, setLoadingSettings] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [message, setMessage] =
    useState("");

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
          partnerApplications?: unknown;
        };

        setSettings({
          platformName:
            typeof result.platformName ===
              "string" &&
            result.platformName.trim()
              ? result.platformName.trim()
              : defaultSettings.platformName,

          partnerApplications:
            typeof result.partnerApplications ===
            "boolean"
              ? result.partnerApplications
              : defaultSettings.partnerApplications,
        });
      } catch (error) {
        console.error(
          "Partner settings load error:",
          error
        );
      } finally {
        setLoadingSettings(false);
      }
    }

    void loadSettings();
  }, []);

  async function submitApplication(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!settings.partnerApplications) {
      setMessage(
        "Partner applications are currently closed."
      );
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await fetch(
        "/api/partner/apply",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data: unknown =
        await response.json();

      const result = data as {
        error?: string;
      };

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Could not submit application."
        );
      }

      window.location.href = "/partner";
    } catch (error) {
      console.error(
        "PARTNER APPLICATION ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not submit application."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const logoEndsWithTV =
    settings.platformName
      .toLowerCase()
      .endsWith("tv");

  const logoMain = logoEndsWithTV
    ? settings.platformName.slice(0, -2)
    : settings.platformName;

  const logoAccent = logoEndsWithTV
    ? settings.platformName.slice(-2)
    : "";

  if (loadingSettings) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <p className="text-sm text-white/50">
          Loading partner settings...
        </p>
      </main>
    );
  }

  if (!settings.partnerApplications) {
    return (
      <main className="min-h-screen bg-black px-4 pb-32 pt-28 text-white md:px-10 md:pb-24">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/browse"
            className="text-sm font-bold text-sky-300"
          >
            ← Back to {settings.platformName}
          </Link>

          <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center shadow-2xl backdrop-blur-xl md:p-12">
            <Link
              href="/"
              className="inline-flex items-baseline text-3xl font-black tracking-tight"
            >
              {logoMain}

              {logoAccent && (
                <span className="text-sky-400">
                  {logoAccent}
                </span>
              )}
            </Link>

            <p className="mt-10 text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-xs">
              Partner Program
            </p>

            <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-6xl">
              Applications are currently closed.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55 md:text-base">
              We are not accepting new partner
              applications at this time. Please
              check back later for future
              opportunities.
            </p>

            <Link
              href="/browse"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-black text-black transition hover:bg-sky-200"
            >
              Browse {settings.platformName}
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 pb-32 pt-28 text-white md:px-10 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/browse"
          className="text-sm font-bold text-sky-300"
        >
          ← Back to {settings.platformName}
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            {settings.platformName} Partner Program
          </p>

          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-7xl">
            Apply as a Partner
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
            {settings.platformName} works with
            filmmakers, producers, studios,
            animators, documentarians, and
            distributors. Submit your information
            for review before uploading work to the
            platform.
          </p>
        </section>

        <form
          onSubmit={submitApplication}
          className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Full Name"
              value={form.fullName}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  fullName: value,
                }))
              }
              required
            />

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  email: value,
                }))
              }
              required
            />

            <Field
              label="Company / Studio"
              value={form.company}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  company: value,
                }))
              }
            />

            <Field
              label="Role"
              placeholder="Director, Producer, Distributor..."
              value={form.roleTitle}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  roleTitle: value,
                }))
              }
            />

            <Field
              label="Website"
              value={form.website}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  website: value,
                }))
              }
            />

            <Field
              label="Portfolio / IMDb / Reel"
              value={form.portfolio}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  portfolio: value,
                }))
              }
            />
          </div>

          <div className="mt-5">
            <Field
              label="Type of Work"
              placeholder="Feature films, web series, documentaries, animation..."
              value={form.workType}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  workType: value,
                }))
              }
            />
          </div>

          <TextArea
            label="Short Bio"
            value={form.bio}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                bio: value,
              }))
            }
          />

          <TextArea
            label={`Why do you want to distribute on ${settings.platformName}?`}
            value={form.reason}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                reason: value,
              }))
            }
            required
          />

          {message && (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-full bg-sky-400 px-8 py-4 font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.38)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            {submitting
              ? "Submitting..."
              : "Submit Partner Application"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
        {label}
        {required ? " *" : ""}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-sky-300"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="mt-5 block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
        {label}
        {required ? " *" : ""}
      </span>

      <textarea
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={5}
        className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-sky-300"
      />
    </label>
  );
}