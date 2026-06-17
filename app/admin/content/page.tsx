"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

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
  cardArtUrl?: string | null;
  titleLogoUrl?: string | null;
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
  if (stage === "published")
    return "border-emerald-300/40 bg-emerald-300/12 text-emerald-200";
  if (stage === "rejected")
    return "border-red-400/40 bg-red-500/12 text-red-200";
  if (stage === "archived")
    return "border-zinc-400/30 bg-zinc-400/10 text-zinc-200";
  if (stage === "rights_review")
    return "border-purple-300/40 bg-purple-400/12 text-purple-200";
  if (stage === "content_review")
    return "border-blue-300/40 bg-blue-400/12 text-blue-200";
  if (stage === "metadata_review")
    return "border-orange-300/40 bg-orange-400/12 text-orange-200";
  if (stage === "scheduled")
    return "border-sky-300/45 bg-sky-300/12 text-sky-200";
  if (stage === "approved")
    return "border-emerald-300/35 bg-emerald-300/10 text-emerald-200";

  return "border-yellow-300/40 bg-yellow-300/12 text-yellow-100";
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
        item.creatorCompany?.toLowerCase().includes(cleanSearch) ||
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

  const stats = useMemo(() => {
    const inReview = content.filter((item) =>
      [
        "submission",
        "metadata_review",
        "content_review",
        "rights_review",
      ].includes(item.workflowStage)
    ).length;

    return [
      { label: "Total Titles", value: content.length },
      {
        label: "Published",
        value: content.filter((item) => item.workflowStage === "published")
          .length,
      },
      { label: "In Review", value: inReview },
      { label: "Featured", value: content.filter((item) => item.featured).length },
    ];
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
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
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

          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/review"
              className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white/65 backdrop-blur-xl transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200"
            >
              Review Queue
            </Link>

            <Link
              href="/admin/upload"
              className="rounded-md bg-sky-400 px-4 py-2.5 text-xs font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.3)] transition hover:bg-sky-300"
            >
              Upload Title
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-3 md:grid-cols-4">
          {stats.map((stat) => (
            <AdminStat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </section>

        <section className="mt-7 rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-3 shadow-2xl backdrop-blur-xl md:p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, partner, genre, email, recognition..."
              className="min-h-12 flex-1 rounded-xl border border-white/10 bg-black/45 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/30 focus:border-sky-300/60 md:rounded-2xl"
            />

            <button
              onClick={loadContent}
              className="rounded-xl border border-white/10 bg-black/35 px-5 py-3 text-xs font-black text-white/65 transition hover:border-sky-300/45 hover:bg-sky-300/10 hover:text-sky-200 md:rounded-2xl"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 flex gap-5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const active = activeFilter === filter.value;

              return (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`shrink-0 border-b-2 pb-2 text-[11px] font-black uppercase tracking-[0.15em] transition ${
                    active
                      ? "border-sky-300 text-sky-300"
                      : "border-transparent text-white/38 hover:text-white/72"
                  }`}
                >
                  {filter.label} ({counts[filter.value] || 0})
                </button>
              );
            })}
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
              const expanded = expandedId === item.id;
              const artwork =
                item.cardArtUrl || item.backdropUrl || item.thumbnailUrl || "";

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.65rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition hover:border-sky-300/20"
                >
                  <div className="grid gap-0 md:grid-cols-[230px_1fr]">
                    <div
                      className="relative min-h-[210px] bg-zinc-950 bg-cover bg-center md:min-h-full"
                      style={{
                        backgroundImage: artwork
                          ? `linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.2)), url(${artwork})`
                          : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, black, #020617)",
                      }}
                    >
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] backdrop-blur-xl ${stageBadgeClass(
                            stage
                          )}`}
                        >
                          {stageLabels[stage] || stage.replaceAll("_", " ")}
                        </span>

                        {item.featured && (
                          <span className="rounded-full border border-sky-300/45 bg-sky-300/14 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-sky-100 backdrop-blur-xl">
                            Featured
                          </span>
                        )}

                        {item.recognitionLevel && (
                          <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/75 backdrop-blur-xl">
                            {item.recognitionLevel}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
                          {item.type || "Title"}{" "}
                          {item.genre ? `• ${item.genre}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex flex-col justify-between gap-5 md:flex-row">
                        <div className="min-w-0">
                          <h2 className="text-2xl font-black md:text-4xl">
                            {item.title}
                          </h2>

                          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/58">
                            {item.description || "No description provided."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-white/45">
                            <span>Partner: {item.creatorName || "Unknown"}</span>
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
                            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
                          >
                            Preview
                          </Link>

                          <Link
                            href={`/admin/content/${item.id}/edit`}
                            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
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
                            className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-sm font-bold text-white outline-none focus:border-sky-300 md:max-w-xs"
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
                            Assign SourceTV Selection, Featured Selection,
                            Editor&apos;s Selection, or Premier Selection.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <ActionButton
                          disabled={saving || stage === "published"}
                          onClick={() =>
                            updateContent(item.id, { action: "move_forward" })
                          }
                          variant="primary"
                        >
                          {saving ? "Saving..." : "Move Forward"}
                        </ActionButton>

                        <ActionButton
                          disabled={saving}
                          onClick={() =>
                            updateContent(item.id, { action: "publish" })
                          }
                          variant="green"
                        >
                          Publish
                        </ActionButton>

                        <ActionButton
                          disabled={saving}
                          onClick={() =>
                            updateContent(item.id, {
                              action: item.featured ? "unfeature" : "feature",
                            })
                          }
                          variant="blue"
                        >
                          {item.featured ? "Unfeature" : "Feature"}
                        </ActionButton>

                        <ActionButton
                          disabled={saving}
                          onClick={() =>
                            updateContent(item.id, { action: "archive" })
                          }
                          variant="default"
                        >
                          Archive
                        </ActionButton>

                        <ActionButton
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
                          variant="purple"
                        >
                          Message
                        </ActionButton>

                        <ActionButton
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
                          variant="red"
                        >
                          Reject
                        </ActionButton>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(expanded ? null : item.id)
                          }
                          className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black text-white/50 transition hover:border-white/25 hover:text-white"
                        >
                          {expanded ? "Hide Details" : "Details"}
                        </button>
                      </div>

                      <div
                        className={`grid transition-all duration-300 ${
                          expanded
                            ? "mt-6 grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 md:grid-cols-3">
                            <DetailBlock
                              title="Rights"
                              lines={[
                                `Owner: ${item.rightsOwner || "Not set"}`,
                                `Contact: ${item.rightsContact || "Not set"}`,
                                `Territories: ${
                                  item.territories || "Not set"
                                }`,
                                `Exclusivity: ${item.exclusivity || "Not set"}`,
                              ]}
                            />

                            <DetailBlock
                              title="License"
                              lines={[
                                `Type: ${item.licenseType || "Not set"}`,
                                `Start: ${formatDate(item.licenseStartDate)}`,
                                `End: ${formatDate(item.licenseEndDate)}`,
                                `Revenue Share: ${item.revenueShare ?? 50}%`,
                              ]}
                            />

                            <DetailBlock
                              title="Review Notes"
                              lines={[
                                item.metadataNotes
                                  ? `Metadata: ${item.metadataNotes}`
                                  : "Metadata: none",
                                item.contentNotes
                                  ? `Content: ${item.contentNotes}`
                                  : "Content: none",
                                item.rightsNotes
                                  ? `Rights: ${item.rightsNotes}`
                                  : "Rights: none",
                                item.reviewNotes
                                  ? `General: ${item.reviewNotes}`
                                  : "General: none",
                              ]}
                            />
                          </div>
                        </div>
                      </div>
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

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
        {label}
      </p>

      <p className="mt-2 line-clamp-2 text-sm font-bold text-white/70">
        {value}
      </p>
    </div>
  );
}

function DetailBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
        {title}
      </p>

      <div className="mt-3 space-y-2 text-xs leading-5 text-white/48">
        {lines.map((line, index) => (
          <p key={`${title}-${index}`}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  disabled,
  onClick,
  variant,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  variant: "primary" | "green" | "blue" | "purple" | "red" | "default";
}) {
  const classes: Record<typeof variant, string> = {
    primary:
      "bg-sky-400 text-black hover:bg-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.22)]",
    green:
      "border border-green-300/30 bg-green-300/10 text-green-200 hover:border-green-300/60",
    blue:
      "border border-sky-300/30 bg-sky-300/10 text-sky-200 hover:border-sky-300/60",
    purple:
      "border border-purple-400/30 bg-purple-500/10 text-purple-300 hover:border-purple-400/60",
    red:
      "border border-red-400/30 bg-red-500/10 text-red-300 hover:border-red-400/60",
    default:
      "border border-white/15 bg-white/[0.04] text-white/60 hover:border-white/30 hover:text-white",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-35 ${classes[variant]}`}
    >
      {children}
    </button>
  );
}