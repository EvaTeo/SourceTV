import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "partner" && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

    const message = await prisma.partnerMessage.findUnique({
      where: {
        id,
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (
      currentUser.role === "partner" &&
      message.partnerEmail &&
      message.partnerEmail !== currentUser.email
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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