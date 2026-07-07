import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

async function getOrCreateProfile(userId: string) {
  let profile = await prisma.profile.findFirst({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        userId,
        name: "Main",
        avatar: "A",
      },
    });
  }

  return profile;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const profile = await getOrCreateProfile(user.id);

    const watchlist = await prisma.watchlist.findMany({
      where: {
        profileId: profile.id,
      },
      include: {
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      watchlist.map((item) => ({
        id: item.project.id,
        title: item.project.title,
        description: item.project.description,
        type: item.project.type,
        genre: item.project.genre,
        thumbnailUrl: item.project.thumbnailUrl,
        backdropUrl: item.project.backdropUrl,
        trailerUrl: item.project.trailerUrl,
        maturityRating: item.project.maturityRating,
        runtime: item.project.runtime,
        creatorName: item.project.creatorName,
        recommendationWeight: item.recommendationWeight,
      }))
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load watchlist",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();

    const projectId = String(body.projectId || "").trim();
    const recommendationWeight = Number(body.recommendationWeight || 5);

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const profile = await getOrCreateProfile(user.id);

    const project = await prisma.projectSubmission.findUnique({
      where: {
        id: projectId,
      },
      select: {
        id: true,
        genre: true,
        creatorName: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.watchlist.upsert({
      where: {
        profileId_projectId: {
          profileId: profile.id,
          projectId,
        },
      },
      update: {
        recommendationWeight: Number.isNaN(recommendationWeight)
          ? 5
          : recommendationWeight,
      },
      create: {
        profileId: profile.id,
        projectId,
        recommendationWeight: Number.isNaN(recommendationWeight)
          ? 5
          : recommendationWeight,
      },
    });

    const watchlist = await prisma.watchlist.findMany({
      where: {
        profileId: profile.id,
      },
      include: {
        project: {
          select: {
            genre: true,
            creatorName: true,
          },
        },
      },
    });

    const genres = watchlist
      .map((item) => item.project.genre)
      .filter(Boolean) as string[];

    const creators = watchlist
      .map((item) => item.project.creatorName)
      .filter(Boolean) as string[];

    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        favoriteGenres: JSON.stringify(genres),
        favoriteCreators: JSON.stringify(creators),
        lastRecommendationRefresh: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to add to watchlist",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();
    const projectId = String(body.projectId || "").trim();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const profile = await getOrCreateProfile(user.id);

    await prisma.watchlist.deleteMany({
      where: {
        profileId: profile.id,
        projectId,
      },
    });

    const watchlist = await prisma.watchlist.findMany({
      where: {
        profileId: profile.id,
      },
      include: {
        project: {
          select: {
            genre: true,
            creatorName: true,
          },
        },
      },
    });

    const genres = watchlist
      .map((item) => item.project.genre)
      .filter(Boolean) as string[];

    const creators = watchlist
      .map((item) => item.project.creatorName)
      .filter(Boolean) as string[];

    await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        favoriteGenres: JSON.stringify(genres),
        favoriteCreators: JSON.stringify(creators),
        lastRecommendationRefresh: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to remove from watchlist",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}