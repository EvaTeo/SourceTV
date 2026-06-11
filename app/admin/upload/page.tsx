"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminUploadPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Film",
    genre: "Drama",
    maturityRating: "Not Rated",
    runtime: "",
    creatorName: "",
    revenueShare: "50",
  });

  const [mainVideoFile, setMainVideoFile] = useState<File | null>(null);
  const [trailerFile, setTrailerFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [titleLogoFile, setTitleLogoFile] = useState<File | null>(null);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title || !form.description || !mainVideoFile) {
      alert("Title, description, and main video are required.");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append("mainVideoFile", mainVideoFile);

    if (trailerFile) {
      formData.append("trailerFile", trailerFile);
    }

    if (thumbnailFile) {
      formData.append("thumbnailFile", thumbnailFile);
    }

    if (backdropFile) {
      formData.append("backdropFile", backdropFile);
    }

    if (titleLogoFile) {
      formData.append("titleLogoFile", titleLogoFile);
    }

    const res = await fetch("/api/bunny/upload-video", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Upload failed");
      return;
    }

    alert("Streaming title uploaded successfully!");
  }

  function updateField(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-sm font-bold text-sky-300">
          ← Back to Admin
        </Link>

        <div className="mt-8 border-b border-white/10 pb-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            SourceTV Admin Upload
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Create Streaming Title
          </h1>

          <p className="mt-4 max-w-2xl text-white/60">
            Upload a complete SourceTV package including artwork, title logo,
            trailer, and full feature presentation.
          </p>
        </div>

        <form
          onSubmit={handleUpload}
          className="mt-10 grid gap-6 rounded-3xl border border-sky-300/20 bg-white/[0.04] p-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-white/70">
              Title
            </label>

            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Example: Blue Hour"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-white/70">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
              placeholder="Describe the film, show, or project..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70">
              Type
            </label>

            <select
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            >
              <option>Film</option>
              <option>Short Film</option>
              <option>Series</option>
              <option>Animation</option>
              <option>Documentary</option>
              <option>Music Video</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70">
              Genre
            </label>

            <select
              value={form.genre}
              onChange={(e) => updateField("genre", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            >
              <option>Drama</option>
              <option>Comedy</option>
              <option>Action</option>
              <option>Horror</option>
              <option>Sci-Fi</option>
              <option>Animation</option>
              <option>Documentary</option>
              <option>Experimental</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70">
              Maturity Rating
            </label>

            <select
              value={form.maturityRating}
              onChange={(e) =>
                updateField("maturityRating", e.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            >
              <option>Not Rated</option>
              <option>G</option>
              <option>PG</option>
              <option>PG-13</option>
              <option>R</option>
              <option>TV-MA</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70">
              Runtime
            </label>

            <input
              value={form.runtime}
              onChange={(e) => updateField("runtime", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
              placeholder="Example: 1h 42m"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70">
              Creator Name
            </label>

            <input
              value={form.creatorName}
              onChange={(e) => updateField("creatorName", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70">
              Creator Revenue Share %
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={form.revenueShare}
              onChange={(e) => updateField("revenueShare", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-white/70">
              Poster Thumbnail Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setThumbnailFile(e.target.files?.[0] || null)
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-white/70">
              Backdrop Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setBackdropFile(e.target.files?.[0] || null)
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-white/70">
              Title Logo (Transparent PNG Recommended)
            </label>

            <input
              type="file"
              accept="image/png,image/webp,image/svg+xml"
              onChange={(e) =>
                setTitleLogoFile(e.target.files?.[0] || null)
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70">
              Main Video File
            </label>

            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setMainVideoFile(e.target.files?.[0] || null)
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/70">
              Trailer File
            </label>

            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setTrailerFile(e.target.files?.[0] || null)
              }
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 rounded-full bg-sky-400 px-6 py-4 font-black text-black disabled:opacity-50"
          >
            {loading
              ? "Uploading Streaming Package..."
              : "Publish Title"}
          </button>
        </form>

        {result && (
          <pre className="mt-8 overflow-auto rounded-2xl border border-white/10 bg-zinc-950 p-5 text-xs text-white/70">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}