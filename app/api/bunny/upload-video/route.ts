import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
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

async function uploadToBunny(title: string, file: File) {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const apiKey = process.env.BUNNY_STREAM_API_KEY;

  if (!libraryId || !apiKey) {
    throw new Error("Missing Bunny environment variables");
  }

  const createRes = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    {
      method: "POST",
      headers: {
        AccessKey: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    }
  );

  const createdVideo = await createRes.json();

  if (!createRes.ok) {
    throw new Error("Failed to create Bunny video");
  }

  const arrayBuffer = await file.arrayBuffer();

  const uploadRes = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${createdVideo.guid}`,
    {
      method: "PUT",
      headers: {
        AccessKey: apiKey,
        "Content-Type": "application/octet-stream",
      },
      body: Buffer.from(arrayBuffer),
    }
  );

  if (!uploadRes.ok) {
    throw new Error("Failed to upload Bunny video");
  }

  const cdnHost = process.env.BUNNY_STREAM_CDN_HOST;

if (!cdnHost) {
  throw new Error("Missing BUNNY_STREAM_CDN_HOST");
}

const cdnHost = process.env.BUNNY_STREAM_CDN_HOST;

if (!cdnHost) {
  throw new Error("Missing BUNNY_STREAM_CDN_HOST");
}

return {
  guid: createdVideo.guid,
  iframeUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${createdVideo.guid}`,
  hlsUrl: `https://${cdnHost}/${createdVideo.guid}/playlist.m3u8`,
  thumbnailUrl: `https://${cdnHost}/${createdVideo.guid}/thumbnail.jpg`,
};
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const genre = formData.get("genre") as string;
    const maturityRating = formData.get("maturityRating") as string;
    const runtime = formData.get("runtime") as string;
    const creatorName = formData.get("creatorName") as string;
    const revenueShare = Number(formData.get("revenueShare") || 50);

    const mainVideoFile = formData.get("mainVideoFile") as File;
    const trailerFile = formData.get("trailerFile") as File | null;
    const thumbnailFile = formData.get("thumbnailFile") as File | null;
    const backdropFile = formData.get("backdropFile") as File | null;
    const titleLogoFile = formData.get("titleLogoFile") as File | null;

    if (!title || !description || !type || !genre || !mainVideoFile) {
      return NextResponse.json(
        {
          error:
            "Title, description, type, genre, and main video are required",
        },
        { status: 400 }
      );
    }

    const mainVideo = await uploadToBunny(title, mainVideoFile);

    let trailerVideo = null;

    if (trailerFile && trailerFile.size > 0) {
      trailerVideo = await uploadToBunny(
        `${title} Trailer`,
        trailerFile
      );
    }

    const uploadedThumbnailUrl = await saveImage(
      thumbnailFile,
      "poster"
    );

    const uploadedBackdropUrl = await saveImage(
      backdropFile,
      "backdrop"
    );

    const uploadedTitleLogoUrl = await saveImage(
      titleLogoFile,
      "title-logo"
    );

    const finalThumbnailUrl =
      uploadedThumbnailUrl || mainVideo.thumbnailUrl;

    const finalBackdropUrl =
      uploadedBackdropUrl || finalThumbnailUrl;

    const project = await prisma.projectSubmission.create({
      data: {
        title,
        description,
        type,
        genre,

        videoUrl: mainVideo.playbackUrl,
        mainVideoUrl: mainVideo.playbackUrl,

trailerUrl: trailerVideo?.hlsUrl || "",

        thumbnailUrl: finalThumbnailUrl,
        backdropUrl: finalBackdropUrl,

        titleLogoUrl: uploadedTitleLogoUrl || null,

        maturityRating: maturityRating || "Not Rated",
        runtime: runtime || "",

        creatorName: creatorName || "Unknown Creator",

        revenueShare,

        status: "pending",
        scheduledAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      project,
      mainVideo,
      trailerVideo,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Upload failed",
        message: error?.message,
      },
      { status: 500 }
    );
  }
}