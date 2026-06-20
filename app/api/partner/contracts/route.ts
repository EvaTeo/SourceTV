import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (user.role !== "partner" && user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const contracts = await prisma.rightsContract.findMany({
      where:
        user.role === "admin"
          ? undefined
          : {
              partnerEmail: user.email,
              status: {
                in: [
                  "sent",
                  "viewed",
                  "signed",
                  "changes_requested",
                  "cancelled",
                  "expired",
                ],
              },
            },
      include: {
        project: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(contracts);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to load contracts",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}