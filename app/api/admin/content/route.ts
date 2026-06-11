import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const content = await prisma.projectSubmission.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(content);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load admin content",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}