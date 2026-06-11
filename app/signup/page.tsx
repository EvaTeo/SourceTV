"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    alert("Account created successfully!");
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-md">
        <Link href="/" className="text-2xl font-black">
          Source<span className="text-sky-400">TV</span>
        </Link>

        <div className="mt-14 rounded-[2rem] border border-sky-300/20 bg-white/[0.04] p-8 shadow-[0_0_45px_rgba(14,165,233,0.16)]">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            Create Account
          </p>

          <h1 className="mt-3 text-4xl font-black">Join SourceTV</h1>

          <p className="mt-4 text-sm leading-6 text-white/55">
            Create a viewer account first. Later you can apply to become a
            creator from your settings.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <label className="block text-sm font-bold text-white/70">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Your name"
            />

            <label className="mt-5 block text-sm font-bold text-white/70">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="you@email.com"
            />

            <label className="mt-5 block text-sm font-bold text-white/70">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Create a password"
            />

            <button
              type="submit"
              className="mt-7 w-full rounded-full bg-sky-400 py-4 font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.45)]"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-sky-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}