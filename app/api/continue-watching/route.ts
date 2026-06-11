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
      return NextResponse.json([], { status: 200 });
    }

    const profile = await getOrCreateProfile(user.id);

    const items = await prisma.continueWatching.findMany({
      where: {
        profileId: profile.id,
      },
      include: {
        project: true,
      },
      orderBy: {
        watchedAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load continue watching",
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
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const {
      projectId,
      progress = 0,
      currentTime = 0,
      duration = 0,
    } = await req.json();

    const profile = await getOrCreateProfile(user.id);

    await prisma.continueWatching.upsert({
      where: {
        profileId_projectId: {
          profileId: profile.id,
          projectId,
        },
      },
      update: {
        progress,
        currentTime,
        duration,
        watchedAt: new Date(),
      },
      create: {
        profileId: profile.id,
        projectId,
        progress,
        currentTime,
        duration,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to save continue watching",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}