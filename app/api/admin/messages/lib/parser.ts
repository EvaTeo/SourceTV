type CreateMessageInput = {
  projectId?: string;
  partnerEmail: string;
  partnerName?: string;
  senderTeam: string;
  subject: string;
  message: string;
};

export async function parseCreateMessageRequest(
  request: Request
): Promise<
  | {
      success: true;
      data: CreateMessageInput;
    }
  | {
      success: false;
      error: string;
      status: number;
    }
> {
  try {
    const body = (await request.json()) as Record<
      string,
      unknown
    >;

    const partnerEmail =
      typeof body.partnerEmail === "string"
        ? body.partnerEmail.trim()
        : "";

    const subject =
      typeof body.subject === "string"
        ? body.subject.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!partnerEmail) {
      return {
        success: false,
        error: "Partner email is required.",
        status: 400,
      };
    }

    if (!subject) {
      return {
        success: false,
        error: "Subject is required.",
        status: 400,
      };
    }

    if (!message) {
      return {
        success: false,
        error: "Message is required.",
        status: 400,
      };
    }

    return {
      success: true,
      data: {
        projectId:
          typeof body.projectId === "string"
            ? body.projectId
            : undefined,
        partnerEmail,
        partnerName:
          typeof body.partnerName === "string"
            ? body.partnerName
            : undefined,
        senderTeam:
          typeof body.senderTeam === "string"
            ? body.senderTeam
            : "SourceTV",
        subject,
        message,
      },
    };
  } catch {
    return {
      success: false,
      error: "Invalid request body.",
      status: 400,
    };
  }
}

export async function parseMarkRepliesReadRequest(
  request: Request
): Promise<
  | {
      success: true;
      messageId: string;
    }
  | {
      success: false;
      error: string;
      status: number;
    }
> {
  try {
    const body = (await request.json()) as Record<
      string,
      unknown
    >;

    const messageId =
      typeof body.messageId === "string"
        ? body.messageId.trim()
        : "";

    if (!messageId) {
      return {
        success: false,
        error: "Message ID is required.",
        status: 400,
      };
    }

    return {
      success: true,
      messageId,
    };
  } catch {
    return {
      success: false,
      error: "Invalid request body.",
      status: 400,
    };
  }
}