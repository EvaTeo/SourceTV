import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { applicationId, status } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: "Missing applicationId or status" },
        { status: 400 }
      );
    }

    const updatedApplication =
      await prisma.partnerApplication.update({
        where: {
          id: applicationId,
        },
        data: {
          status,
        },
      });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error("UPDATE APPLICATION ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}