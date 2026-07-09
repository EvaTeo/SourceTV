"use client";

import { formatDate, getMessageHistory, stageBadgeClass } from "./utils";
import { filters, recognitionLevels, stageLabels } from "./constants";
import ContentCard from "./components/ContentCard";
import SourceModal from "./components/SourceModal";
import MessageHistoryBlock from "./components/MessageHistoryBlock";
import ModalField from "./components/ModalField";
import DetailBlock from "./components/DetailBlock";
import InfoBox from "./components/InfoBox";
import ActionButton from "./components/ActionButton";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import MetricCard from "@/app/components/admin/MetricCard";
import Toolbar from "@/app/components/admin/Toolbar";
import SearchInput from "@/app/components/admin/SearchInput";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type PartnerMessage = {
  id: string;
  senderTeam: string;
  subject: string;
  body: string;
  isRead?: boolean;
  createdAt: string;
};

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
  partnerMessages?: PartnerMessage[];
};

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeType, setActiveType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [messageTarget, setMessageTarget] = useState<ContentItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ContentItem | null>(null);
  const [messageForm, setMessageForm] = useState({
    senderTeam: "SourceTV Programming Team",
    subject: "Message From SourceTV",
    message: "",
  });
  const [rejectReason, setRejectReason] = useState("");

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

  
  const contentTypes = useMemo(() => {
    const values = Array.from(
      new Set(
        content
          .map((item) => item.type)
          .filter(Boolean)
      )
    ).sort();

    return ["all", ...values];
  }, [content]);

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

      const matchesType =
        activeType === "all"
          ? true
          : (item.type || "").toLowerCase() === activeType.toLowerCase();

      return matchesSearch && matchesFilter && matchesType;
    });
  }, [content, search, activeFilter, activeType]);

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

  function openMessageModal(item: ContentItem) {
    setMessageTarget(item);
    setMessageForm({
      senderTeam: "SourceTV Programming Team",
      subject: "Message From SourceTV",
      message: "",
    });
  }

  function closeMessageModal() {
    if (savingId) return;

    setMessageTarget(null);
    setMessageForm({
      senderTeam: "SourceTV Programming Team",
      subject: "Message From SourceTV",
      message: "",
    });
  }

  async function sendPartnerMessage() {
    if (!messageTarget || !messageForm.message.trim()) return;

    await updateContent(messageTarget.id, {
      action: "send_message",
      senderTeam:
        messageForm.senderTeam.trim() || "SourceTV Programming Team",
      subject: messageForm.subject.trim() || "Message From SourceTV",
      message: messageForm.message.trim(),
    });

    setMessageTarget(null);
    setMessageForm({
      senderTeam: "SourceTV Programming Team",
      subject: "Message From SourceTV",
      message: "",
    });
  }

  function openRejectModal(item: ContentItem) {
    setRejectTarget(item);
    setRejectReason(item.reviewNotes || "");
  }

  function closeRejectModal() {
    if (savingId) return;

    setRejectTarget(null);
    setRejectReason("");
  }

  async function rejectContent() {
    if (!rejectTarget) return;

    await updateContent(rejectTarget.id, {
      action: "reject",
      reviewNotes: rejectReason.trim() || rejectTarget.reviewNotes || "",
    });

    setRejectTarget(null);
    setRejectReason("");
  }

  return (
   <main className="space-y-6">
  <AdminPageHeader
    eyebrow="SourceTV Operations"
    title="Content Library"
    description="Manage submissions, metadata review, content review, rights, scheduling, publishing, featuring, recognition, and archive decisions."
    actions={
      <>
        <Link
          href="/admin/review"
          className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
        >
          Review Queue
        </Link>

        <Link
          href="/admin/upload"
          className="rounded-xl bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#05070d] transition hover:bg-sky-200"
        >
          Upload Title
        </Link>
      </>
    }
  />

  <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {stats.map((stat) => (
      <MetricCard key={stat.label} label={stat.label} value={stat.value} />
    ))}
  </section>

  <Toolbar>
    <SearchInput
      value={search}
      onChange={setSearch}
      placeholder="Search title, partner, genre, email, recognition..."
    />

    <button
      onClick={loadContent}
      className="h-11 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white/65 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
    >
      Refresh
    </button>

    <button
      type="button"
      onClick={() => setShowFilters((current) => !current)}
      className="h-11 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm font-medium text-white/65 transition hover:border-sky-300/35 hover:bg-white/[0.055] hover:text-sky-300"
    >
      Filters {showFilters ? "▲" : "▼"}
    </button>
  </Toolbar>

  {showFilters && (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
        Workflow Pipeline
      </p>

      <div className="flex flex-wrap gap-2">
        {filters
          .filter(
            (filter) =>
              !["featured", "archived", "rejected", "all"].includes(
                filter.value
              )
          )
          .map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                activeFilter === filter.value
                  ? "bg-sky-300 text-[#05070d]"
                  : "bg-white/[0.035] text-white/55 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {filter.label} ({counts[filter.value] || 0})
            </button>
          ))}
      </div>

      <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
        Content Type
      </p>

      <div className="flex flex-wrap gap-2">
        {contentTypes.map((type) => (
          <button
            key={String(type)}
            type="button"
            onClick={() => setActiveType(String(type))}
            className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
              activeType === type
                ? "bg-sky-300 text-[#05070d]"
                : "bg-white/[0.035] text-white/55 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {type === "all" ? "All Types" : type}
          </button>
        ))}
      </div>

      <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
        Special States
      </p>

      <div className="flex flex-wrap gap-2">
        {filters
          .filter((filter) =>
            ["featured", "archived", "rejected"].includes(filter.value)
          )
          .map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                activeFilter === filter.value
                  ? "bg-sky-300 text-[#05070d]"
                  : "bg-white/[0.035] text-white/55 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {filter.label} ({counts[filter.value] || 0})
            </button>
          ))}
      </div>
    </section>
  )}

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
  const expanded = expandedId === item.id;
  const messageHistory = getMessageHistory(item);
  const latestMessage = messageHistory[0];

  return (
    <ContentCard
      key={item.id}
      item={item}
      saving={saving}
      expanded={expanded}
      messageHistory={messageHistory}
      latestMessage={latestMessage}
      recognitionLevels={recognitionLevels}
      stageLabels={stageLabels}
      stageBadgeClass={stageBadgeClass}
      formatDate={formatDate}
      onMoveForward={() =>
        updateContent(item.id, { action: "move_forward" })
      }
      onPublish={() =>
        updateContent(item.id, { action: "publish" })
      }
      onFeature={() =>
        updateContent(item.id, {
          action: item.featured ? "unfeature" : "feature",
        })
      }
      onArchive={() =>
        updateContent(item.id, { action: "archive" })
      }
      onRecognitionChange={(value) =>
        updateContent(item.id, {
          recognitionLevel: value || null,
        })
      }
      onMessage={() => openMessageModal(item)}
      onReject={() => openRejectModal(item)}
      onToggleDetails={() =>
        setExpandedId(expanded ? null : item.id)
      }
    />
  );
})}
          </section>
        )}
           {messageTarget && (
        <SourceModal
          title="Message Partner"
          eyebrow="SourceTV Communication"
          description={`Send a note to ${
            messageTarget.creatorCompany ||
            messageTarget.creatorName ||
            messageTarget.creatorEmail ||
            "this partner"
          } about ${messageTarget.title}.`}
          onClose={closeMessageModal}
        >
          <div className="grid gap-4">
            <ModalField label="Team Name">
              <input
                value={messageForm.senderTeam}
                onChange={(e) =>
                  setMessageForm((current) => ({
                    ...current,
                    senderTeam: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/60 focus:bg-black/70"
                placeholder="SourceTV Programming Team"
              />
            </ModalField>

            <ModalField label="Subject">
              <input
                value={messageForm.subject}
                onChange={(e) =>
                  setMessageForm((current) => ({
                    ...current,
                    subject: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/60 focus:bg-black/70"
                placeholder="Message From SourceTV"
              />
            </ModalField>

            <ModalField label="Message Body">
              <textarea
                value={messageForm.message}
                onChange={(e) =>
                  setMessageForm((current) => ({
                    ...current,
                    message: e.target.value,
                  }))
                }
                className="min-h-36 w-full resize-none rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/60 focus:bg-black/70"
                placeholder="Write the message the partner will see in their inbox..."
              />
            </ModalField>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={Boolean(savingId)}
              onClick={closeMessageModal}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black text-white/55 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={Boolean(savingId) || !messageForm.message.trim()}
              onClick={sendPartnerMessage}
              className="rounded-xl bg-sky-400 px-5 py-3 text-xs font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.28)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {savingId === messageTarget.id ? "Sending..." : "Send Message"}
            </button>
          </div>
        </SourceModal>
      )}

      {rejectTarget && (
        <SourceModal
          title="Reject Title"
          eyebrow="Review Decision"
          description={`Reject ${rejectTarget.title} and save the reason to the title review notes.`}
          onClose={closeRejectModal}
        >
          <ModalField label="Rejection Reason">
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-red-300/60 focus:bg-black/70"
              placeholder="Explain why this title is being rejected..."
            />
          </ModalField>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={Boolean(savingId)}
              onClick={closeRejectModal}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black text-white/55 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={Boolean(savingId)}
              onClick={rejectContent}
              className="rounded-xl border border-red-400/35 bg-red-500/15 px-5 py-3 text-xs font-black text-red-200 transition hover:border-red-300/70 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-35"
            >
              {savingId === rejectTarget.id ? "Rejecting..." : "Reject Title"}
            </button>
          </div>
        </SourceModal>
      )}
    </main>
  );
}