import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const submissions =
      await prisma.projectSubmission.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("SUBMISSIONS GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not load submissions.",
      },
      {
        status: 500,
      }
    );
  }
}