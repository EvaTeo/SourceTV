"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatScheduledDate(value?: string | null) {
  if (!value) return "Select date";

  return new Date(value).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatScheduledTime(value?: string | null) {
  if (!value) return "Select time";

  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function buildTimeOptions() {
  const options: { label: string; value: string }[] = [];

  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);

      options.push({
        value: `${String(hour).padStart(2, "0")}:${String(minute).padStart(
          2,
          "0"
        )}`,
        label: date.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      });
    }
  }

  return options;
}

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

  const [mainVideoFile, setMainVideoFile] = useState<File | null>(null);
  const [trailerVideoFile, setTrailerVideoFile] = useState<File | null>(null);
  const [videoUploading, setVideoUploading] = useState("");

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const timeOptions = useMemo(() => buildTimeOptions(), []);

  const [messageSubject, setMessageSubject] = useState(
  "Message From SourceTV"
);

const [messageSenderTeam, setMessageSenderTeam] = useState(
  "SourceTV Programming Team"
);

const [messageBody, setMessageBody] = useState("");

const [sendingMessage, setSendingMessage] = useState(false);

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

      if (item?.scheduledAt) {
        setCalendarMonth(new Date(item.scheduledAt));
      }

      setLoading(false);
    }

    loadContent();
  }, [id]);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [calendarMonth]);

  function updateField(name: string, value: any) {
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }

  function selectScheduleDate(date: Date) {
    const current = form.scheduledAt ? new Date(form.scheduledAt) : new Date();

    current.setFullYear(date.getFullYear());
    current.setMonth(date.getMonth());
    current.setDate(date.getDate());

    if (!form.scheduledAt) {
      current.setHours(19, 0, 0, 0);
    }

    updateField("scheduledAt", current.toISOString());
    setCalendarOpen(false);
  }

  function selectScheduleTime(value: string) {
    const [hours, minutes] = value.split(":").map(Number);
    const current = form.scheduledAt ? new Date(form.scheduledAt) : new Date();

    current.setHours(hours, minutes, 0, 0);

    updateField("scheduledAt", current.toISOString());
    setTimeOpen(false);
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
    if (assetType === "titleLogo") {
      formData.append("titleLogoFile", selectedFile);
    }

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

  async function uploadVideoAsset(type: "main" | "trailer") {
    const file = type === "main" ? mainVideoFile : trailerVideoFile;

    if (!file) {
      alert("Choose a video first.");
      return;
    }

    setVideoUploading(type);

    const formData = new FormData();

    if (type === "main") {
      formData.append("mainVideoFile", file);
    }

    if (type === "trailer") {
      formData.append("trailerFile", file);
    }

    const res = await fetch(`/api/admin/content/${id}/videos`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setVideoUploading("");

    if (!res.ok) {
      alert(data.error || "Video upload failed");
      return;
    }

    setForm(data.project);

    if (type === "main") setMainVideoFile(null);
    if (type === "trailer") setTrailerVideoFile(null);

    alert("Video updated.");
  }

  async function sendPartnerMessage() {
  if (!form) return;

  if (!messageBody.trim()) {
    alert("Please enter a message.");
    return;
  }

  if (!form.creatorEmail) {
    alert("This title does not have a partner email.");
    return;
  }

  try {
    setSendingMessage(true);

    const res = await fetch(`/api/admin/content/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "send_message",
        partnerEmail: form.creatorEmail,
        partnerName: form.creatorName || form.creatorCompany || "",
        subject: messageSubject,
        message: messageBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Could not send message.");
      return;
    }

    alert("Partner message sent.");
    setMessageBody("");
  } catch (error) {
    console.error("SEND PARTNER MESSAGE ERROR:", error);
    alert("Could not send partner message.");
  } finally {
    setSendingMessage(false);
  }
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

    async function sendPartnerMessage() {
if (!form) return;

  if (!messageBody.trim()) {
    alert("Please enter a message.");
    return;
  }

  try {
    setSendingMessage(true);

const res = await fetch(`/api/admin/content/${id}`, {
        method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "send_message",
        partnerEmail: form.creatorEmail,
partnerName:
  form.creatorName ||
  form.creatorCompany ||
  "",
        senderTeam: messageSenderTeam,
        subject: messageSubject,
        message: messageBody,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to send message.");
      return;
    }

    setMessageBody("");

    alert("Message sent to partner.");
  } catch (error) {
    console.error(error);
    alert("Failed to send message.");
  } finally {
    setSendingMessage(false);
  }
}
  }

  const fileInputClass =
    "mt-4 w-full rounded-2xl border border-white/10 bg-black px-4 py-3 text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white/70";

  const quietUploadButton =
    "mt-3 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-black text-white/70 transition hover:border-sky-300/40 hover:bg-white/[0.07] hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-50";

  const selectedDate = form.scheduledAt ? new Date(form.scheduledAt) : null;

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
            Manage metadata, artwork, video assets, publishing, and creator
            details.
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
            <p className="mb-3 text-sm font-bold text-white/60">Backdrop</p>

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
            <h2 className="text-2xl font-black">Video Assets</h2>

            <p className="mt-2 text-white/50">
              Replace the main video or trailer without creating a new title.
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/60">
              Main Video
            </label>

            <div className="mt-2 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-bold text-white/45">
                {form.mainVideoUrl || form.videoUrl
                  ? "Main video attached"
                  : "No main video attached"}
              </p>

              {(form.mainVideoUrl || form.videoUrl) && (
                <p className="mt-2 break-all text-[10px] text-white/25">
                  {form.mainVideoUrl || form.videoUrl}
                </p>
              )}
            </div>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setMainVideoFile(e.target.files?.[0] || null)}
              className={fileInputClass}
            />

            <button
              type="button"
              onClick={() => uploadVideoAsset("main")}
              disabled={videoUploading === "main"}
              className={`${quietUploadButton} w-full`}
            >
              {videoUploading === "main"
                ? "Uploading..."
                : "Upload New Main Video"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-white/60">
              Trailer
            </label>

            <div className="mt-2 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-bold text-white/45">
                {form.trailerUrl ? "Trailer attached" : "No trailer attached"}
              </p>

              {form.trailerUrl && (
                <p className="mt-2 break-all text-[10px] text-white/25">
                  {form.trailerUrl}
                </p>
              )}
            </div>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setTrailerVideoFile(e.target.files?.[0] || null)}
              className={fileInputClass}
            />

            <button
              type="button"
              onClick={() => uploadVideoAsset("trailer")}
              disabled={videoUploading === "trailer"}
              className={`${quietUploadButton} w-full`}
            >
              {videoUploading === "trailer"
                ? "Uploading..."
                : "Upload New Trailer"}
            </button>
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

            <p className="mt-2 text-white/50">
              Control title visibility, approval status, and scheduled
              premieres.
            </p>
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

          <div>
            <label className="block text-sm font-bold text-white/60">
              Workflow Stage
            </label>

            <select
              value={form.workflowStage || "submission"}
              onChange={(e) => updateField("workflowStage", e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-3"
            >
              <option value="submission">Submission</option>
              <option value="metadata_review">Metadata Review</option>
              <option value="content_review">Content Review</option>
              <option value="rights_review">Rights Review</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

<div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
  <h2 className="mb-6 text-xl font-black text-white">
    Partner Communications
  </h2>
    <div className="grid gap-4">
    <Field label="Partner">
      <div className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-semibold text-white/70">
        {form.creatorName ||
  form.creatorCompany ||
  "Unknown Partner"}

{form.creatorEmail && (
  <div className="mt-1 text-white/40">
    {form.creatorEmail}
  </div>
)}
      </div>
    </Field>

    <Field label="Sender Team">
      <input
        value={messageSenderTeam}
        onChange={(e) =>
          setMessageSenderTeam(e.target.value)
        }
        className="input"
      />
    </Field>

    <Field label="Subject">
      <input
        value={messageSubject}
        onChange={(e) =>
          setMessageSubject(e.target.value)
        }
        className="input"
      />
    </Field>

    <Field label="Message">
      <textarea
        value={messageBody}
        onChange={(e) =>
          setMessageBody(e.target.value)
        }
        className="min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-sm leading-7 text-white outline-none focus:border-sky-300/60"
      />
    </Field>

    <div className="flex justify-end">
      <button
        type="button"
        onClick={sendPartnerMessage}
        disabled={sendingMessage}
        className="rounded-xl bg-sky-400 px-5 py-3 text-xs font-black text-black transition hover:bg-sky-300 disabled:opacity-40"
      >
        {sendingMessage
          ? "Sending..."
          : "Send Message"}
      </button>
        </div>
  </div>
</div>

          <div className="relative">
            <label className="block text-sm font-bold text-white/60">
              Premiere Date
            </label>

            <button
              type="button"
              onClick={() => {
                setCalendarOpen((current) => !current);
                setTimeOpen(false);
              }}
              className="mt-2 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black px-4 py-3 text-left font-bold text-white/80 transition hover:border-sky-300/40"
            >
              <span>{formatScheduledDate(form.scheduledAt)}</span>
              <span className="text-white/35">▾</span>
            </button>

            {calendarOpen && (
              <div className="absolute left-0 top-full z-50 mt-3 w-full rounded-3xl border border-white/10 bg-zinc-950 p-4 shadow-2xl md:w-[360px]">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth() - 1,
                          1
                        )
                      )
                    }
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-white/60 hover:text-white"
                  >
                    ←
                  </button>

                  <p className="font-black">
                    {monthNames[calendarMonth.getMonth()]}{" "}
                    {calendarMonth.getFullYear()}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(
                        new Date(
                          calendarMonth.getFullYear(),
                          calendarMonth.getMonth() + 1,
                          1
                        )
                      )
                    }
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-white/60 hover:text-white"
                  >
                    →
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/35"
                    >
                      {day}
                    </div>
                  ))}

                  {calendarDays.map((day, index) => {
                    const selected =
                      day && selectedDate ? sameDay(day, selectedDate) : false;

                    return (
                      <button
                        key={index}
                        type="button"
                        disabled={!day}
                        onClick={() => day && selectScheduleDate(day)}
                        className={`aspect-square rounded-full text-sm font-black transition disabled:pointer-events-none disabled:opacity-0 ${
                          selected
                            ? "bg-sky-400 text-black"
                            : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {day?.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-white/60">
              Premiere Time
            </label>

            <button
              type="button"
              onClick={() => {
                setTimeOpen((current) => !current);
                setCalendarOpen(false);
              }}
              className="mt-2 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black px-4 py-3 text-left font-bold text-white/80 transition hover:border-sky-300/40"
            >
              <span>{formatScheduledTime(form.scheduledAt)}</span>
              <span className="text-white/35">▾</span>
            </button>

            {timeOpen && (
              <div className="absolute left-0 top-full z-50 mt-3 max-h-72 w-full overflow-y-auto rounded-3xl border border-white/10 bg-zinc-950 p-2 shadow-2xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {timeOptions.map((option) => {
                  const currentValue = selectedDate
                    ? `${String(selectedDate.getHours()).padStart(
                        2,
                        "0"
                      )}:${String(selectedDate.getMinutes()).padStart(2, "0")}`
                    : "";

                  const selected = currentValue === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectScheduleTime(option.value)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                        selected
                          ? "bg-sky-400 text-black"
                          : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
              Scheduled Release
            </p>

            <p className="mt-2 text-sm font-bold text-white/70">
              {form.scheduledAt
                ? new Date(form.scheduledAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Not scheduled"}
            </p>

            {form.scheduledAt && (
              <button
                type="button"
                onClick={() => updateField("scheduledAt", "")}
                className="mt-3 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-black text-white/55 transition hover:border-red-300/40 hover:text-red-200"
              >
                Clear Schedule
              </button>
            )}
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

function EditorPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl">
      <h2 className="mb-6 text-xl font-black text-white">
        {title}
      </h2>

      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-white/60">
        {label}
      </span>

      {children}
    </label>
  );
}