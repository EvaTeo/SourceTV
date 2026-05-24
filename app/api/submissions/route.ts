import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const submissions = await prisma.projectSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(submissions);
}