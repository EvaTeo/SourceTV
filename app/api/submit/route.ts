import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, type, genre, videoUrl, description } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: "Title and video URL are required" },
        { status: 400 }
      );
    }

    const submission = await prisma.projectSubmission.create({
      data: {
        title,
        type,
        genre,
        videoUrl,
        description,
      },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("SUBMIT API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit project" },
      { status: 500 }
    );
  }
}