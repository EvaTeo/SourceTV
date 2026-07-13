import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  let settings =
    await prisma.platformSettings.findFirst();

  if (!settings) {
    settings =
      await prisma.platformSettings.create({
        data: {},
      });
  }

  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const body = await request.json();

  let settings =
    await prisma.platformSettings.findFirst();

  if (!settings) {
    settings =
      await prisma.platformSettings.create({
        data: {},
      });
  }

  const updated =
    await prisma.platformSettings.update({
      where: {
        id: settings.id,
      },
      data: body,
    });

  return NextResponse.json(updated);
}