"use client";

import type { Message } from "../types";
import {
  formatShortDate,
  stageBadgeClass,
  stageLabel,
} from "../utils";

type MessageCardProps = {
  message: Message;
  expanded: boolean;
  replyBody: string;
  sending: boolean;
  onOpen: () => void;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
};

export default function MessageCard({
  message,
  expanded,
  onOpen,
}: MessageCardProps) {
  const replies = message.replies || [];

  const latestContent =
    replies.length > 0
      ? replies[replies.length - 1].body
      : message.body;

  const initials = message.senderTeam
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={`overflow-hidden rounded-2xl border transition ${
        expanded
          ? "border-sky-300/35 bg-sky-300/[0.055]"
          : !message.isRead
            ? "border-sky-300/20 bg-sky-300/[0.035]"
            : "border-white/[0.08] bg-black/20"
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group w-full px-4 py-4 text-left transition hover:bg-white/[0.03] sm:px-5"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-[11px] font-black ${
                expanded
                  ? "border-sky-300/30 bg-sky-300/10 text-sky-100"
                  : "border-white/10 bg-white/[0.045] text-sky-200"
              }`}
            >
              {initials}
            </div>

            {!message.isRead ? (
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#080b12] bg-sky-300 shadow-[0_0_10px_rgba(125,211,252,0.55)]" />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3
                    className={`truncate text-[15px] text-white ${
                      message.isRead
                        ? "font-bold"
                        : "font-black"
                    }`}
                  >
                    {message.subject}
                  </h3>

                  {!message.isRead ? (
                    <span className="rounded-full bg-sky-300 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-black">
                      New
                    </span>
                  ) : null}

                  {replies.length > 0 ? (
                    <span className="text-[10px] font-bold text-white/30">
                      {replies.length}{" "}
                      {replies.length === 1
                        ? "reply"
                        : "replies"}
                    </span>
                  ) : null}
                </div>

                <p className="mt-1 text-xs font-semibold text-white/35">
                  {message.senderTeam}
                </p>
              </div>

              <p className="shrink-0 text-[11px] font-semibold text-white/28">
                {formatShortDate(message.createdAt)}
              </p>
            </div>

            <p className="mt-2 line-clamp-2 max-w-3xl text-[13px] leading-5 text-white/43">
              {latestContent}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {message.project?.workflowStage ? (
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.11em] ${stageBadgeClass(
                      message.project.workflowStage
                    )}`}
                  >
                    {stageLabel(
                      message.project.workflowStage
                    )}
                  </span>
                ) : null}

                {message.project?.title ? (
                  <span className="max-w-[260px] truncate text-[10px] font-semibold text-white/25">
                    {message.project.title}
                  </span>
                ) : null}
              </div>

              <span className="shrink-0 text-[11px] font-black text-sky-200/65 transition group-hover:translate-x-0.5 group-hover:text-sky-100">
                Open Conversation →
              </span>
            </div>
          </div>
        </div>
      </button>
    </article>
  );
}