"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  InboxFilter,
  InboxFilterCounts,
  Message,
} from "../types";

export default function usePartnerInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] =
    useState<string | null>(null);

  const [activeFilter, setActiveFilter] =
    useState<InboxFilter>("all");

  const [replyBodies, setReplyBodies] = useState<
    Record<string, string>
  >({});

  const [sendingReplyId, setSendingReplyId] =
    useState<string | null>(null);

  async function loadMessages() {
    try {
      setLoading(true);

      const response = await fetch("/api/partner/messages", {
        cache: "no-store",
      });

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to load messages: ${response.status}`
        );
      }

      const data = await response.json();

      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "PARTNER MESSAGE LOAD ERROR:",
        error
      );

      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  async function openMessage(message: Message) {
    setSelectedMessage(message.id);

    if (message.isRead) {
      return;
    }

    try {
      const response = await fetch(
        "/api/partner/messages",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageId: message.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to mark message as read"
        );
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

  function closeMessage() {
    setSelectedMessage(null);
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
          body: JSON.stringify({
            body,
          }),
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
                replies: [
                  ...(message.replies || []),
                  newReply,
                ],
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

      alert(
        "Reply could not be sent. Please try again."
      );
    } finally {
      setSendingReplyId(null);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const unreadCount = useMemo(
    () =>
      messages.filter(
        (message) => !message.isRead
      ).length,
    [messages]
  );

  const readCount = messages.length - unreadCount;

  const filteredMessages = useMemo(() => {
    if (activeFilter === "unread") {
      return messages.filter(
        (message) => !message.isRead
      );
    }

    if (activeFilter === "read") {
      return messages.filter(
        (message) => message.isRead
      );
    }

    return messages;
  }, [messages, activeFilter]);

  const filterCounts: InboxFilterCounts = {
    all: messages.length,
    unread: unreadCount,
    read: readCount,
  };

  return {
    messages,
    loading,

    selectedMessage,
    setSelectedMessage,

    activeFilter,
    setActiveFilter,

    replyBodies,
    setReplyBodies,

    sendingReplyId,

    unreadCount,
    readCount,

    filteredMessages,
    filterCounts,

    loadMessages,
    openMessage,
    closeMessage,
    sendReply,
  };
}