import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
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

    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load partner messages",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}