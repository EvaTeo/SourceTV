"use client";

import Link from "next/link";
import { useState } from "react";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";

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

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();

    if (!form.title || !form.description || !mainVideoFile) {
      alert("Title, description, and main video are required.");
      return;
    }

    try {
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

      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      alert("Streaming title uploaded successfully!");
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <main className="space-y-6">
      <AdminPageHeader
        eyebrow="SourceTV Operations"
        title="Upload Title"
        description="Upload a complete SourceTV package including artwork, title logo, trailer, metadata, and the full streaming presentation."
        actions={
          <Link
            href="/admin/content"
            className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
          >
            Content Center
          </Link>
        }
      />

      <form
        onSubmit={handleUpload}
        className="grid gap-6 rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-white/70">
            Title
          </label>

          <input
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300"
            placeholder="Example: Blue Hour"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-white/70">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300"
            placeholder="Describe the film, show, or project..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Type
          </label>

          <select
            value={form.type}
            onChange={(event) => updateField("type", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white outline-none focus:border-sky-300"
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
            onChange={(event) => updateField("genre", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white outline-none focus:border-sky-300"
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
            onChange={(event) =>
              updateField("maturityRating", event.target.value)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white outline-none focus:border-sky-300"
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
            onChange={(event) => updateField("runtime", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300"
            placeholder="Example: 1h 42m"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Creator Name
          </label>

          <input
            value={form.creatorName}
            onChange={(event) =>
              updateField("creatorName", event.target.value)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300"
            placeholder="Creator or studio name"
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
            onChange={(event) =>
              updateField("revenueShare", event.target.value)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white outline-none focus:border-sky-300"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-white/70">
            Poster Thumbnail Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setThumbnailFile(event.target.files?.[0] || null)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-sky-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#05070d]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-white/70">
            Backdrop Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setBackdropFile(event.target.files?.[0] || null)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-sky-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#05070d]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-white/70">
            Title Logo (Transparent PNG Recommended)
          </label>

          <input
            type="file"
            accept="image/png,image/webp,image/svg+xml"
            onChange={(event) =>
              setTitleLogoFile(event.target.files?.[0] || null)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-sky-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#05070d]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Main Video File
          </label>

          <input
            type="file"
            accept="video/*"
            onChange={(event) =>
              setMainVideoFile(event.target.files?.[0] || null)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-sky-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#05070d]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Trailer File
          </label>

          <input
            type="file"
            accept="video/*"
            onChange={(event) =>
              setTrailerFile(event.target.files?.[0] || null)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#05070d] px-4 py-3 text-white file:mr-4 file:rounded-xl file:border-0 file:bg-sky-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#05070d]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-300 px-6 py-4 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-50 md:col-span-2"
        >
          {loading ? "Uploading Streaming Package..." : "Upload Title"}
        </button>
      </form>

      {result && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <pre className="overflow-auto text-xs text-white/70">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}