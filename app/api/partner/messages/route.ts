import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (user.role !== "partner" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Only partners can view messages" },
        { status: 403 }
      );
    }

    const messages = await prisma.partnerMessage.findMany({
      where:
        user.role === "admin"
          ? {}
          : {
              OR: [
                {
                  partnerEmail: user.email,
                },
                {
                  project: {
                    creatorEmail: user.email,
                  },
                },
              ],
            },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            workflowStage: true,
            recognitionLevel: true,
            creatorEmail: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("PARTNER MESSAGES API ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to load partner messages",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (user.role !== "partner" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Only partners can update messages" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    const message = await prisma.partnerMessage.findFirst({
      where:
        user.role === "admin"
          ? {
              id: messageId,
            }
          : {
              id: messageId,
              OR: [
                {
                  partnerEmail: user.email,
                },
                {
                  project: {
                    creatorEmail: user.email,
                  },
                },
              ],
            },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const updated = await prisma.partnerMessage.update({
      where: {
        id: messageId,
      },
      data: {
        isRead: true,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            workflowStage: true,
            recognitionLevel: true,
            creatorEmail: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, message: updated });
  } catch (error: any) {
    console.error("PARTNER MESSAGE READ ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to mark message as read",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}