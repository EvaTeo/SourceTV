import { prisma } from "@/app/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

async function saveImage(file: File | null, prefix: string) {
  if (!file || file.size === 0) return "";

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${prefix}-${Date.now()}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const posterFile = formData.get("posterFile") as File | null;
    const backdropFile = formData.get("backdropFile") as File | null;
    const titleLogoFile = formData.get("titleLogoFile") as File | null;
    const cardArtFile = formData.get("cardArtFile") as File | null;

    const existing = await prisma.projectSubmission.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    const data: {
      thumbnailUrl?: string;
      backdropUrl?: string;
      titleLogoUrl?: string;
      cardArtUrl?: string;
    } = {};

    const uploadedPosterUrl = await saveImage(posterFile, "poster");
    const uploadedBackdropUrl = await saveImage(backdropFile, "backdrop");
    const uploadedTitleLogoUrl = await saveImage(titleLogoFile, "title-logo");
    const uploadedCardArtUrl = await saveImage(cardArtFile, "card-art");

    if (uploadedPosterUrl) data.thumbnailUrl = uploadedPosterUrl;
    if (uploadedBackdropUrl) data.backdropUrl = uploadedBackdropUrl;
    if (uploadedTitleLogoUrl) data.titleLogoUrl = uploadedTitleLogoUrl;
    if (uploadedCardArtUrl) data.cardArtUrl = uploadedCardArtUrl;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No asset file uploaded" },
        { status: 400 }
      );
    }

    const updated = await prisma.projectSubmission.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      project: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to upload asset",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}