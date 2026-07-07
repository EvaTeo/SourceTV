import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  const [
    users,
    content,
    applications,
    campaigns,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.projectSubmission.count(),
    prisma.partnerApplication.count(),
    prisma.adCampaign.count(),
  ]);

  return NextResponse.json({
    users,
    content,
    applications,
    campaigns,
  });
}