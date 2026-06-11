"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreatorApplyPage() {
  const [form, setForm] = useState({
    creatorType: "Filmmaker",
    bio: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/creator/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Application failed");
      return;
    }

    alert("Creator application submitted!");

    setForm({
      creatorType: "Filmmaker",
      bio: "",
    });
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
              Apply to become a SourceTV creator.
            </h1>

            <p className="mt-6 text-lg leading-8 text-white/65">
              Start as a viewer, then apply for creator access. If approved by
              SourceTV admin, your account unlocks creator dashboard tools,
              project submissions, analytics, and future revenue tracking.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {["Viewer Account", "Admin Review", "Creator Access"].map(
                (step) => (
                  <div
                    key={step}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <h3 className="font-black text-sky-300">{step}</h3>
                    <p className="mt-2 text-sm text-white/55">
                      {step === "Viewer Account"
                        ? "Create and log into a normal account."
                        : step === "Admin Review"
                        ? "SourceTV reviews your creator request."
                        : "Approved users unlock creator tools."}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-sky-300/20 bg-white/[0.04] p-6 shadow-[0_0_45px_rgba(14,165,233,0.16)]"
          >
            <h2 className="text-2xl font-black">Creator Application</h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              You must be logged in. Your name and email will be pulled from
              your SourceTV account.
            </p>

            <label className="mt-6 block text-sm font-bold text-white/70">
              Creator Type
            </label>
            <select
              value={form.creatorType}
              onChange={(e) =>
                setForm({ ...form, creatorType: e.target.value })
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
            >
              <option>Filmmaker</option>
              <option>Director</option>
              <option>Animator</option>
              <option>Series Creator</option>
              <option>Documentary Creator</option>
              <option>Studio / Collective</option>
            </select>

            <label className="mt-5 block text-sm font-bold text-white/70">
              Tell us about your work
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="mt-2 min-h-40 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Describe your creative work, projects, style, and why you want to publish on SourceTV..."
            />

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-sky-400 px-6 py-3 text-center font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.45)]"
            >
              Submit Creator Application
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}