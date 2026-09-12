"use client";

import { useState } from "react";

import { sendContentPartnerMessage } from "../lib/contentEditorApi";

type UsePartnerMessageInput = {
  id: string;

  partnerEmail?:
    | string
    | null;

  partnerName?:
    | string
    | null;

  partnerCompany?:
    | string
    | null;
};

export default function usePartnerMessage({
  id,
  partnerEmail,
  partnerName,
  partnerCompany,
}: UsePartnerMessageInput) {
  const [
    messageSubject,
    setMessageSubject,
  ] = useState(
    "Message From SourceTV"
  );

  const [
    messageSenderTeam,
    setMessageSenderTeam,
  ] = useState(
    "SourceTV Programming Team"
  );

  const [
    messageBody,
    setMessageBody,
  ] = useState("");

  const [
    sendingMessage,
    setSendingMessage,
  ] = useState(false);

  async function sendPartnerMessage() {
    if (
      !messageBody.trim()
    ) {
      window.alert(
        "Please enter a message."
      );

      return;
    }

    if (!partnerEmail) {
      window.alert(
        "This title does not have a partner email."
      );

      return;
    }

    try {
      setSendingMessage(
        true
      );

      await sendContentPartnerMessage(
        id,
        {
          partnerEmail,

          partnerName:
            partnerName ||
            partnerCompany ||
            "",

          senderTeam:
            messageSenderTeam,

          subject:
            messageSubject,

          message:
            messageBody,
        }
      );

      window.alert(
        "Partner message sent."
      );

      setMessageBody("");
    } catch (error) {
      console.error(
        "SEND PARTNER MESSAGE ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Could not send partner message."
      );
    } finally {
      setSendingMessage(
        false
      );
    }
  }

  return {
    messageSubject,
    messageSenderTeam,
    messageBody,
    sendingMessage,

    setMessageSubject,
    setMessageSenderTeam,
    setMessageBody,

    sendPartnerMessage,
  };
}