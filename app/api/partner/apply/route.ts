import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.fullName || !body.email || !body.reason) {
      return NextResponse.json(
        { error: "Full name, email, and reason are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.partnerApplication.findFirst({
      where: {
        userId: user.id,
        status: "pending",
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending partner application" },
        { status: 409 }
      );
    }

    const application = await prisma.partnerApplication.create({
      data: {
        userId: user.id,
        fullName: body.fullName,
        email: body.email,
        company: body.company || null,
        roleTitle: body.roleTitle || null,
        website: body.website || null,
        portfolio: body.portfolio || null,
        workType: body.workType || null,
        bio: body.bio || null,
        reason: body.reason,
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to submit partner application",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}