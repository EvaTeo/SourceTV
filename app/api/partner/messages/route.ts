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
              project: {
                creatorEmail: user.email,
              },
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

    if (user.role !== "admin") {
      await prisma.partnerMessage.updateMany({
        where: {
          isRead: false,
          project: {
            creatorEmail: user.email,
          },
        },
        data: {
          isRead: true,
        },
      });
    }

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