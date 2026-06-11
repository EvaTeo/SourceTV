"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Message = {
  id: string;
  subject: string;
  body: string;
  senderTeam: string;
  isRead: boolean;
  createdAt: string;
  project?: {
    id: string;
    title: string;
    workflowStage: string;
    recognitionLevel?: string | null;
  } | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PartnerInboxPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    try {
      setLoading(true);

      const res = await fetch("/api/partner/messages", {
        cache: "no-store",
      });

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

  useEffect(() => {
    const userData = localStorage.getItem("sourcetvUser");

    if (!userData) {
      window.location.href = "/login";
      return;
    }

    const currentUser = JSON.parse(userData);

    if (currentUser.role !== "partner" && currentUser.role !== "admin") {
      window.location.href = "/partner/apply";
      return;
    }

    loadMessages();
  }, []);

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.isRead).length,
    [messages]
  );

  return (
    <main className="min-h-screen bg-black px-4 pb-32 pt-28 text-white md:px-10 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <Link href="/partner" className="text-sm font-bold text-sky-300">
          ← Back to Partner Dashboard
        </Link>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl backdrop-blur-xl md:p-10">
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:text-sm">
            SourceTV Partner Portal
          </p>

          <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black leading-[0.95] md:text-7xl">
                Partner Inbox
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 md:text-base">
                Official communications from SourceTV teams.
              </p>
            </div>

            <div className="rounded-full border border-sky-300/20 bg-sky-300/10 px-5 py-3 text-sm font-black text-sky-200">
              {unreadCount} Unread
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4">
          {loading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-white/50">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-white/50">
              No partner messages yet.
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur-xl transition md:p-7 ${
                  !message.isRead
                    ? "border-sky-300/30 bg-sky-300/[0.08]"
                    : "border-white/10 bg-white/[0.045]"
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                    {message.senderTeam}
                  </span>

                  {message.project && (
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/60">
                      {message.project.title}
                    </span>
                  )}

                  {!message.isRead && (
                    <span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-200">
                      New
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-black md:text-3xl">
                  {message.subject}
                </h2>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                  {formatDate(message.createdAt)}
                </p>

                <p className="mt-4 text-sm leading-7 text-white/60 md:text-base">
                  {message.body}
                </p>

                {message.project?.recognitionLevel && (
                  <div className="mt-4">
                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs font-black text-white">
                      {message.project.recognitionLevel}
                    </span>
                  </div>
                )}
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}