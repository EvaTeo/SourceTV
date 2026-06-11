import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

const allowedStatuses = [
  "draft",
  "pending",
  "approved",
  "rejected",
  "private",
  "unlisted",
  "archived",
];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const status = body.status;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updated = await prisma.projectSubmission.update({
      where: { id },
      data: {
        status,
        scheduledAt:
          body.scheduledAt && body.scheduledAt !== ""
            ? new Date(body.scheduledAt)
            : null,
      },
    });

    return NextResponse.json({
      success: true,
      project: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to update status",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}