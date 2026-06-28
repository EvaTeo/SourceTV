import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const body = await req.json();

    const fullName = String(body.name || "").trim();
    const email = String(body.email || currentUser?.email || "")
      .trim()
      .toLowerCase();
    const workType = String(body.creatorType || "").trim();
    const bio = String(body.bio || "").trim();

    if (!fullName || !email || !workType || !bio) {
      return NextResponse.json(
        { error: "Name, email, creator type, and bio are required." },
        { status: 400 }
      );
    }

    let user = currentUser;

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Please create an account or log in before applying." },
        { status: 401 }
      );
    }

    const existingApplication = await prisma.partnerApplication.findFirst({
      where: {
        userId: user.id,
        status: {
          in: ["pending", "approved"],
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You already have an application in review or approved." },
        { status: 409 }
      );
    }

    const application = await prisma.partnerApplication.create({
      data: {
        userId: user.id,
        fullName,
        email,
        workType,
        bio,
        status: "pending",
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("CREATOR APPLY ERROR:", error);

    return NextResponse.json(
      { error: "Failed to submit application." },
      { status: 500 }
    );
  }
}