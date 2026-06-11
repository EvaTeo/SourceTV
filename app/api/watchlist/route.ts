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
        maturityRating: item.project.maturityRating,
        runtime: item.project.runtime,
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

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const profile = await getOrCreateProfile(user.id);

    await prisma.watchlist.upsert({
      where: {
        profileId_projectId: {
          profileId: profile.id,
          projectId,
        },
      },
      update: {},
      create: {
        profileId: profile.id,
        projectId,
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

    const { projectId } = await req.json();

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