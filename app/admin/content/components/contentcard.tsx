"use client";

import Link from "next/link";

import ActionButton from "./ActionButton";
import DetailBlock from "./DetailBlock";
import InfoBox from "./InfoBox";
import MessageHistoryBlock from "./MessageHistoryBlock";

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

type Props = {
  item: ContentItem;
  saving: boolean;
  expanded: boolean;
  messageHistory: PartnerMessage[];
  latestMessage?: PartnerMessage;
  recognitionLevels: string[];
  stageLabels: Record<string, string>;
  stageBadgeClass: (stage: string) => string;
  formatDate: (date?: string | null) => string;
  onMoveForward: () => void;
  onPublish: () => void;
  onFeature: () => void;
  onArchive: () => void;
  onRecognitionChange: (value: string) => void;
  onMessage: () => void;
  onReject: () => void;
  onToggleDetails: () => void;
};

export default function ContentCard({
  item,
  saving,
  expanded,
  messageHistory,
  latestMessage,
  recognitionLevels,
  stageLabels,
  stageBadgeClass,
  formatDate,
  onMoveForward,
  onPublish,
  onFeature,
  onArchive,
  onRecognitionChange,
  onMessage,
  onReject,
  onToggleDetails,
}: Props) {
  const stage = item.workflowStage || "submission";
  const artwork = item.cardArtUrl || item.backdropUrl || item.thumbnailUrl || "";

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:border-white/20 hover:bg-white/[0.045]">
      <div className="grid gap-0 md:grid-cols-[230px_1fr]">
        <div
          className="relative min-h-[210px] bg-zinc-950 bg-cover bg-center md:min-h-full"
          style={{
            backgroundImage: artwork
              ? `linear-gradient(to top, rgba(0,0,0,0.94), rgba(0,0,0,0.2)), url(${artwork})`
              : "linear-gradient(to right, #05070d, #05070d)",
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

            {messageHistory.length > 0 && (
              <span className="rounded-full border border-cyan-300/35 bg-cyan-300/12 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100 backdrop-blur-xl">
                {messageHistory.length} Message
                {messageHistory.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-300">
              {item.type || "Title"} {item.genre ? `• ${item.genre}` : ""}
            </p>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-col justify-between gap-5 md:flex-row">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                {item.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]">
                {[
                  "submission",
                  "metadata_review",
                  "content_review",
                  "rights_review",
                  "approved",
                  "scheduled",
                  "published",
                ].map((step, index, steps) => {
                  const currentIndex = steps.indexOf(stage);
                  const state =
                    index < currentIndex
                      ? "complete"
                      : index === currentIndex
                      ? "current"
                      : "future";

                  return (
                    <div key={step} className="flex items-center gap-2">
                      <span
                        className={
                          state === "current"
                            ? "text-sky-300"
                            : state === "complete"
                            ? "text-white/80"
                            : "text-white/25"
                        }
                      >
                        {state === "current"
                          ? "►"
                          : state === "complete"
                          ? "●"
                          : "○"}
                      </span>

                      <span
                        className={
                          state === "current"
                            ? "text-sky-300"
                            : state === "complete"
                            ? "text-white/65"
                            : "text-white/25"
                        }
                      >
                        {stageLabels[step]}
                      </span>

                      {index < steps.length - 1 && (
                        <span className="text-white/15">→</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-white/58">
                {item.description || "No description provided."}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold text-white/45">
                <span>Partner: {item.creatorName || "Unknown"}</span>

                {item.creatorEmail && <span>• {item.creatorEmail}</span>}

                {item.runtime && <span>• {item.runtime}</span>}

                {item.maturityRating && <span>• {item.maturityRating}</span>}

                {item.scheduledAt && (
                  <span>• Scheduled: {formatDate(item.scheduledAt)}</span>
                )}
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
                href={`/admin/content/${item.id}`}
                className="rounded-md bg-sky-400 px-4 py-2 text-center text-xs font-black text-black transition hover:bg-sky-300"
              >
                Review
              </Link>

              <Link
                href={`/admin/content/${item.id}/edit`}
                className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-center text-xs font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
              >
                Edit
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <InfoBox
              label="Current Stage"
              value={stageLabels[stage] || stage.replaceAll("_", " ")}
            />

            <InfoBox label="Schedule" value={formatDate(item.scheduledAt)} />

            <InfoBox
              label="Partner"
              value={
                item.creatorCompany ||
                item.creatorName ||
                item.creatorEmail ||
                "Unknown"
              }
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <ActionButton
              disabled={saving || stage === "published"}
              onClick={onMoveForward}
              variant="primary"
            >
              {saving ? "Saving..." : "Move Forward"}
            </ActionButton>

            <ActionButton
              disabled={saving}
              onClick={onPublish}
              variant="green"
            >
              Publish
            </ActionButton>

            <ActionButton disabled={saving} onClick={onFeature} variant="blue">
              {item.featured ? "Unfeature" : "Feature"}
            </ActionButton>

            <ActionButton
              disabled={saving}
              onClick={onArchive}
              variant="default"
            >
              Archive
            </ActionButton>

            <ActionButton
              disabled={saving}
              onClick={onMessage}
              variant="purple"
            >
              Message
            </ActionButton>

            <ActionButton disabled={saving} onClick={onReject} variant="red">
              Reject
            </ActionButton>

            <button
              type="button"
              onClick={onToggleDetails}
              className="rounded-md border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black text-white/50 transition hover:border-white/25 hover:text-white"
            >
              {expanded ? "Hide Details" : "Details"}
            </button>
          </div>

          <div
            className={`grid transition-all duration-300 ${
              expanded ? "mt-6 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 md:grid-cols-3">
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
                    item.metadataNotes
                      ? `Metadata: ${item.metadataNotes}`
                      : "Metadata: none",
                    item.contentNotes
                      ? `Content: ${item.contentNotes}`
                      : "Content: none",
                    item.rightsNotes ? `Rights: ${item.rightsNotes}` : "Rights: none",
                    item.reviewNotes
                      ? `General: ${item.reviewNotes}`
                      : "General: none",
                  ]}
                />
              </div>

              <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 md:grid-cols-3">
                <DetailBlock
                  title="Admin Summary"
                  lines={[
                    `Internal views: ${item.views || 0}`,
                    `Featured: ${item.featured ? "Yes" : "No"}`,
                    `Messages: ${messageHistory.length}`,
                    latestMessage
                      ? `Latest: ${latestMessage.subject}`
                      : "Latest: none",
                  ]}
                />

                <div className="md:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                    Recognition Level
                  </p>

                  <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                    <select
                      disabled={saving}
                      value={item.recognitionLevel || ""}
                      onChange={(event) =>
                        onRecognitionChange(event.target.value)
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
              </div>

              <MessageHistoryBlock messages={messageHistory} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}