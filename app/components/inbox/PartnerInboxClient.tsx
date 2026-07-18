"use client";

import { useEffect, useMemo, useState } from "react";

import InboxFilters from "@/app/components/inbox/InboxFilters";
import InboxStats from "@/app/components/inbox/InboxStats";
import RelatedProjectCard from "@/app/components/inbox/RelatedProjectCard";
import ThreadBubble from "@/app/components/inbox/ThreadBubble";
import WorkflowBadge from "@/app/components/inbox/WorkflowBadge";

type Reply = {
  id: string;
  senderRole: string;
  senderName?: string | null;
  senderEmail?: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
};

type Message = {
  id: string;
  subject: string;
  body: string;
  senderTeam: string;
  isRead: boolean;
  createdAt: string;
  replies?: Reply[];
  project?: {
    id: string;
    title: string;
    workflowStage: string;
    recognitionLevel?: string | null;
  } | null;
};

type Filter = "all" | "unread" | "read";

function formatDate(date: string) {
  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default function PartnerInboxClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [replyBodies, setReplyBodies] = useState<Record<string, string>>({});
  const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);

  async function loadMessages() {
    try {
      setLoading(true);

      const response = await fetch("/api/partner/messages", {
        cache: "no-store",
      });

      if (response.status === 401 || response.status === 403) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.status}`);
      }

      const data = await response.json();

      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("PARTNER MESSAGE LOAD ERROR:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function openMessage(message: Message) {
    const opening = selectedMessage !== message.id;

    setSelectedMessage(opening ? message.id : null);

    if (!opening || message.isRead) {
      return;
    }

    try {
      const response = await fetch("/api/partner/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: message.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark message as read");
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === message.id
            ? {
                ...item,
                isRead: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error("MARK READ ERROR:", error);
    }
  }

  async function sendReply(messageId: string) {
    const body = replyBodies[messageId]?.trim();

    if (!body) {
      return;
    }

    try {
      setSendingReplyId(messageId);

      const response = await fetch(
        `/api/partner/messages/${messageId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      const newReply = await response.json();

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                replies: [...(message.replies || []), newReply],
              }
            : message
        )
      );

      setReplyBodies((current) => ({
        ...current,
        [messageId]: "",
      }));
    } catch (error) {
      console.error("SEND REPLY ERROR:", error);
      alert("Reply could not be sent. Please try again.");
    } finally {
      setSendingReplyId(null);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.isRead).length,
    [messages]
  );

  const readCount = messages.length - unreadCount;

  const filteredMessages = useMemo(() => {
    if (activeFilter === "unread") {
      return messages.filter((message) => !message.isRead);
    }

    if (activeFilter === "read") {
      return messages.filter((message) => message.isRead);
    }

    return messages;
  }, [activeFilter, messages]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">
            SourceTV Partner Studio
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
            Inbox
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Read messages from SourceTV review, rights, publishing, and partner
            operations teams.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          disabled={loading}
          className="w-fit rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-black text-white/65 transition hover:border-sky-300/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Inbox"}
        </button>
      </header>

      <InboxStats
        stats={[
          {
            label: "Total Messages",
            value: messages.length,
          },
          {
            label: "Unread",
            value: unreadCount,
          },
          {
            label: "Read",
            value: readCount,
          },
        ]}
      />

      <InboxFilters
        filters={[
          {
            label: "All",
            value: "all",
            count: messages.length,
          },
          {
            label: "Unread",
            value: "unread",
            count: unreadCount,
          },
          {
            label: "Read",
            value: "read",
            count: readCount,
          },
        ]}
        activeFilter={activeFilter}
        onChange={(value) => setActiveFilter(value as Filter)}
      />

      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
        <div className="border-b border-white/10 pb-5">
          <h2 className="text-xl font-black">Messages</h2>

          <p className="mt-1 text-sm text-white/38">
            {loading
              ? "Loading communications..."
              : `${filteredMessages.length} ${
                  filteredMessages.length === 1 ? "message" : "messages"
                }`}
          </p>
        </div>

        <div className="mt-5">
          {loading ? (
            <LoadingState />
          ) : messages.length === 0 ? (
            <EmptyInbox />
          ) : filteredMessages.length === 0 ? (
            <EmptyFilter />
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  expanded={selectedMessage === message.id}
                  replyBody={replyBodies[message.id] || ""}
                  sending={sendingReplyId === message.id}
                  onOpen={() => openMessage(message)}
                  onReplyChange={(value) =>
                    setReplyBodies((current) => ({
                      ...current,
                      [message.id]: value,
                    }))
                  }
                  onSendReply={() => sendReply(message.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MessageCard({
  message,
  expanded,
  replyBody,
  sending,
  onOpen,
  onReplyChange,
  onSendReply,
}: {
  message: Message;
  expanded: boolean;
  replyBody: string;
  sending: boolean;
  onOpen: () => void;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
}) {
  const replies = message.replies || [];

  const preview =
    replies.length > 0 ? replies[replies.length - 1].body : message.body;

  return (
    <article
      className={`overflow-hidden rounded-2xl border transition ${
        !message.isRead
          ? "border-sky-300/25 bg-sky-300/[0.045]"
          : "border-white/10 bg-black/20"
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full p-4 text-left transition hover:bg-white/[0.025]"
      >
        <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                message.isRead
                  ? "bg-white/15"
                  : "bg-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.8)]"
              }`}
            />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/30 text-xs font-black text-sky-200">
              {message.senderTeam
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-black text-white">
                {message.subject}
              </h3>

              {!message.isRead && (
                <span className="rounded-full bg-sky-300 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-black">
                  New
                </span>
              )}

              {replies.length > 0 && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/45">
                  {replies.length}{" "}
                  {replies.length === 1 ? "Reply" : "Replies"}
                </span>
              )}

              {message.project?.workflowStage && (
                <WorkflowBadge stage={message.project.workflowStage} />
              )}
            </div>

            <p className="mt-1 text-xs font-semibold text-white/35">
              {message.senderTeam}
            </p>

            <p className="mt-2 line-clamp-1 text-sm leading-6 text-white/40">
              {preview}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <p className="text-xs font-semibold text-white/30">
              {formatShortDate(message.createdAt)}
            </p>

            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/25 text-sm text-white/40 transition ${
                expanded ? "rotate-180" : ""
              }`}
            >
              ↓
            </span>
          </div>
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-white/10 p-5 md:p-6">
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                  Conversation
                </p>

                <h4 className="mt-2 text-xl font-black text-white">
                  {message.subject}
                </h4>
              </div>

              <p className="text-xs font-semibold text-white/35">
                {formatDate(message.createdAt)}
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <ThreadBubble
                role="admin"
                name={message.senderTeam}
                body={message.body}
                date={message.createdAt}
                isOwn={false}
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
                  isOwn={reply.senderRole === "partner"}
                />
              ))}
            </div>

            {message.project && (
              <RelatedProjectCard
                project={message.project}
                href={`/partner/projects/${message.project.id}`}
              />
            )}

            <div className="mt-5 border-t border-white/10 pt-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-300">
                Reply to SourceTV
              </p>

              <textarea
                value={replyBody}
                onChange={(event) => onReplyChange(event.target.value)}
                placeholder="Write your response..."
                rows={4}
                className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/35"
              />

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={onSendReply}
                  disabled={sending || !replyBody.trim()}
                  className="rounded-xl bg-sky-300 px-5 py-3 text-xs font-black text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-28 animate-pulse rounded-2xl border border-white/10 bg-black/20"
        />
      ))}
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10 text-xl">
        ✉
      </div>

      <h3 className="mt-5 text-xl font-black text-white">
        Your inbox is empty
      </h3>

      <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
        Messages from SourceTV review, rights, publishing, and partner
        operations teams will appear here.
      </p>
    </div>
  );
}

function EmptyFilter() {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center">
      <h3 className="text-lg font-black text-white">
        No messages in this view
      </h3>

      <p className="mt-2 text-sm text-white/40">
        Select another inbox filter to see more messages.
      </p>
    </div>
  );
}