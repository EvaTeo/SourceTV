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
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const projects = await prisma.projectSubmission.findMany({
      where:
        user.role === "admin"
          ? {}
          : {
              creatorEmail: user.email,
            },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load partner projects",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}