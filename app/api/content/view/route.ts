import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.projectSubmission.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, views: updated.views });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to track view",
        message: error?.message,
        code: error?.code,
      },
      { status: 500 }
    );
  }
}