import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const content = await prisma.projectSubmission.findMany({
    where: {
      status: "approved",
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(content);
}