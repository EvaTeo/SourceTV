"use client";

import { useState } from "react";

import type {
  ContentUpdateBody,
} from "../lib/contentApi";

import type { ContentItem } from "../types";

type MessageForm = {
  senderTeam: string;
  subject: string;
  message: string;
};

type UpdateContent = (
  id: string,
  body: ContentUpdateBody
) => Promise<void>;

const emptyMessageForm: MessageForm = {
  senderTeam:
    "SourceTV Programming Team",

  subject:
    "Message From SourceTV",

  message: "",
};

export default function useContentModals(
  updateContent: UpdateContent,
  savingId: string | null
) {
  const [
    messageTarget,
    setMessageTarget,
  ] =
    useState<ContentItem | null>(
      null
    );

  const [
    rejectTarget,
    setRejectTarget,
  ] =
    useState<ContentItem | null>(
      null
    );

  const [
    messageForm,
    setMessageForm,
  ] =
    useState<MessageForm>(
      emptyMessageForm
    );

  const [
    rejectReason,
    setRejectReason,
  ] = useState("");

  function openMessageModal(
    item: ContentItem
  ) {
    setMessageTarget(item);

    setMessageForm({
      ...emptyMessageForm,
    });
  }

  function closeMessageModal() {
    if (savingId) {
      return;
    }

    setMessageTarget(null);

    setMessageForm({
      ...emptyMessageForm,
    });
  }

  async function sendPartnerMessage() {
    if (
      !messageTarget ||
      !messageForm.message.trim()
    ) {
      return;
    }

    await updateContent(
      messageTarget.id,
      {
        action:
          "send_message",

        senderTeam:
          messageForm.senderTeam.trim() ||
          "SourceTV Programming Team",

        subject:
          messageForm.subject.trim() ||
          "Message From SourceTV",

        message:
          messageForm.message.trim(),
      }
    );

    setMessageTarget(null);

    setMessageForm({
      ...emptyMessageForm,
    });
  }

  function openRejectModal(
    item: ContentItem
  ) {
    setRejectTarget(item);

    setRejectReason(
      item.reviewNotes ||
        ""
    );
  }

  function closeRejectModal() {
    if (savingId) {
      return;
    }

    setRejectTarget(null);
    setRejectReason("");
  }

  async function rejectContent() {
    if (!rejectTarget) {
      return;
    }

    await updateContent(
      rejectTarget.id,
      {
        action: "reject",

        reviewNotes:
          rejectReason.trim() ||
          rejectTarget.reviewNotes ||
          "",
      }
    );

    setRejectTarget(null);
    setRejectReason("");
  }

  return {
    messageTarget,
    messageForm,
    setMessageForm,

    openMessageModal,
    closeMessageModal,
    sendPartnerMessage,

    rejectTarget,
    rejectReason,
    setRejectReason,

    openRejectModal,
    closeRejectModal,
    rejectContent,
  };
}