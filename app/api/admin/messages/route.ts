import { NextResponse } from "next/server";

import { requireAdmin } from "@/app/api/admin/lib/auth";

import { adminMessageErrorResponse } from "./lib/errors";
import {
  parseCreateMessageRequest,
  parseMarkRepliesReadRequest,
} from "./lib/parser";
import {
  createAdminMessage,
  getAdminMessages,
  markPartnerRepliesRead,
} from "./lib/repository";

export async function GET() {
  const authResponse = await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  try {
    const messages =
      await getAdminMessages();

    return NextResponse.json(
      messages
    );
  } catch (error) {
    return adminMessageErrorResponse(
      error,
      "Failed to load messages."
    );
  }
}

export async function POST(
  request: Request
) {
  const authResponse =
    await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  const parsed =
    await parseCreateMessageRequest(
      request
    );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error,
      },
      {
        status: parsed.status,
      }
    );
  }

  try {
    const result =
      await createAdminMessage(
        parsed.data
      );

    if (
      result.status ===
      "project_not_found"
    ) {
      return NextResponse.json(
        {
          error:
            "Project not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      result.message
    );
  } catch (error) {
    return adminMessageErrorResponse(
      error,
      "Failed to send message."
    );
  }
}

export async function PATCH(
  request: Request
) {
  const authResponse =
    await requireAdmin();

  if (authResponse) {
    return authResponse;
  }

  const parsed =
    await parseMarkRepliesReadRequest(
      request
    );

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error,
      },
      {
        status: parsed.status,
      }
    );
  }

  try {
    const thread =
      await markPartnerRepliesRead(
        parsed.messageId
      );

    return NextResponse.json(
      thread
    );
  } catch (error) {
    return adminMessageErrorResponse(
      error,
      "Failed to update thread."
    );
  }
}