"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

export default function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [backdropFile, setBackdropFile] = useState<File | null>(null);
  const [cardArtFile, setCardArtFile] = useState<File | null>(null);
  const [titleLogoFile, setTitleLogoFile] = useState<File | null>(null);
  const [assetUploading, setAssetUploading] = useState("");

  useEffect(() => {
    async function loadContent() {
      const res = await fetch("/api/admin/content", {
        cache: "no-store",
      });

      const data = await res.json();

      const item = Array.isArray(data)
        ? data.find((entry: any) => entry.id === id)
        : null;

      setForm(item);
      setLoading(false);
    }

    loadContent();
  }, [id]);

  function updateField(name: string, value: string) {
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function saveChanges(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/admin/content/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      alert("Failed to save changes");
      return;
    }

    alert("Content updated!");
  }

  async function uploadAsset(
    assetType: "poster" | "backdrop" | "cardArt" | "titleLogo"
  ) {
    const selectedFile =
      assetType === "poster"
        ? posterFile
        : assetType === "backdrop"
          ? backdropFile
          : assetType === "cardArt"
            ? cardArtFile
            : titleLogoFile;

    if (!selectedFile) {
      alert("Choose a file first.");
      return;
    }

    setAssetUploading(assetType);

    const formData = new FormData();

    if (assetType === "poster") formData.append("posterFile", selectedFile);
    if (assetType === "backdrop") formData.append("backdropFile", selectedFile);
    if (assetType === "cardArt") formData.append("cardArtFile", selectedFile);
    if (assetType === "titleLogo")
      formData.append("titleLogoFile", selectedFile);

    const res = await fetch(`/api/admin/content/${id}/assets`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setAssetUploading("");

    if (!res.ok) {
      alert(data.error || "Asset upload failed");
      return;
    }

    setForm(data.project);

    if (assetType === "poster") setPosterFile(null);
    if (assetType === "backdrop") setBackdropFile(null);
    if (assetType === "cardArt") setCardArtFile(null);
    if (assetType === "titleLogo") setTitleLogoFile(null);

    alert("Asset uploaded.");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        Loading editor...
      </main>
    );
  }

  if (!form) {
    return (
      <main className="min-h-screen bg-black px-6 py-10 text-white">
        Content not found.
      </main>
    );
  }

  const fileInputClass =
    "mt-4 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white/70";

  const quietUploadButton =
    "mt-3 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:bg-white/[0.07] hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/review" className="text-sm font-bold text-sky-300">
          ← Back to Review Queue
        </Link>

        <div className="mt-8">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-sky-300">
            SourceTV CMS
          </p>

          <h1 className="mt-3 text-5xl font-black">Edit Title</h1>

          <p className="mt-4 text-white/60">
            Manage metadata, artwork, publishing, and creator details.
          </p>
        </div>

        <form
          onSubmit={saveChanges}
          className="mt-10 grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <h2 className="text-2xl font-black">Metadata</h2>
            <p className="mt-2 text-white/50">
              Core title information shown across SourceTV.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-white/60">
              Title
            </label>

            <input
              value={form.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-white/60">
              Description
            </label>

            <textarea
              value={form.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              className="mt-2 min-h-36 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-sky-300"
            />
          </div>

          <div className="md:col-span-2 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black">Artwork & Assets</h2>

            <p className="mt-2 text-white/50">
              Upload posters, clean hero backdrops, horizontal card artwork,
              and transparent title artwork.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-white/60">Poster</p>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
              {form.thumbnailUrl ? (
                <img
                  src={form.thumbnailUrl}
                  alt="Poster"
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="flex h-[320px] items-center justify-center text-white/30">
                  No Poster Uploaded
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
              className={fileInputClass}
            />

            <button
              type="button"
              onClick={() => uploadAsset("poster")}
              disabled={assetUploading === "poster"}
              className={`${quietUploadButton} w-full`}
            >
              {assetUploading === "poster"
                ? "Uploading..."
                : "Upload New Poster"}
            </button>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-white/60">
              Backdrop
            </p>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
              {form.backdropUrl ? (
                <img
                  src={form.backdropUrl}
                  alt="Backdrop"
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex h-[220px] items-center justify-center text-white/30">
                  No Backdrop Uploaded
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBackdropFile(e.target.files?.[0] || null)}
              className={fileInputClass}
            />

            <button
              type="button"
              onClick={() => uploadAsset("backdrop")}
              disabled={assetUploading === "backdrop"}
              className={`${quietUploadButton} w-full`}
            >
              {assetUploading === "backdrop"
                ? "Uploading..."
                : "Upload New Backdrop"}
            </button>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-white/60">
              Card Artwork
            </p>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
              {form.cardArtUrl ? (
                <img
                  src={form.cardArtUrl}
                  alt="Card Artwork"
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="flex h-[220px] items-center justify-center text-white/30">
                  No Card Artwork Uploaded
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCardArtFile(e.target.files?.[0] || null)}
              className={fileInputClass}
            />

            <button
              type="button"
              onClick={() => uploadAsset("cardArt")}
              disabled={assetUploading === "cardArt"}
              className={`${quietUploadButton} w-full`}
            >
              {assetUploading === "cardArt"
                ? "Uploading..."
                : "Upload New Card Artwork"}
            </button>

            <p className="mt-2 text-xs text-white/40">
              Horizontal artwork for Continue Watching and resume rows.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-white/60">
              Title Artwork
            </p>

            <div className="flex min-h-[220px] items-center rounded-3xl border border-white/10 bg-black p-8">
              {form.titleLogoUrl ? (
                <img
                  src={form.titleLogoUrl}
                  alt="Title Artwork"
                  className="max-h-40 w-auto object-contain"
                />
              ) : (
                <div className="text-white/30">
                  No Title Artwork Uploaded
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/png,image/webp,image/svg+xml"
              onChange={(e) => setTitleLogoFile(e.target.files?.[0] || null)}
              className={fileInputClass}
            />

            <button
              type="button"
              onClick={() => uploadAsset("titleLogo")}
              disabled={assetUploading === "titleLogo"}
              className={`${quietUploadButton} w-full`}
            >
              {assetUploading === "titleLogo"
                ? "Uploading..."
                : "Upload New Title Artwork"}
            </button>

            <p className="mt-2 text-xs text-white/40">
              Transparent PNG recommended. This appears in hero areas instead
              of plain text.
            </p>
          </div>

          <div className="md:col-span-2 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black">Catalog Details</h2>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/60">
              Type
            </label>

            <select
              value={form.type || "Film"}
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
            <label className="block text-sm font-bold text-white/60">
              Genre
            </label>

            <select
              value={form.genre || "Drama"}
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
            <label className="block text-sm font-bold text-white/60">
              Maturity Rating
            </label>

            <select
              value={form.maturityRating || "Not Rated"}
              onChange={(e) => updateField("maturityRating", e.target.value)}
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
            <label className="block text-sm font-bold text-white/60">
              Runtime
            </label>

            <input
              value={form.runtime || ""}
              onChange={(e) => updateField("runtime", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
              placeholder="Example: 1h 42m"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/60">
              Creator Name
            </label>

            <input
              value={form.creatorName || ""}
              onChange={(e) => updateField("creatorName", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white/60">
              Revenue Share %
            </label>

            <input
              type="number"
              min="0"
              max="100"
              value={form.revenueShare || 50}
              onChange={(e) => updateField("revenueShare", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            />
          </div>

          <div className="md:col-span-2 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-black">Publishing</h2>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/60">
              Status
            </label>

            <select
              value={form.status || "pending"}
              onChange={(e) => updateField("status", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            >
              <option>draft</option>
              <option>pending</option>
              <option>approved</option>
              <option>private</option>
              <option>unlisted</option>
              <option>rejected</option>
              <option>archived</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-sky-400 px-7 py-3 font-black text-black disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <Link
              href={`/watch/${form.id}?preview=admin`}
              className="rounded-full border border-sky-300/30 px-7 py-3 font-bold text-sky-200"
            >
              Preview
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}