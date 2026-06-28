"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreatorApplyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    creatorType: "Films",
    bio: "",
  });

  const [submitting, setSubmitting] = useState(false);

  async function submitApplication(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Creator / studio name is required.");
      return;
    }

    if (!form.email.trim()) {
      alert("Email is required.");
      return;
    }

    if (!form.bio.trim()) {
      alert("Please tell us about your work.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/creator/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          creatorType: form.creatorType,
          bio: form.bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not submit application.");
        return;
      }

      alert("Creator application submitted for review.");

      setForm({
        name: "",
        email: "",
        creatorType: "Films",
        bio: "",
      });
    } catch (error) {
      console.error("CREATOR APPLICATION SUBMIT ERROR:", error);
      alert("Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-2xl font-black">
          Source<span className="text-sky-400">TV</span>
        </Link>

        <section className="mt-14 grid gap-10 md:grid-cols-[1fr_420px] md:items-start">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-sky-300">
              Creator Access
            </p>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Apply to publish on SourceTV.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/65">
              SourceTV is curated. That means creators, directors, animators,
              and studios can submit projects, but content must be approved
              before it appears on the platform.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {["Apply", "Admin Review", "Creator Access"].map((step) => (
                <div
                  key={step}
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <h3 className="font-black text-sky-300">{step}</h3>
                  <p className="mt-2 text-sm text-white/55">
                    {step === "Apply"
                      ? "Tell us who you are."
                      : step === "Admin Review"
                      ? "SourceTV reviews your creator request."
                      : "Approved users unlock creator tools."}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={submitApplication}
            className="rounded-[2rem] border border-sky-300/20 bg-white/[0.04] p-6 shadow-[0_0_45px_rgba(14,165,233,0.16)]"
          >
            <h2 className="text-2xl font-black">Creator Application</h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Submit your creator request. SourceTV admin will review and
              approve access before creator tools unlock.
            </p>

            <label className="mt-6 block text-sm font-bold text-white/70">
              Creator / Studio Name
            </label>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Example: Source Star Films"
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
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="creator@email.com"
            />

            <label className="mt-5 block text-sm font-bold text-white/70">
              What do you create?
            </label>
            <select
              value={form.creatorType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  creatorType: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
            >
              <option>Films</option>
              <option>Short Films</option>
              <option>Series</option>
              <option>Animation</option>
              <option>Documentaries</option>
              <option>Mixed Projects</option>
              <option>Studio / Collective</option>
            </select>

            <label className="mt-5 block text-sm font-bold text-white/70">
              Why should your work be on SourceTV?
            </label>
            <textarea
              value={form.bio}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  bio: event.target.value,
                }))
              }
              className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Tell us about your creative work..."
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 text-center font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.45)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>

            <p className="mt-4 text-xs leading-5 text-white/40">
              After approval, your account can unlock creator dashboard tools,
              submissions, project tracking, and future revenue features.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}