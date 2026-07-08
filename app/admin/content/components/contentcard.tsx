"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type PartnerMessage = {
  id: string;
  senderTeam: string;
  subject: string;
  body: string;
  isRead?: boolean;
  createdAt: string;
};

export type ContentItem = {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  genre?: string | null;
  cardArtUrl?: string | null;
  backdropUrl?: string | null;
  thumbnailUrl?: string | null;
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
  recognitionLevel?: string | null;
  scheduledAt?: string | null;
  views?: number | null;
  partnerMessages?: PartnerMessage[];
};

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

export default function ContentCard({
  item,
  saving,
  expanded,
  onToggleDetails,
  updateContent,
  openMessageModal,
  openRejectModal,
}: {
  item: ContentItem;
  saving: boolean;
  expanded: boolean;
  onToggleDetails: () => void;
  updateContent: (id: string, body: any) => Promise<void>;
  openMessageModal: (item: ContentItem) => void;
  openRejectModal: (item: ContentItem) => void;
}) {
  const stage = item.workflowStage || "submission";
  const artwork = item.cardArtUrl || item.backdropUrl || item.thumbnailUrl || "";
  const messageHistory = [...(item.partnerMessages || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.045]">
      <div className="grid gap-0 md:grid-cols-[220px_1fr]">
        <div
          className="relative min-h-[190px] bg-[#05070d] bg-cover bg-center md:min-h-full"
          style={{
            backgroundImage: artwork
              ? `linear-gradient(to top, rgba(5,7,13,0.92), rgba(5,7,13,0.2)), url(${artwork})`
              : "linear-gradient(to right, #05070d, #05070d)",
          }}
        >
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge stage={stage}>{stageLabels[stage] || stage}</Badge>

            {item.featured && <Badge stage="featured">Featured</Badge>}

            {messageHistory.length > 0 && (
              <Badge stage="messages">{messageHistory.length} Msg</Badge>
            )}
          </div>

          <p className="absolute bottom-4 left-4 right-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
            {item.type || "Title"} {item.genre ? `· ${item.genre}` : ""}
          </p>
        </div>

        <div className="p-5">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                {item.title}
              </h2>

              <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/50">
                {item.description || "No description provided."}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-white/40">
                <span>Partner: {item.creatorName || "Unknown"}</span>
                {item.creatorEmail && <span>· {item.creatorEmail}</span>}
                {item.runtime && <span>· {item.runtime}</span>}
                {item.maturityRating && <span>· {item.maturityRating}</span>}
              </div>
            </div>

            <div className="flex shrink-0 flex-row gap-2 md:flex-col">
              <Link href={`/watch/${item.id}?preview=admin`} className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-center text-xs font-semibold text-white/60 transition hover:bg-white/[0.055] hover:text-white">
                Preview
              </Link>

              <Link href={`/admin/content/${item.id}`} className="rounded-xl bg-sky-300 px-4 py-2 text-center text-xs font-semibold text-[#05070d] transition hover:bg-sky-200">
                Review
              </Link>

              <Link href={`/admin/content/${item.id}/edit`} className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-center text-xs font-semibold text-white/60 transition hover:bg-white/[0.055] hover:text-white">
                Edit
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoBox label="Current Stage" value={stageLabels[stage] || stage} />
            <InfoBox label="Schedule" value={formatDate(item.scheduledAt)} />
            <InfoBox
              label="Partner"
              value={item.creatorCompany || item.creatorName || item.creatorEmail || "Unknown"}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <ActionButton
              disabled={saving || stage === "published"}
              onClick={() => updateContent(item.id, { action: "move_forward" })}
              variant="primary"
            >
              {saving ? "Saving..." : "Move Forward"}
            </ActionButton>

            <ActionButton disabled={saving} onClick={() => updateContent(item.id, { action: "publish" })} variant="green">
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

            <ActionButton disabled={saving} onClick={() => updateContent(item.id, { action: "archive" })} variant="default">
              Archive
            </ActionButton>

            <ActionButton disabled={saving} onClick={() => openMessageModal(item)} variant="purple">
              Message
            </ActionButton>

            <ActionButton disabled={saving} onClick={() => openRejectModal(item)} variant="red">
              Reject
            </ActionButton>

            <button
              type="button"
              onClick={onToggleDetails}
              className="rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-2 text-xs font-semibold text-white/55 transition hover:border-white/20 hover:bg-white/[0.055] hover:text-white"
            >
              {expanded ? "Hide Details" : "Details"}
            </button>
          </div>

          {expanded && (
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:grid-cols-3">
                <DetailBlock
                  title="Rights"
                  lines={[
                    `Owner: ${item.rightsOwner || "Not set"}`,
                    `Contact: ${item.rightsContact || "Not set"}`,
                    `Territories: ${item.territories || "Not set"}`,
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
                    item.metadataNotes ? `Metadata: ${item.metadataNotes}` : "Metadata: none",
                    item.contentNotes ? `Content: ${item.contentNotes}` : "Content: none",
                    item.rightsNotes ? `Rights: ${item.rightsNotes}` : "Rights: none",
                    item.reviewNotes ? `General: ${item.reviewNotes}` : "General: none",
                  ]}
                />
              </div>

              <MessageHistoryBlock messages={messageHistory} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Badge({ stage, children }: { stage: string; children: ReactNode }) {
  let classes = "border-white/10 bg-white/[0.04] text-white/55";

  if (stage === "published" || stage === "approved") {
    classes = "border-emerald-300/30 bg-emerald-300/10 text-emerald-300";
  } else if (stage === "rejected") {
    classes = "border-red-300/30 bg-red-300/10 text-red-300";
  } else if (stage === "scheduled" || stage.includes("review")) {
    classes = "border-sky-300/30 bg-sky-300/10 text-sky-300";
  }

  return (
    <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${classes}`}>
      {children}
    </span>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="mt-1 line-clamp-2 text-sm font-medium text-white/65">
        {value}
      </p>
    </div>
  );
}

function DetailBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
        {title}
      </p>
      <div className="mt-3 space-y-2 text-xs leading-5 text-white/45">
        {lines.map((line, index) => (
          <p key={`${title}-${index}`}>{line}</p>
        ))}
      </div>
    </div>
  );
}

function MessageHistoryBlock({ messages }: { messages: PartnerMessage[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300">
          Message History
        </p>
        <p className="text-xs text-white/35">{messages.length} Total</p>
      </div>

      {messages.length === 0 ? (
        <p className="mt-4 text-sm text-white/40">
          No messages have been sent for this title yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{message.subject}</p>
                  <p className="mt-1 text-xs text-sky-300/70">{message.senderTeam}</p>
                </div>
                <p className="text-xs text-white/35">{formatDate(message.createdAt)}</p>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/50">
                {message.body}
              </p>
            </div>
          ))}
        </div>
      )}
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
  const classes = {
    primary: "bg-sky-300 text-[#05070d] hover:bg-sky-200",
    green: "border border-emerald-300/25 bg-emerald-300/10 text-emerald-300 hover:border-emerald-300/45",
    blue: "border border-sky-300/25 bg-sky-300/10 text-sky-300 hover:border-sky-300/45",
    purple: "border border-purple-300/25 bg-purple-300/10 text-purple-300 hover:border-purple-300/45",
    red: "border border-red-300/25 bg-red-300/10 text-red-300 hover:border-red-300/45",
    default: "border border-white/10 bg-white/[0.035] text-white/60 hover:border-white/20 hover:bg-white/[0.055] hover:text-white",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${classes[variant]}`}
    >
      {children}
    </button>
  );
}

function formatDate(date?: string | null) {
  if (!date) return "Not set";

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}