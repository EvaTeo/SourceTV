import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const body = await req.json();

    const { projectId, subject, body: messageBody, senderTeam } = body;

    if (!subject || !messageBody) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const message = await prisma.partnerMessage.create({
      data: {
        projectId: projectId || null,
        subject: String(subject).trim(),
        body: String(messageBody).trim(),
        senderTeam: senderTeam?.trim() || "SourceTV Partner Relations",
        isRead: false,
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error("ADMIN MESSAGE API ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to send partner message",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}