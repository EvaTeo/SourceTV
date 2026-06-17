import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    if (user.role !== "partner" && user.role !== "admin") {
      return NextResponse.json(
        { error: "Only approved SourceTV partners can submit projects" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      type,
      genre,
      year,
      videoUrl,
      mainVideoUrl,
      trailerUrl,
      thumbnailUrl,
      backdropUrl,
      titleLogoUrl,
      maturityRating,
      runtime,
      creatorName,
      creatorCompany,
      revenueShare,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (!videoUrl && !mainVideoUrl) {
      return NextResponse.json(
        { error: "A main video URL is required" },
        { status: 400 }
      );
    }

    const parsedYear =
      year === "" || year === null || year === undefined
        ? null
        : Number(year);

    const parsedRevenueShare =
      revenueShare === "" || revenueShare === null || revenueShare === undefined
        ? 50
        : Number(revenueShare);

    const submission = await prisma.projectSubmission.create({
      data: {
        title: String(title).trim(),
        description: String(description).trim(),

        type: type || "Film",
        genre: genre || "Drama",
        year:
          parsedYear && Number.isFinite(parsedYear) ? parsedYear : undefined,

        videoUrl: mainVideoUrl || videoUrl,
        mainVideoUrl: mainVideoUrl || videoUrl,
        trailerUrl: trailerUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        backdropUrl: backdropUrl || null,
        titleLogoUrl: titleLogoUrl || null,

        maturityRating: maturityRating || "Not Rated",
        runtime: runtime || null,

        creatorName:
          creatorName?.trim() || user.name || "SourceTV Partner",
        creatorEmail: user.email,
        creatorCompany: creatorCompany || null,

        revenueShare:
          Number.isFinite(parsedRevenueShare) &&
          parsedRevenueShare >= 0 &&
          parsedRevenueShare <= 100
            ? parsedRevenueShare
            : 50,

        workflowStage: "submission",
        status: "pending",
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