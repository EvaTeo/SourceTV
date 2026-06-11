import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const applications = await prisma.partnerApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load partner applications",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { applicationId, action, adminNotes } = await req.json();

    if (!applicationId || !action) {
      return NextResponse.json(
        { error: "Application ID and action are required" },
        { status: 400 }
      );
    }

    const application = await prisma.partnerApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      await prisma.user.update({
        where: { id: application.userId },
        data: {
          role: "partner",
        },
      });

      const updated = await prisma.partnerApplication.update({
        where: { id: applicationId },
        data: {
          status: "approved",
          adminNotes: adminNotes || application.adminNotes,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        application: updated,
      });
    }

    if (action === "reject") {
      const updated = await prisma.partnerApplication.update({
        where: { id: applicationId },
        data: {
          status: "rejected",
          adminNotes: adminNotes || application.adminNotes,
          reviewedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        application: updated,
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update partner application",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}