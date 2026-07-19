"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      localStorage.setItem(
        "sourcetvUser",
        JSON.stringify(data.user)
      );

      if (data.user.role === "admin") {
        window.location.href = "/admin";
        return;
      }

      if (data.user.role === "partner") {
  window.location.href = "/partner";
  return;
}

// Viewer accounts choose a profile before Browse.
window.location.href = "/profiles/select";
    } catch {
      setError(
        "SourceTV could not sign you in. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(56,189,248,0.14),transparent_30%),linear-gradient(to_bottom,#020617,#000_72%)]" />

      <div className="relative mx-auto max-w-md">
        <Link
          href="/"
          className="text-2xl font-black"
        >
          Source
          <span className="text-sky-400">TV</span>
        </Link>

        <div className="mt-14 rounded-[2rem] border border-sky-300/20 bg-white/[0.04] p-8 shadow-[0_0_45px_rgba(14,165,233,0.16)] backdrop-blur-2xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            Welcome Back
          </p>

          <h1 className="mt-3 text-4xl font-black">
            Sign in
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/55">
            Sign into your SourceTV account to continue
            watching, manage your profiles, or access your
            workspace.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8"
          >
            <label className="block text-sm font-bold text-white/70">
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
                  password: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none transition focus:border-sky-300"
              placeholder="Your password"
              autoComplete="current-password"
              required
            />

            {error && (
              <p className="mt-4 rounded-xl border border-red-300/20 bg-red-300/[0.07] px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-7 w-full rounded-full bg-sky-400 py-4 font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.45)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {submitting
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            New to SourceTV?{" "}
            <Link
              href="/signup"
              className="font-bold text-sky-300"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}