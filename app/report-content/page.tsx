"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReportContentPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-bold text-sky-300">
          ← Back to SourceTV
        </Link>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            Safety & Trust
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Report Content
          </h1>

          <p className="mt-5 text-white/60">
            If you believe content violates SourceTV policies, copyright,
            community standards, or applicable laws, please submit a report.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-green-300">
              Report submitted successfully.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-bold text-white/70">
                  Content Title or URL
                </label>

                <input
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-white/70">
                  Report Type
                </label>

                <select
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3"
                >
                  <option>Copyright Violation</option>
                  <option>Harassment</option>
                  <option>Spam</option>
                  <option>Illegal Content</option>
                  <option>Violence</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold text-white/70">
                  Details
                </label>

                <textarea
                  required
                  className="mt-2 min-h-[140px] w-full rounded-xl border border-white/10 bg-black px-4 py-3"
                />
              </div>

              <button
                type="submit"
                className="rounded-full bg-sky-400 px-8 py-4 font-black text-black"
              >
                Submit Report
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}