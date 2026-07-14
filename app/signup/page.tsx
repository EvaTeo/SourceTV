"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

type PublicSettings = {
  platformName: string;
  allowRegistrations: boolean;
};

const defaultSettings: PublicSettings = {
  platformName: "SourceTV",
  allowRegistrations: true,
};

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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
          allowRegistrations?: unknown;
        };

        setSettings({
          platformName:
            typeof result.platformName ===
              "string" &&
            result.platformName.trim()
              ? result.platformName.trim()
              : defaultSettings.platformName,

          allowRegistrations:
            typeof result.allowRegistrations ===
            "boolean"
              ? result.allowRegistrations
              : defaultSettings.allowRegistrations,
        });
      } catch (error) {
        console.error(
          "Signup settings load error:",
          error
        );
      } finally {
        setLoadingSettings(false);
      }
    }

    void loadSettings();
  }, []);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!settings.allowRegistrations) {
      setMessage(
        "New account registrations are currently unavailable."
      );
      return;
    }

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setMessage(
        "Please complete all fields."
      );
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const response = await fetch(
        "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data: unknown =
        await response.json();

      const result = data as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          result.error || "Signup failed."
        );
      }

      window.location.href = "/login";
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Signup failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const logoParts =
    settings.platformName
      .toLowerCase()
      .endsWith("tv")
      ? {
          main:
            settings.platformName.slice(
              0,
              -2
            ),
          accent:
            settings.platformName.slice(
              -2
            ),
        }
      : {
          main: settings.platformName,
          accent: "",
        };

  if (loadingSettings) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <p className="text-sm text-white/50">
          Loading account settings...
        </p>
      </main>
    );
  }

  if (!settings.allowRegistrations) {
    return (
      <main className="min-h-screen bg-black px-6 pb-16 pt-28 text-white md:pt-32">
        <div className="mx-auto max-w-md">
          <Link
            href="/"
            className="text-2xl font-black"
          >
            {logoParts.main}

            {logoParts.accent && (
              <span className="text-sky-400">
                {logoParts.accent}
              </span>
            )}
          </Link>

          <div className="mt-14 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_0_45px_rgba(14,165,233,0.12)]">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
              Registrations Closed
            </p>

            <h1 className="mt-4 text-3xl font-black">
              New accounts are currently
              unavailable.
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/55">
              Existing members can still sign
              in and continue watching.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white py-4 font-black text-black transition hover:bg-sky-200"
            >
              Sign In
            </Link>

            <Link
              href="/"
              className="mt-4 inline-flex text-sm font-bold text-white/50 transition hover:text-white"
            >
              Return home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-6 pb-16 pt-28 text-white md:pt-32">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-2xl font-black"
        >
          {logoParts.main}

          {logoParts.accent && (
            <span className="text-sky-400">
              {logoParts.accent}
            </span>
          )}
        </Link>

        <div className="mt-14 rounded-[2rem] border border-sky-300/20 bg-white/[0.04] p-8 shadow-[0_0_45px_rgba(14,165,233,0.16)]">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            Create Account
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Join {settings.platformName}
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/55">
            Create a free viewer account to
            save your progress, build a
            watchlist, and create household
            profiles.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >
            <label className="block text-sm font-bold text-white/70">
              Name
            </label>

            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-sky-300"
              placeholder="Your name"
              autoComplete="name"
              required
            />

            <label className="mt-5 block text-sm font-bold text-white/70">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-sky-300"
              placeholder="you@email.com"
              autoComplete="email"
              required
            />

            <label className="mt-5 block text-sm font-bold text-white/70">
              Password
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password:
                    event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-sky-300"
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />

            {message && (
              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 w-full rounded-full bg-sky-400 py-4 font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.45)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-sky-300"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}