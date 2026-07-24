"use client";

import Link from "next/link";
import { useEffect } from "react";

import type { Message } from "../types";
import {
  formatDate,
  stageBadgeClass,
  stageLabel,
} from "../utils";
import ThreadBubble from "./ThreadBubble";

type ConversationModalProps = {
  message: Message | null;
  replyBody: string;
  sending: boolean;
  onClose: () => void;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
};

export default function ConversationModal({
  message,
  replyBody,
  sending,
  onClose,
  onReplyChange,
  onSendReply,
}: ConversationModalProps) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const replies = message.replies || [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-title"
        className="flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-[28px] border border-white/10 bg-[#090c13] shadow-2xl sm:h-[min(780px,90dvh)] sm:max-w-4xl sm:rounded-[28px]"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/[0.08] bg-[#0b0e16]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-sky-300">
              Conversation
            </p>

            <h2
              id="conversation-title"
              className="mt-1.5 truncate text-lg font-black text-white sm:text-xl"
            >
              {message.subject}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="text-xs font-semibold text-white/35">
                {message.senderTeam}
              </p>

              <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

              <p className="text-[10px] font-semibold text-white/25">
                Started {formatDate(message.createdAt)}
              </p>

              {message.project?.workflowStage ? (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] ${stageBadgeClass(
                    message.project.workflowStage
                  )}`}
                >
                  {stageLabel(
                    message.project.workflowStage
                  )}
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close conversation"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-lg text-white/55 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            ×
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-3xl">
            {message.project ? (
              <Link
                href={`/partner/projects/${message.project.id}`}
                className="group mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3.5 transition hover:border-sky-300/25 hover:bg-sky-300/[0.035] sm:flex-row sm:items-center"
              >
                <div className="min-w-0">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">
                    Related Project
                  </p>

                  <p className="mt-1.5 truncate text-sm font-black text-white">
                    {message.project.title}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] ${stageBadgeClass(
                        message.project.workflowStage
                      )}`}
                    >
                      {stageLabel(
                        message.project.workflowStage
                      )}
                    </span>

                    {message.project
                      .recognitionLevel ? (
                      <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-sky-200">
                        {
                          message.project
                            .recognitionLevel
                        }
                      </span>
                    ) : null}
                  </div>
                </div>

                <span className="shrink-0 text-[11px] font-black text-sky-200 transition group-hover:translate-x-1">
                  Open Project →
                </span>
              </Link>
            ) : null}

            <div className="space-y-5">
              <ThreadBubble
                role="admin"
                name={message.senderTeam}
                body={message.body}
                date={message.createdAt}
              />

              {replies.map((reply) => (
                <ThreadBubble
                  key={reply.id}
                  role={reply.senderRole}
                  name={
                    reply.senderName ||
                    reply.senderEmail ||
                    reply.senderRole
                  }
                  body={reply.body}
                  date={reply.createdAt}
                />
              ))}
            </div>
          </div>
        </div>

        <footer className="shrink-0 border-t border-white/[0.08] bg-[#0b0e16]/95 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-sky-300">
                  Reply
                </p>

                <p className="mt-1 text-[10px] text-white/25">
                  Send a message to SourceTV
                </p>
              </div>

              <p className="text-[10px] text-white/20">
                {replyBody.length} characters
              </p>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <textarea
                value={replyBody}
                onChange={(event) =>
                  onReplyChange(event.target.value)
                }
                placeholder="Write your reply..."
                rows={3}
                className="min-h-[76px] flex-1 resize-none rounded-2xl border border-white/[0.09] bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 hover:border-white/15 focus:border-sky-300/35"
              />

              <button
                type="button"
                onClick={onSendReply}
                disabled={
                  sending || !replyBody.trim()
                }
                className="h-11 shrink-0 rounded-xl bg-sky-300 px-5 text-xs font-black text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending
                  ? "Sending..."
                  : "Send Reply"}
              </button>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}