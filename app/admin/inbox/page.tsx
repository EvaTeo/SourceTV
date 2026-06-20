"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProjectOption = {
  id: string;
  title: string;
  creatorName?: string | null;
  creatorEmail?: string | null;
  creatorCompany?: string | null;
  workflowStage?: string | null;
};

type Reply = {
  id: string;
  senderRole: string;
  senderName?: string | null;
  senderEmail?: string | null;
  body: string;
  isRead: boolean;
  createdAt: string;
};

type AdminMessage = {
  id: string;
  projectId?: string | null;
  partnerEmail?: string | null;
  partnerName?: string | null;
  subject: string;
  body: string;
  senderTeam: string;
  isRead: boolean;
  createdAt: string;
  replies?: Reply[];
  project?: {
    id: string;
    title: string;
    workflowStage?: string | null;
    creatorName?: string | null;
    creatorEmail?: string | null;
    creatorCompany?: string | null;
  } | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [replyBodies, setReplyBodies] = useState<Record<string, string>>({});
  const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);

  const [projectId, setProjectId] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [senderTeam, setSenderTeam] = useState("SourceTV Partner Relations");
  const [subject, setSubject] = useState("Message From SourceTV");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const [messagesRes, contentRes] = await Promise.all([
        fetch("/api/admin/messages", { cache: "no-store" }),
        fetch("/api/admin/content", { cache: "no-store" }),
      ]);

      if (messagesRes.status === 403 || contentRes.status === 403) {
        window.location.href = "/login";
        return;
      }

      const messagesData = await messagesRes.json();
      const contentData = await contentRes.json();

      setMessages(Array.isArray(messagesData) ? messagesData : []);
      setProjects(Array.isArray(contentData) ? contentData : []);
    } catch (error) {
      console.error("ADMIN INBOX LOAD ERROR:", error);
      setMessages([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  function selectProject(id: string) {
    setProjectId(id);

    const project = projects.find((item) => item.id === id);

    if (!project) return;

    setPartnerEmail(project.creatorEmail || "");
    setPartnerName(
      project.creatorCompany || project.creatorName || project.creatorEmail || ""
    );
  }

  async function sendMessage() {
    if (!partnerEmail.trim()) {
      alert("Partner email is required.");
      return;
    }

    if (!subject.trim()) {
      alert("Subject is required.");
      return;
    }

    if (!message.trim()) {
      alert("Message is required.");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId || null,
          partnerEmail,
          partnerName,
          senderTeam,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not send message.");
        return;
      }

      setMessage("");
      setSubject("Message From SourceTV");

      await loadData();
    } catch (error) {
      console.error("SEND ADMIN MESSAGE ERROR:", error);
      alert("Could not send message.");
    } finally {
      setSending(false);
    }
  }

  async function sendThreadReply(messageId: string) {
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

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not send reply.");
        return;
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === messageId
            ? {
                ...item,
                replies: [...(item.replies || []), data],
              }
            : item
        )
      );

      setReplyBodies((current) => ({
        ...current,
        [messageId]: "",
      }));
    } catch (error) {
      console.error("SEND ADMIN THREAD REPLY ERROR:", error);
      alert("Could not send reply.");
    } finally {
      setSendingReplyId(null);
    }
  }

  async function openThread(item: AdminMessage) {
    const isExpanded = selectedMessageId === item.id;

    setSelectedMessageId(isExpanded ? null : item.id);

    if (isExpanded) return;

    const hasUnreadPartnerReplies = (item.replies || []).some(
      (reply) => reply.senderRole === "partner" && !reply.isRead
    );

    if (!hasUnreadPartnerReplies) return;

    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId: item.id,
        }),
      });

      if (!res.ok) return;

      const updated = await res.json();

      if (!updated) return;

      setMessages((current) =>
        current.map((message) => (message.id === item.id ? updated : message))
      );
    } catch (error) {
      console.error("MARK PARTNER REPLIES READ ERROR:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((item) => !item.isRead).length,
    [messages]
  );

  const unreadPartnerReplyCount = useMemo(
    () =>
      messages.reduce((total, item) => {
        return (
          total +
          (item.replies || []).filter(
            (reply) => reply.senderRole === "partner" && !reply.isRead
          ).length
        );
      }, 0),
    [messages]
  );

  const partnerCount = useMemo(() => {
    return new Set(
      messages
        .map((item) => item.partnerEmail || item.project?.creatorEmail)
        .filter(Boolean)
    ).size;
  }, [messages]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 pb-28 pt-28 text-white md:px-10">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(56,189,248,0.12),transparent_32%),linear-gradient(to_bottom,#020617_0%,#000_48%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="text-sm font-black text-sky-300 transition hover:text-sky-200"
        >
          ← Back to Admin Home
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
                SourceTV Communications
              </p>

              <h1 className="mt-3 text-4xl font-black leading-[0.95] md:text-7xl">
                Admin Inbox
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/58 md:text-base">
                Send partner updates, rights requests, review notes, and
                publishing messages directly to the partner portal.
              </p>
            </div>

            <button
              onClick={loadData}
              className="w-fit rounded-md bg-sky-400 px-4 py-2.5 text-xs font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.3)] transition hover:bg-sky-300"
            >
              Refresh
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Threads" value={messages.length} />
          <StatCard label="Unread By Partners" value={unreadCount} />
          <StatCard
            label="New Partner Replies"
            value={unreadPartnerReplyCount}
          />
          <StatCard label="Partners Reached" value={partnerCount} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
              Send Message
            </p>

            <div className="mt-5 grid gap-4">
              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Related Project
                </span>

                <select
                  value={projectId}
                  onChange={(event) => selectProject(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/55 px-4 text-sm font-bold text-white outline-none focus:border-sky-300/60"
                >
                  <option value="">General message / choose project...</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} —{" "}
                      {project.creatorCompany ||
                        project.creatorName ||
                        project.creatorEmail ||
                        "Unknown partner"}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Partner Email
                </span>

                <input
                  value={partnerEmail}
                  onChange={(event) => setPartnerEmail(event.target.value)}
                  placeholder="partner@email.com"
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/55 px-4 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-sky-300/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Partner Name
                </span>

                <input
                  value={partnerName}
                  onChange={(event) => setPartnerName(event.target.value)}
                  placeholder="Partner name or company"
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/55 px-4 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-sky-300/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Sender Team
                </span>

                <input
                  value={senderTeam}
                  onChange={(event) => setSenderTeam(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/55 px-4 text-sm font-bold text-white outline-none focus:border-sky-300/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Subject
                </span>

                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/55 px-4 text-sm font-bold text-white outline-none focus:border-sky-300/60"
                />
              </label>

              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                  Message
                </span>

                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write a partner update, review note, rights request, publishing message..."
                  className="min-h-48 w-full resize-y rounded-2xl border border-white/10 bg-black/55 px-4 py-4 text-sm leading-7 text-white outline-none placeholder:text-white/25 focus:border-sky-300/60"
                />
              </label>

              <button
                disabled={sending}
                onClick={sendMessage}
                className="rounded-xl bg-sky-400 px-5 py-3 text-xs font-black text-black shadow-[0_0_28px_rgba(56,189,248,0.25)] transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? "Sending..." : "Send Partner Message"}
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl md:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
              Message Threads
            </p>

            {loading ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5 text-white/45">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5 text-white/45">
                No messages sent yet.
              </div>
            ) : (
              <div className="mt-5 max-h-[760px] space-y-3 overflow-y-auto pr-1">
                {messages.map((item) => {
                  const expanded = selectedMessageId === item.id;
                  const replies = item.replies || [];
                  const latestReply = replies[replies.length - 1];
                  const unreadPartnerReplies = replies.filter(
                    (reply) =>
                      reply.senderRole === "partner" && !reply.isRead
                  ).length;

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-black/25"
                    >
                      <button
                        type="button"
                        onClick={() => openThread(item)}
                        className="w-full p-4 text-left transition hover:bg-white/[0.035]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate text-sm font-black text-white">
                                {item.subject}
                              </p>

                              {replies.length > 0 && (
                                <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-sky-200">
                                  {replies.length} Replies
                                </span>
                              )}

                              {unreadPartnerReplies > 0 && (
                                <span className="rounded-full bg-emerald-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">
                                  {unreadPartnerReplies} New Partner{" "}
                                  {unreadPartnerReplies === 1
                                    ? "Reply"
                                    : "Replies"}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs font-bold text-white/38">
                              To:{" "}
                              {item.partnerName ||
                                item.partnerEmail ||
                                item.project?.creatorName ||
                                item.project?.creatorEmail ||
                                "Unknown partner"}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                              item.isRead
                                ? "bg-emerald-300/12 text-emerald-200"
                                : "bg-sky-300/12 text-sky-200"
                            }`}
                          >
                            {item.isRead ? "Read" : "Unread"}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55">
                          {latestReply ? latestReply.body : item.body}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/32">
                          <span>{item.senderTeam}</span>
                          <span>•</span>
                          <span>{formatDate(item.createdAt)}</span>
                          {item.project?.title && (
                            <>
                              <span>•</span>
                              <span>{item.project.title}</span>
                            </>
                          )}
                        </div>
                      </button>

                      {expanded && (
                        <div className="border-t border-white/10 p-4">
                          <div className="space-y-3">
                            <ThreadBubble
                              role="admin"
                              name={item.senderTeam}
                              body={item.body}
                              date={item.createdAt}
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

                          <div className="mt-4 rounded-2xl border border-sky-300/15 bg-sky-300/[0.045] p-4">
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-300">
                              Reply as SourceTV
                            </p>

                            <textarea
                              value={replyBodies[item.id] || ""}
                              onChange={(event) =>
                                setReplyBodies((current) => ({
                                  ...current,
                                  [item.id]: event.target.value,
                                }))
                              }
                              placeholder="Write a response to the partner..."
                              rows={4}
                              className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/45 focus:bg-black/65"
                            />

                            <div className="mt-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() => sendThreadReply(item.id)}
                                disabled={
                                  sendingReplyId === item.id ||
                                  !replyBodies[item.id]?.trim()
                                }
                                className="rounded-full bg-sky-300 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-sky-200 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                {sendingReplyId === item.id
                                  ? "Sending..."
                                  : "Send Reply"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
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
          ? "border-emerald-300/20 bg-emerald-300/[0.07]"
          : "border-sky-300/15 bg-sky-300/[0.055]"
      }`}
    >
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <p
          className={`text-[10px] font-black uppercase tracking-[0.22em] ${
            isPartner ? "text-emerald-200" : "text-sky-200"
          }`}
        >
          {isPartner ? "Partner Reply" : name}
        </p>

        <p className="text-[11px] font-bold text-white/35">
          {formatDate(date)}
        </p>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/68">
        {body}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-2xl backdrop-blur-xl">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}