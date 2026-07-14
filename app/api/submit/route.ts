import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

type SubmitBody = {
  title?: unknown;
  description?: unknown;
  type?: unknown;
  genre?: unknown;
  year?: unknown;
  videoUrl?: unknown;
  mainVideoUrl?: unknown;
  trailerUrl?: unknown;
  thumbnailUrl?: unknown;
  backdropUrl?: unknown;
  titleLogoUrl?: unknown;
  maturityRating?: unknown;
  runtime?: unknown;
  creatorName?: unknown;
  creatorCompany?: unknown;
};

function cleanString(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not logged in." },
        { status: 401 }
      );
    }

    if (
      user.role !== "partner" &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Only approved SourceTV partners can submit projects.",
        },
        { status: 403 }
      );
    }

    const settings =
      await prisma.platformSettings.findFirst({
        select: {
          defaultRevenueShare: true,
        },
      });

    const defaultRevenueShare =
      settings?.defaultRevenueShare ?? 50;

    const body: SubmitBody =
      await request.json();

    const title = cleanString(body.title);
    const description = cleanString(
      body.description
    );

    const mainVideoUrl =
      cleanString(body.mainVideoUrl) ||
      cleanString(body.videoUrl);

    if (!title || !description) {
      return NextResponse.json(
        {
          error:
            "Title and description are required.",
        },
        { status: 400 }
      );
    }

    if (!mainVideoUrl) {
      return NextResponse.json(
        {
          error:
            "A main video URL is required.",
        },
        { status: 400 }
      );
    }

    const parsedYear =
      body.year === "" ||
      body.year === null ||
      body.year === undefined
        ? null
        : Number(body.year);

    const safeRevenueShare =
      Number.isFinite(defaultRevenueShare) &&
      defaultRevenueShare >= 0 &&
      defaultRevenueShare <= 100
        ? Math.round(defaultRevenueShare)
        : 50;

    const submission =
      await prisma.projectSubmission.create({
        data: {
          title,
          description,

          type:
            cleanString(body.type) ||
            "Film",

          genre:
            cleanString(body.genre) ||
            "Drama",

          year:
            parsedYear !== null &&
            Number.isFinite(parsedYear)
              ? Math.round(parsedYear)
              : undefined,

          videoUrl: mainVideoUrl,
          mainVideoUrl,

          trailerUrl:
            cleanString(body.trailerUrl) ||
            null,

          thumbnailUrl:
            cleanString(
              body.thumbnailUrl
            ) || null,

          backdropUrl:
            cleanString(
              body.backdropUrl
            ) || null,

          titleLogoUrl:
            cleanString(
              body.titleLogoUrl
            ) || null,

          maturityRating:
            cleanString(
              body.maturityRating
            ) || "Not Rated",

          runtime:
            cleanString(body.runtime) ||
            null,

          creatorName:
            cleanString(
              body.creatorName
            ) ||
            user.name ||
            "SourceTV Partner",

          creatorEmail: user.email,

          creatorCompany:
            cleanString(
              body.creatorCompany
            ) || null,

          revenueShare:
            safeRevenueShare,

          workflowStage: "submission",
          status: "pending",
        },
      });

    return NextResponse.json(
      {
        success: true,
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "SUBMIT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to submit project.",
      },
      { status: 500 }
    );
  }
}