import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { applicationId, status, userId } = await req.json();

    if (!applicationId || !status || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.creatorApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    if (status === "approved") {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "creator" },
      });
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("CREATOR APPLICATION UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update creator application" },
      { status: 500 }
    );
  }
}