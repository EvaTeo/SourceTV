import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

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

return {
  guid: createdVideo.guid,
  iframeUrl: `https://iframe.mediadelivery.net/embed/${libraryId}/${createdVideo.guid}`,
  hlsUrl: `https://${cdnHost}/${createdVideo.guid}/playlist.m3u8`,
  thumbnailUrl: `https://${cdnHost}/${createdVideo.guid}/thumbnail.jpg`,
};

}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    const mainVideoFile = formData.get("mainVideoFile") as File | null;
    const trailerFile = formData.get("trailerFile") as File | null;

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
      videoUrl?: string;
      mainVideoUrl?: string;
      trailerUrl?: string;
      bunnyVideoId?: string;
      bunnyLibraryId?: string;
    } = {};

    let mainVideo = null;
    let trailerVideo = null;

    if (mainVideoFile && mainVideoFile.size > 0) {
      mainVideo = await uploadToBunny(
        `${existing.title} Main Video`,
        mainVideoFile
      );

      data.videoUrl = mainVideo.iframeUrl;
      data.mainVideoUrl = mainVideo.iframeUrl;
      data.bunnyVideoId = mainVideo.guid;
      data.bunnyLibraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
    }

    if (trailerFile && trailerFile.size > 0) {
      trailerVideo = await uploadToBunny(
        `${existing.title} Trailer`,
        trailerFile
      );

      data.trailerUrl = trailerVideo.hlsUrl;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No video file uploaded" },
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
      mainVideo,
      trailerVideo,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to upload video asset",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}