"use client";

import { useEffect, useMemo, useState } from "react";

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

const filters = ["all", "unread", "read"];

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

function stageLabel(stage?: string | null) {
  if (!stage) return "General";
  return stage.replaceAll("_", " ");
}

function stageBadgeClass(stage?: string | null) {
  if (stage === "published")
    return "border-emerald-300/35 bg-emerald-300/10 text-emerald-200";
  if (stage === "approved")
    return "border-sky-300/35 bg-sky-300/10 text-sky-200";
  if (stage === "scheduled")
    return "border-violet-300/35 bg-violet-300/10 text-violet-200";
  if (stage === "rejected")
    return "border-red-400/35 bg-red-500/10 text-red-200";
  if (stage === "rights_review")
    return "border-yellow-300/35 bg-yellow-300/10 text-yellow-100";
  if (stage === "content_review")
    return "border-blue-300/35 bg-blue-300/10 text-blue-200";
  if (stage === "metadata_review")
    return "border-cyan-300/35 bg-cyan-300/10 text-cyan-200";

  return "border-white/10 bg-white/[0.04] text-white/55";
}

export default function PartnerInboxClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [replyBodies, setReplyBodies] = useState<Record<string, string>>({});
  const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);

  async function loadMessages() {
    try {
      setLoading(true);

      const res = await fetch("/api/partner/messages", {
        cache: "no-store",
      });

      if (res.status === 403 || res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("PARTNER MESSAGE LOAD ERROR:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function openMessage(message: Message) {
    setSelectedMessage(selectedMessage === message.id ? null : message.id);

    if (message.isRead) return;

    try {
      await fetch("/api/partner/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: message.id,
        }),
      });

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

    if (!body) return;

    try {
      setSendingReplyId(messageId);

      const res = await fetch(`/api/partner/messages/${messageId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      });

      if (!res.ok) {
        throw new Error("Failed to send reply");
      }

      const newReply = await res.json();

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

  const readCount = useMemo(
    () => messages.filter((message) => message.isRead).length,
    [messages]
  );

  const filteredMessages = useMemo(() => {
    if (activeFilter === "unread") {
      return messages.filter((message) => !message.isRead);
    }

    if (activeFilter === "read") {
      return messages.filter((message) => message.isRead);
    }

    return messages;
  }, [messages, activeFilter]);

  const filterCounts = {
    all: messages.length,
    unread: unreadCount,
    read: readCount,
  };

  const latestMessage = messages[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-32 pt-28 text-white md:px-10 md:pb-24">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(14,165,233,0.08),transparent_26%),linear-gradient(to_bottom,#020617_0%,#000_46%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
      

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 bg-white/[0.025] p-6 md:p-10">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
              SourceTV Partner Portal
            </p>

            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h1 className="text-4xl font-black leading-[0.95] md:text-7xl">
                  Partner Inbox
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
                  Official communications from SourceTV review, rights,
                  publishing, and content operations teams.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-center">
                  <p className="text-2xl font-black text-white">{readCount}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Read
                  </p>
                </div>

                <div className="rounded-2xl border border-sky-300/20 bg-sky-300/10 px-5 py-4 text-center">
                  <p className="text-2xl font-black text-sky-200">
                    {unreadCount}
                  </p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-200/65">
                    Unread
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4 text-center">
                  <p className="text-2xl font-black text-white">
                    {messages.length}
                  </p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    Total
                  </p>
                </div>
              </div>
            </div>
          </div>

          {latestMessage && (
            <div className="grid gap-4 p-5 md:grid-cols-[1.3fr_0.7fr] md:p-6">
              <div className="rounded-[1.4rem] border border-white/10 bg-black/25 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
                  Latest Message
                </p>

                <h2 className="mt-3 line-clamp-2 text-xl font-black text-white">
                  {latestMessage.subject}
                </h2>

                <p className="mt-2 text-xs font-bold text-white/45">
                  {latestMessage.senderTeam} •{" "}
                  {formatDate(latestMessage.createdAt)}
                </p>
              </div>

              <button
                onClick={loadMessages}
                className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-5 text-left transition hover:border-sky-300/35 hover:bg-sky-300/10"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                  Sync Inbox
                </p>

                <p className="mt-3 text-sm font-bold leading-6 text-white/55">
                  Refresh partner communications from SourceTV operations.
                </p>
              </button>
            </div>
          )}
        </section>

        <section className="mt-7 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex gap-5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filters.map((filter) => {
              const active = activeFilter === filter;

              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`shrink-0 border-b-2 pb-2 text-[11px] font-black uppercase tracking-[0.15em] transition ${
                    active
                      ? "border-sky-300 text-sky-300"
                      : "border-transparent text-white/38 hover:text-white/72"
                  }`}
                >
                  {filter} ({filterCounts[filter as keyof typeof filterCounts]})
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8">
          {loading ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 text-white/50">
              Loading partner messages...
            </div>
          ) : messages.length === 0 ? (
            <EmptyInbox />
          ) : filteredMessages.length === 0 ? (
            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-8 text-white/50">
              No messages found for this view.
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredMessages.map((message) => {
                const expanded = selectedMessage === message.id;
                const replies = message.replies || [];

                return (
                  <article
                    key={message.id}
                    className={`overflow-hidden rounded-[1.4rem] border shadow-[0_18px_55px_rgba(0,0,0,0.35)] transition-all duration-300 ${
                      !message.isRead
                        ? "border-sky-300/35 bg-sky-300/[0.055]"
                        : "border-white/10 bg-white/[0.032]"
                    } ${expanded ? "bg-white/[0.05]" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => openMessage(message)}
                      className="w-full text-left"
                    >
                      <div className="grid gap-4 p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                        <div className="flex items-center gap-4">
                          {!message.isRead ? (
                            <div className="h-3 w-3 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(56,189,248,0.95)]" />
                          ) : (
                            <div className="h-3 w-3 rounded-full bg-white/12" />
                          )}

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-sm font-black text-sky-200">
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
                            <h2 className="truncate text-lg font-black text-white md:text-xl">
                              {message.subject}
                            </h2>

                            {!message.isRead && (
                              <span className="rounded-full bg-sky-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">
                                New
                              </span>
                            )}

                            {replies.length > 0 && (
                              <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/60">
                                {replies.length} Replies
                              </span>
                            )}

                            {message.project?.workflowStage && (
                              <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${stageBadgeClass(
                                  message.project.workflowStage
                                )}`}
                              >
                                {stageLabel(message.project.workflowStage)}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs font-bold text-white/42">
                            {message.senderTeam} • {formatDate(message.createdAt)}
                          </p>

                          <p className="mt-3 line-clamp-1 text-sm leading-6 text-white/42">
                            {replies.length > 0
                              ? replies[replies.length - 1].body
                              : message.body}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 md:justify-end">
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/28">
                            {formatShortDate(message.createdAt)}
                          </p>

                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/45 transition ${
                              expanded ? "rotate-180" : ""
                            }`}
                          >
                            ↓
                          </div>
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
                        <div className="border-t border-white/10 px-5 py-6 md:px-8">
                          <div className="rounded-[1.4rem] border border-white/10 bg-black/30 p-5 md:p-6">
                            <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-start">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                                  Conversation
                                </p>

                                <h3 className="mt-2 text-2xl font-black text-white">
                                  {message.subject}
                                </h3>
                              </div>

                              <p className="shrink-0 text-xs font-bold text-white/38">
                                {formatDate(message.createdAt)}
                              </p>
                            </div>

                            <div className="mt-6 grid gap-4">
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

                            {message.project && (
                              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                                  Related Project
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs font-black text-white/75">
                                    {message.project.title}
                                  </span>

                                  <span
                                    className={`rounded-full border px-3 py-2 text-xs font-black capitalize ${stageBadgeClass(
                                      message.project.workflowStage
                                    )}`}
                                  >
                                    {stageLabel(message.project.workflowStage)}
                                  </span>

                                  {message.project.recognitionLevel && (
                                    <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-2 text-xs font-black text-sky-200">
                                      {message.project.recognitionLevel}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="mt-6 rounded-[1.2rem] border border-sky-300/15 bg-sky-300/[0.045] p-4">
                              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                                Reply to SourceTV
                              </p>

                              <textarea
                                value={replyBodies[message.id] || ""}
                                onChange={(event) =>
                                  setReplyBodies((current) => ({
                                    ...current,
                                    [message.id]: event.target.value,
                                  }))
                                }
                                placeholder="Write your response..."
                                rows={4}
                                className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/45 focus:bg-black/65"
                              />

                              <div className="mt-4 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => sendReply(message.id)}
                                  disabled={
                                    sendingReplyId === message.id ||
                                    !replyBodies[message.id]?.trim()
                                  }
                                  className="rounded-full bg-sky-300 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  {sendingReplyId === message.id
                                    ? "Sending..."
                                    : "Send Reply"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function ThreadBubble({
  role,
  name,
  body,
  date,
}: {
  role: string;
  name: string;
  body: string;
  date: string;
}) {
  const isPartner = role === "partner";

  return (
    <div
      className={`rounded-[1.2rem] border p-4 ${
        isPartner
          ? "ml-0 border-sky-300/20 bg-sky-300/[0.075] md:ml-16"
          : "mr-0 border-white/10 bg-white/[0.035] md:mr-16"
      }`}
    >
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <p
          className={`text-[10px] font-black uppercase tracking-[0.22em] ${
            isPartner ? "text-sky-200" : "text-white/45"
          }`}
        >
          {isPartner ? "Partner Reply" : name}
        </p>

        <p className="text-[11px] font-bold text-white/35">{formatDate(date)}</p>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/68">
        {body}
      </p>
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
      <div className="border-b border-white/10 bg-white/[0.025] p-8 md:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-300/10 text-2xl">
          ✉
        </div>

        <h2 className="mt-6 text-3xl font-black text-white">
          Your SourceTV communications will appear here.
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">
          Messages from content reviewers, rights teams, publishing staff, and
          partner operations will be delivered directly to this inbox.
        </p>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-3">
        <EmptyFeature
          title="Review Notes"
          body="Metadata, content, and rights feedback."
        />
        <EmptyFeature
          title="Publishing Updates"
          body="Scheduling, approval, and release status."
        />
        <EmptyFeature
          title="Partner Support"
          body="Direct updates from SourceTV teams."
        />
      </div>
    </div>
  );
}

function EmptyFeature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-2 text-xs leading-6 text-white/45">{body}</p>
    </div>
  );
}