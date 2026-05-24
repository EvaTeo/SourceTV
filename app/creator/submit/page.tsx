"use client";

import { useState } from "react";
import Link from "next/link";

export default function SubmitPage() {
  const [form, setForm] = useState({
    title: "",
    type: "Film",
    genre: "Drama",
    videoUrl: "",
    description: "",
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
  e.preventDefault();

  const res = await fetch("/api/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const text = await res.text();
const data = text ? JSON.parse(text) : null;

if (!res.ok) {
  alert("Error submitting project");
  console.error(data);
  return;
}

  alert("Project submitted successfully!");

  setForm({
    title: "",
    type: "Film",
    genre: "Drama",
    videoUrl: "",
    description: "",
  });
}

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-2xl font-black">
          Source<span className="text-sky-400">TV</span>
        </Link>

        <h1 className="mt-12 text-5xl font-black">
          Submit Your Project
        </h1>

        <p className="mt-4 text-white/60 max-w-2xl">
          Upload your project details. Once submitted, SourceTV will review
          and approve or deny your content.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-3xl border border-sky-300/20 bg-white/[0.04] p-6 shadow-[0_0_40px_rgba(14,165,233,0.2)]"
        >
          {/* TITLE */}
          <label className="block text-sm font-bold text-white/70">
            Project Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
            placeholder="Blue Hour"
          />

          {/* TYPE */}
          <label className="mt-6 block text-sm font-bold text-white/70">
            Project Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3"
          >
            <option>Film</option>
            <option>Short Film</option>
            <option>Series</option>
            <option>Animation</option>
            <option>Documentary</option>
          </select>

          {/* GENRE */}
          <label className="mt-6 block text-sm font-bold text-white/70">
            Genre
          </label>
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3"
          >
            <option>Drama</option>
            <option>Comedy</option>
            <option>Action</option>
            <option>Horror</option>
            <option>Sci-Fi</option>
          </select>

          {/* VIDEO URL */}
          <label className="mt-6 block text-sm font-bold text-white/70">
            Video URL
          </label>
          <input
            name="videoUrl"
            value={form.videoUrl}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3"
            placeholder="https://..."
          />

          {/* DESCRIPTION */}
          <label className="mt-6 block text-sm font-bold text-white/70">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 min-h-[120px]"
            placeholder="Tell us about your project..."
          />

          {/* SUBMIT */}
          <button
            type="submit"
            className="mt-8 w-full rounded-full bg-sky-400 py-4 font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.5)]"
          >
            Submit Project
          </button>
        </form>
      </div>
    </main>
  );
}