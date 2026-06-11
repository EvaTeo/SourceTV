"use client";

import Link from "next/link";
import { useState } from "react";

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

  const [submitting, setSubmitting] = useState(false);

  async function submitApplication(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);

      const res = await fetch("/api/partner/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        alert(data.error || "Could not submit application");
        return;
      }

      alert("Partner application submitted.");
      window.location.href = "/partner";
    } catch (error) {
      console.error("PARTNER APPLICATION ERROR:", error);
      alert("Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 pb-32 pt-28 text-white md:px-10 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <Link href="/browse" className="text-sm font-bold text-sky-300">
          ← Back to SourceTV
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            SourceTV Partner Program
          </p>

          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-7xl">
            Apply as a Partner
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
            SourceTV works with filmmakers, producers, studios, animators,
            documentarians, and distributors. Submit your information for review
            before uploading work to the platform.
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
              onChange={(value) => setForm({ ...form, fullName: value })}
              required
            />

            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) => setForm({ ...form, email: value })}
              required
            />

            <Field
              label="Company / Studio"
              value={form.company}
              onChange={(value) => setForm({ ...form, company: value })}
            />

            <Field
              label="Role"
              placeholder="Director, Producer, Distributor..."
              value={form.roleTitle}
              onChange={(value) => setForm({ ...form, roleTitle: value })}
            />

            <Field
              label="Website"
              value={form.website}
              onChange={(value) => setForm({ ...form, website: value })}
            />

            <Field
              label="Portfolio / IMDb / Reel"
              value={form.portfolio}
              onChange={(value) => setForm({ ...form, portfolio: value })}
            />
          </div>

          <div className="mt-5">
            <Field
              label="Type of Work"
              placeholder="Feature films, web series, documentaries, animation..."
              value={form.workType}
              onChange={(value) => setForm({ ...form, workType: value })}
            />
          </div>

          <TextArea
            label="Short Bio"
            value={form.bio}
            onChange={(value) => setForm({ ...form, bio: value })}
          />

          <TextArea
            label="Why do you want to distribute on SourceTV?"
            value={form.reason}
            onChange={(value) => setForm({ ...form, reason: value })}
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-full bg-sky-400 px-8 py-4 font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.38)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            {submitting ? "Submitting..." : "Submit Partner Application"}
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
        onChange={(e) => onChange(e.target.value)}
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
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-sky-300"
      />
    </label>
  );
}