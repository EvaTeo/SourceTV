"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  year?: number | null;
  videoUrl?: string | null;
  mainVideoUrl?: string | null;
  trailerUrl?: string | null;
  thumbnailUrl?: string | null;
  backdropUrl?: string | null;
  maturityRating?: string | null;
  runtime?: string | null;
  creatorName?: string | null;
  creatorEmail?: string | null;
  creatorCompany?: string | null;
  revenueShare?: number | null;
  rightsOwner?: string | null;
  rightsContact?: string | null;
  licenseType?: string | null;
  licenseStartDate?: string | null;
  licenseEndDate?: string | null;
  territories?: string | null;
  exclusivity?: string | null;
  metadataNotes?: string | null;
  contentNotes?: string | null;
  rightsNotes?: string | null;
  reviewNotes?: string | null;
  workflowStage: string;
  status?: string | null;
  featured?: boolean | null;
  featuredRank?: number | null;
  editorPick?: boolean | null;
  recognitionLevel?: string | null;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  archivedAt?: string | null;
  rejectedAt?: string | null;
  views?: number | null;
  createdAt: string;
  updatedAt: string;
};

const filters = [
  { label: "All", value: "all" },
  { label: "Submissions", value: "submission" },
  { label: "Metadata", value: "metadata_review" },
  { label: "Content", value: "content_review" },
  { label: "Rights", value: "rights_review" },
  { label: "Approved", value: "approved" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Featured", value: "featured" },
  { label: "Archived", value: "archived" },
  { label: "Rejected", value: "rejected" },
];

const recognitionLevels = [
  "",
  "SourceTV Selection",
  "Featured Selection",
  "Editor's Selection",
  "Premier Selection",
];

const stageLabels: Record<string, string> = {
  submission: "Submission",
  metadata_review: "Metadata Review",
  content_review: "Content Review",
  rights_review: "Rights Review",
  approved: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
  rejected: "Rejected",
};

function stageBadgeClass(stage: string) {
  if (stage === "published") return "bg-green-400 text-black";
  if (stage === "rejected") return "bg-red-500 text-white";
  if (stage === "archived") return "bg-zinc-500 text-white";
  if (stage === "rights_review") return "bg-purple-400 text-black";
  if (stage === "content_review") return "bg-blue-400 text-black";
  if (stage === "metadata_review") return "bg-orange-400 text-black";
  if (stage === "scheduled") return "bg-sky-400 text-black";
  if (stage === "approved") return "bg-emerald-300 text-black";
  return "bg-yellow-400 text-black";
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function loadContent() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/content", {
        cache: "no-store",
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setContent(data);
      } else {
        console.error("ADMIN CONTENT ERROR:", data);
        setContent([]);
      }
    } catch (error) {
      console.error("ADMIN CONTENT LOAD ERROR:", error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContent();
  }, []);

  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const cleanSearch = search.trim().toLowerCase();

      const matchesSearch =
        !cleanSearch ||
        item.title?.toLowerCase().includes(cleanSearch) ||
        item.description?.toLowerCase().includes(cleanSearch) ||
        item.creatorName?.toLowerCase().includes(cleanSearch) ||
        item.creatorEmail?.toLowerCase().includes(cleanSearch) ||
        item.genre?.toLowerCase().includes(cleanSearch) ||
        item.type?.toLowerCase().includes(cleanSearch) ||
        item.recognitionLevel?.toLowerCase().includes(cleanSearch);

      const matchesFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "featured"
          ? Boolean(item.featured)
          : item.workflowStage === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [content, search, activeFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {
      all: content.length,
      featured: content.filter((item) => item.featured).length,
    };

    filters.forEach((filter) => {
      if (filter.value !== "all" && filter.value !== "featured") {
        map[filter.value] = content.filter(
          (item) => item.workflowStage === filter.value
        ).length;
      }
    });

    return map;
  }, [content]);

  async function updateContent(id: string, body: any) {
    try {
      setSavingId(id);

      const res = await fetch(`/api/admin/content/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update content");
      }

      await loadContent();
    } catch (error) {
      console.error("UPDATE CONTENT ERROR:", error);
      alert("Could not update this title. Check the console.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            SourceTV Operations
          </p>

          <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
            Content Control Center
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
            Manage submissions, metadata review, content review, rights,
            scheduling, publishing, featuring, recognition, and archive
            decisions.
          </p>
        </div>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl md:p-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, partner, genre, email, recognition..."
            className="w-full rounded-full border border-white/10 bg-black/45 px-5 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-sky-300 md:px-6 md:py-4"
          />

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition md:px-5 md:py-3 ${
                  activeFilter === filter.value
                    ? "border-sky-300 bg-sky-400 text-black shadow-[0_0_24px_rgba(56,189,248,0.35)]"
                    : "border-white/10 bg-white/[0.04] text-white/55 hover:border-sky-300/40 hover:text-sky-200"
                }`}
              >
                {filter.label} ({counts[filter.value] || 0})
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            Loading admin content...
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-10 text-white/50">
            No titles found for this view.
          </div>
        ) : (
          <section className="mt-8 grid gap-5">
            {filteredContent.map((item) => {
              const saving = savingId === item.id;
              const stage = item.workflowStage || "submission";

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-2xl backdrop-blur-xl"
                >
                  <div className="grid gap-0 md:grid-cols-[250px_1fr]">
                    <div
                      className="relative min-h-[220px] bg-zinc-950 bg-cover bg-center md:min-h-full"
                      style={{
                        backgroundImage:
                          item.backdropUrl || item.thumbnailUrl
                            ? `linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.2)), url(${
                                item.backdropUrl || item.thumbnailUrl
                              })`
                            : undefined,
                      }}
                    >
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${stageBadgeClass(
                            stage
                          )}`}
                        >
                          {stageLabels[stage] || stage.replaceAll("_", " ")}
                        </span>

                        {item.featured && (
                          <span className="rounded-full bg-sky-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                            Featured
                          </span>
                        )}

                        {item.recognitionLevel && (
                          <span className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-xl">
                            {item.recognitionLevel}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                          {item.type || "Title"}{" "}
                          {item.genre ? `• ${item.genre}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 md:p-7">
                      <div className="flex flex-col justify-between gap-5 md:flex-row">
                        <div>
                          <h2 className="text-2xl font-black md:text-4xl">
                            {item.title}
                          </h2>

                          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/58">
                            {item.description || "No description provided."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-white/45">
                            <span>
                              Partner: {item.creatorName || "Unknown"}
                            </span>
                            {item.creatorEmail && (
                              <span>• {item.creatorEmail}</span>
                            )}
                            {item.runtime && <span>• {item.runtime}</span>}
                            {item.maturityRating && (
                              <span>• {item.maturityRating}</span>
                            )}
                            <span>• Internal views: {item.views || 0}</span>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-row gap-2 md:flex-col">
                          <Link
                            href={`/watch/${item.id}?preview=admin`}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:text-sky-200"
                          >
                            View
                          </Link>

                          <Link
                            href={`/admin/content/${item.id}/edit`}
                            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:text-sky-200"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-4">
                        <InfoBox
                          label="Rights"
                          value={item.rightsOwner || "Rights not verified"}
                        />
                        <InfoBox
                          label="License Window"
                          value={`${formatDate(
                            item.licenseStartDate
                          )} → ${formatDate(item.licenseEndDate)}`}
                        />
                        <InfoBox
                          label="Schedule"
                          value={formatDate(item.scheduledAt)}
                        />
                        <InfoBox
                          label="Recognition"
                          value={item.recognitionLevel || "Not assigned"}
                        />
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
                          Recognition Level
                        </p>

                        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                          <select
                            disabled={saving}
                            value={item.recognitionLevel || ""}
                            onChange={(e) =>
                              updateContent(item.id, {
                                recognitionLevel: e.target.value || null,
                              })
                            }
                            className="w-full rounded-full border border-white/10 bg-black/60 px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-300 md:max-w-xs"
                          >
                            <option value="">No Recognition</option>
                            {recognitionLevels
                              .filter((level) => level !== "")
                              .map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                          </select>

                          <p className="text-xs leading-5 text-white/40">
                            Use this to assign SourceTV Selection, Featured
                            Selection, Editor&apos;s Selection, or Premier
                            Selection.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <button
                          disabled={saving || stage === "published"}
                          onClick={() =>
                            updateContent(item.id, { action: "move_forward" })
                          }
                          className="rounded-full bg-sky-400 px-4 py-2 text-xs font-black text-black transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          {saving ? "Saving..." : "Move Forward"}
                        </button>

                        <button
                          disabled={saving}
                          onClick={() =>
                            updateContent(item.id, { action: "publish" })
                          }
                          className="rounded-full border border-green-300/30 bg-green-300/10 px-4 py-2 text-xs font-black text-green-200 transition hover:border-green-300/60"
                        >
                          Publish
                        </button>

                        <button
                          disabled={saving}
                          onClick={() =>
                            updateContent(item.id, {
                              action: item.featured ? "unfeature" : "feature",
                            })
                          }
                          className="rounded-full border border-sky-300/30 bg-sky-300/10 px-4 py-2 text-xs font-black text-sky-200 transition hover:border-sky-300/60"
                        >
                          {item.featured ? "Unfeature" : "Feature"}
                        </button>

                        <button
                          disabled={saving}
                          onClick={() =>
                            updateContent(item.id, { action: "archive" })
                          }
                          className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-black text-white/60 transition hover:border-white/30 hover:text-white"
                        >
                          Archive
                        </button>

                        <button
                          disabled={saving}
                          onClick={() => {
                            const senderTeam =
                              window.prompt(
                                "Team Name",
                                "SourceTV Programming Team"
                              ) || "SourceTV Programming Team";

                            const subject =
                              window.prompt(
                                "Subject",
                                "Message From SourceTV"
                              ) || "Message From SourceTV";

                            const message = window.prompt("Message") || "";

                            if (!message.trim()) return;

                            updateContent(item.id, {
                              action: "send_message",
                              senderTeam,
                              subject,
                              message,
                            });
                          }}
                          className="rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-xs font-black text-purple-300 transition hover:border-purple-400/60"
                        >
                          Send Message
                        </button>

                        <button
                          disabled={saving}
                          onClick={() => {
                            const note = window.prompt(
                              "Why is this title being rejected?"
                            );

                            updateContent(item.id, {
                              action: "reject",
                              reviewNotes: note || item.reviewNotes || "",
                            });
                          }}
                          className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-black text-red-300 transition hover:border-red-400/60"
                        >
                          Reject
                        </button>
                      </div>

                      {(item.metadataNotes ||
                        item.contentNotes ||
                        item.rightsNotes ||
                        item.reviewNotes) && (
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
                          <p className="text-xs font-black uppercase tracking-[0.25em] text-sky-300">
                            Review Notes
                          </p>

                          <div className="mt-3 space-y-2 text-sm text-white/55">
                            {item.metadataNotes && (
                              <p>Metadata: {item.metadataNotes}</p>
                            )}
                            {item.contentNotes && (
                              <p>Content: {item.contentNotes}</p>
                            )}
                            {item.rightsNotes && (
                              <p>Rights: {item.rightsNotes}</p>
                            )}
                            {item.reviewNotes && (
                              <p>General: {item.reviewNotes}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>
      <p className="mt-2 text-sm font-bold text-white/70">{value}</p>
    </div>
  );
}