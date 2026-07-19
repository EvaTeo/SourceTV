"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SubmitPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Film",
    genre: "Drama",
    year: "",
    mainVideoUrl: "",
    trailerUrl: "",
    thumbnailUrl: "",
    backdropUrl: "",
    titleLogoUrl: "",
    maturityRating: "Not Rated",
    runtime: "",
    creatorName: "",
    creatorCompany: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("sourcetvUser");

    if (!userData) {
      window.location.href = "/login";
      return;
    }

    const currentUser = JSON.parse(userData);

    if (currentUser.role !== "partner" && currentUser.role !== "admin") {
      window.location.href = "/partner/apply";
      return;
    }

    setForm((current) => ({
      ...current,
      creatorName: currentUser.name || "",
    }));

    setCheckingAccess(false);
  }, []);

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.mainVideoUrl.trim()) {
      alert("Title, description, and main video URL are required.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          videoUrl: form.mainVideoUrl,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (res.status === 403) {
        window.location.href = "/partner/apply";
        return;
      }

      if (!res.ok) {
        alert(data?.error || "Error submitting project");
        console.error(data);
        return;
      }

      alert("Project submitted successfully. SourceTV will review it next.");

      setForm({
        title: "",
        description: "",
        type: "Film",
        genre: "Drama",
        year: "",
        mainVideoUrl: "",
        trailerUrl: "",
        thumbnailUrl: "",
        backdropUrl: "",
        titleLogoUrl: "",
        maturityRating: "Not Rated",
        runtime: "",
        creatorName: form.creatorName,
        creatorCompany: form.creatorCompany,
      });
    } catch (error) {
      console.error("PROJECT SUBMISSION ERROR:", error);
      alert("Could not submit project.");
    } finally {
      setSubmitting(false);
    }
  }

  if (checkingAccess) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

        <div className="relative z-10 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-white/60 shadow-2xl backdrop-blur-xl">
          Checking partner access...
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-32 pt-28 text-white md:px-10 md:pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Link
          href="/partner"
          className="inline-flex text-sm font-bold text-white/55 transition hover:text-sky-200"
        >
          ← Back to Partner Dashboard
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            SourceTV Partner Submission
          </p>

          <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-7xl">
            Submit Your Project
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
            Submit title metadata, artwork links, trailer links, and your main
            video URL. SourceTV reviews every project before it appears publicly.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8"
        >
          <SectionTitle
            label="Title Information"
            description="Basic details used across browse, search, and watch pages."
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="Project Title"
              value={form.title}
              onChange={(value) => updateField("title", value)}
              placeholder="Blue Hour"
              required
            />

            <Field
              label="Release Year"
              type="number"
              value={form.year}
              onChange={(value) => updateField("year", value)}
              placeholder="2026"
            />

            <SelectField
              label="Project Type"
              value={form.type}
              onChange={(value) => updateField("type", value)}
              options={[
                "Film",
                "Short Film",
                "Series",
                "Animation",
                "Documentary",
                "Music Video",
                "Special",
              ]}
            />

            <SelectField
              label="Genre"
              value={form.genre}
              onChange={(value) => updateField("genre", value)}
              options={[
                "Drama",
                "Comedy",
                "Action",
                "Horror",
                "Sci-Fi",
                "Thriller",
                "Romance",
                "Animation",
                "Documentary",
                "Experimental",
              ]}
            />

            <SelectField
              label="Maturity Rating"
              value={form.maturityRating}
              onChange={(value) => updateField("maturityRating", value)}
              options={["Not Rated", "G", "PG", "PG-13", "R", "TV-MA"]}
            />

            <Field
              label="Runtime"
              value={form.runtime}
              onChange={(value) => updateField("runtime", value)}
              placeholder="1h 42m"
            />
          </div>

          <TextArea
            label="Description"
            value={form.description}
            onChange={(value) => updateField("description", value)}
            placeholder="Tell us about the story, audience, and tone..."
            required
          />

          <Divider />

          <SectionTitle
            label="Video Links"
            description="Use hosted video URLs for now. Bunny direct upload stays inside admin upload."
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="Main Video URL"
              value={form.mainVideoUrl}
              onChange={(value) => updateField("mainVideoUrl", value)}
              placeholder="https://..."
              required
            />

            <Field
              label="Trailer URL"
              value={form.trailerUrl}
              onChange={(value) => updateField("trailerUrl", value)}
              placeholder="https://..."
            />
          </div>

          <Divider />

          <SectionTitle
            label="Artwork Links"
            description="Add poster, backdrop, and optional transparent title logo URLs."
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="Poster Thumbnail URL"
              value={form.thumbnailUrl}
              onChange={(value) => updateField("thumbnailUrl", value)}
              placeholder="https://..."
            />

            <Field
              label="Backdrop URL"
              value={form.backdropUrl}
              onChange={(value) => updateField("backdropUrl", value)}
              placeholder="https://..."
            />

            <div className="md:col-span-2">
              <Field
                label="Title Logo URL"
                value={form.titleLogoUrl}
                onChange={(value) => updateField("titleLogoUrl", value)}
                placeholder="Transparent PNG/WebP URL recommended"
              />
            </div>
          </div>

          <Divider />

          <SectionTitle
            label="Partner Information"
            description="This helps SourceTV review ownership and participation details."
          />

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field
              label="Creator Name"
              value={form.creatorName}
              onChange={(value) => updateField("creatorName", value)}
              placeholder="Creator or studio name"
            />

            <Field
              label="Company / Studio"
              value={form.creatorCompany}
              onChange={(value) => updateField("creatorCompany", value)}
              placeholder="Optional"
            />

            <div className="rounded-2xl border border-sky-300/20 bg-sky-400/10 p-5">
  <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
    Revenue Share
  </p>

  <p className="mt-3 text-sm leading-6 text-white/60">
    Revenue share is automatically assigned according to
    your SourceTV partner agreement and current platform
    settings.
  </p>
</div>
          </div>

          <div className="mt-8 rounded-2xl border border-sky-300/20 bg-sky-400/10 p-4 text-sm leading-6 text-white/60">
            Submitting does not publish the title immediately. It enters the
            SourceTV review workflow as a pending submission.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-md bg-sky-400 px-8 py-4 font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.32)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
          >
            {submitting ? "Submitting Project..." : "Submit Project"}
          </button>
        </form>
      </div>
    </main>
  );
}

function SectionTitle({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-300">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-white/45">{description}</p>
    </div>
  );
}

function Divider() {
  return <div className="my-8 h-px w-full bg-white/10" />;
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
        min={type === "number" ? "0" : undefined}
        max={label.includes("Revenue") ? "100" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-sky-300"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-white/45">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white outline-none focus:border-sky-300"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-sky-300"
      />
    </label>
  );
}