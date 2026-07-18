"use client";

import { useEffect, useMemo, useState } from "react";

import ComposeMessageCard from "./components/ComposeMessageCard";
import InboxStats from "@/app/components/inbox/InboxStats";
import ThreadList from "@/app/components/inbox/ThreadList";
import ThreadView from "@/app/components/inbox/ThreadView";

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

      const nextMessages = Array.isArray(messagesData) ? messagesData : [];
      const nextProjects = Array.isArray(contentData) ? contentData : [];

      setMessages(nextMessages);
      setProjects(nextProjects);

      setSelectedMessageId((current) => {
        if (current && nextMessages.some((item) => item.id === current)) {
          return current;
        }

        return nextMessages[0]?.id || null;
      });
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

    if (!project) {
      setPartnerEmail("");
      setPartnerName("");
      return;
    }

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
    setSelectedMessageId(item.id);

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

  const selectedMessage =
    messages.find((item) => item.id === selectedMessageId) || null;

  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
            SourceTV Communications
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Admin Inbox
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
            Send partner updates, rights requests, review notes, and publishing
            messages directly to the partner portal.
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-black text-white transition hover:bg-white/10"
        >
          Refresh
        </button>
      </section>

      <InboxStats
  stats={[
    {
      label: "Total Threads",
      value: messages.length,
    },
    {
      label: "Unread",
      value: unreadCount,
    },
    {
      label: "Partner Replies",
      value: unreadPartnerReplyCount,
    },
    {
      label: "Partners",
      value: partnerCount,
    },
  ]}
/>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <ComposeMessageCard
          projects={projects}
          projectId={projectId}
          partnerEmail={partnerEmail}
          partnerName={partnerName}
          senderTeam={senderTeam}
          subject={subject}
          message={message}
          sending={sending}
          setProjectId={setProjectId}
          setPartnerEmail={setPartnerEmail}
          setPartnerName={setPartnerName}
          setSenderTeam={setSenderTeam}
          setSubject={setSubject}
          setMessage={setMessage}
          selectProject={selectProject}
          sendMessage={sendMessage}
        />

        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center text-white/40">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-10 text-center text-white/40">
              No messages sent yet.
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <ThreadList
  threads={messages.map((item) => ({
    id: item.id,
    title: item.subject,
    participant:
      item.partnerName ||
      item.partnerEmail ||
      "Unknown Partner",
    preview: item.body,
    date: formatDate(item.createdAt),
    unread: !item.isRead,
    replies: item.replies?.length ?? 0,
  }))}
  selectedId={selectedMessageId}
  onSelect={(id) => {
    const thread = messages.find((item) => item.id === id);

    if (thread) {
      openThread(thread);
    }
  }}
/>

                          <ThreadView
                conversation={
                  selectedMessage
                    ? [
                        {
                          id: selectedMessage.id,
                          title: selectedMessage.senderTeam,
                          body: selectedMessage.body,
                          date: formatDate(selectedMessage.createdAt),
                          isOwn: true,
                        },
                        ...(selectedMessage.replies ?? []).map((reply) => ({
                          id: reply.id,
                          title:
                            reply.senderName ||
                            reply.senderEmail ||
                            reply.senderRole,
                          body: reply.body,
                          date: formatDate(reply.createdAt),
                          isOwn: reply.senderRole !== "partner",
                        })),
                      ]
                    : []
                }
                reply={replyBodies[selectedMessageId ?? ""] || ""}
                setReply={(value) =>
                  setReplyBodies((current) => ({
                    ...current,
                    [selectedMessageId ?? ""]: value,
                  }))
                }
                sending={sendingReplyId === selectedMessageId}
                onSend={() => {
                  if (selectedMessageId) {
                    sendThreadReply(selectedMessageId);
                  }
                }}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}