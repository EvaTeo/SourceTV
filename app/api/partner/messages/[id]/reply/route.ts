import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (
      currentUser.role !== "partner" &&
      currentUser.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const replyBody = String(body.body || "").trim();

    if (!replyBody) {
      return NextResponse.json(
        { error: "Reply body is required" },
        { status: 400 }
      );
    }

    const message = await prisma.partnerMessage.findFirst({
      where:
        currentUser.role === "admin"
          ? {
              id,
            }
          : {
              id,
              OR: [
                {
                  partnerEmail: currentUser.email,
                },
                {
                  project: {
                    creatorEmail: currentUser.email,
                  },
                },
              ],
            },
    });

    if (!message) {
      return NextResponse.json(
        {
          error:
            currentUser.role === "admin"
              ? "Message not found"
              : "Message not found or access denied",
        },
        { status: 404 }
      );
    }

    const reply = await prisma.partnerMessageReply.create({
      data: {
        messageId: id,
        senderRole: currentUser.role,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
        body: replyBody,
        isRead: currentUser.role === "admin",
      },
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error("PARTNER MESSAGE REPLY ERROR:", error);

    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 }
    );
  }
}