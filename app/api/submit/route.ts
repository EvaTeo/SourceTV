import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export const runtime = "nodejs";

const MAX_MAIN_VIDEO_SIZE = 10 * 1024 * 1024 * 1024;
const MAX_TRAILER_SIZE = 3 * 1024 * 1024 * 1024;
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

type BunnyUploadResult = {
  guid: string;
  iframeUrl: string;
  hlsUrl: string;
  thumbnailUrl: string;
};

function cleanString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getFile(
  formData: FormData,
  key: string
): File | null {
  const value = formData.get(key);

  if (!(value instanceof File)) {
    return null;
  }

  if (value.size === 0) {
    return null;
  }

  return value;
}

function sanitizeFilePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function getSafeExtension(file: File) {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  if (extension) {
    return extension;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function validateVideoFile(
  file: File,
  label: string,
  maximumSize: number
) {
  if (!file.type.startsWith("video/")) {
    return `${label} must be a valid video file.`;
  }

  if (file.size > maximumSize) {
    return `${label} exceeds the current upload limit.`;
  }

  return null;
}

function validateImageFile(
  file: File,
  label: string
) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    return `${label} must be a JPG, PNG, or WebP image.`;
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return `${label} must be smaller than 20 MB.`;
  }

  return null;
}

async function saveImage(
  file: File | null,
  prefix: string
) {
  if (!file) {
    return "";
  }

  const uploadDirectory = path.join(
    process.cwd(),
    "public",
    "uploads"
  );

  await mkdir(uploadDirectory, {
    recursive: true,
  });

  const extension = getSafeExtension(file);
  const safePrefix =
    sanitizeFilePart(prefix) || "artwork";

  const filename = `${safePrefix}-${Date.now()}-${crypto.randomUUID().slice(
    0,
    8
  )}.${extension}`;

  const filePath = path.join(
    uploadDirectory,
    filename
  );

  const bytes = await file.arrayBuffer();

  await writeFile(
    filePath,
    Buffer.from(bytes)
  );

  return `/uploads/${filename}`;
}

async function uploadVideoToBunny(
  title: string,
  file: File
): Promise<BunnyUploadResult> {
  const libraryId =
    process.env.BUNNY_STREAM_LIBRARY_ID;

  const apiKey =
    process.env.BUNNY_STREAM_API_KEY;

  const cdnHost =
    process.env.BUNNY_STREAM_CDN_HOST;

  if (!libraryId || !apiKey || !cdnHost) {
    throw new Error(
      "Bunny Stream environment variables are missing."
    );
  }

  const createResponse = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    {
      method: "POST",
      headers: {
        AccessKey: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    }
  );

  const createdText =
    await createResponse.text();

  let createdVideo: {
    guid?: string;
    message?: string;
  } = {};

  try {
    createdVideo = createdText
      ? JSON.parse(createdText)
      : {};
  } catch {
    createdVideo = {};
  }

  if (
    !createResponse.ok ||
    !createdVideo.guid
  ) {
    throw new Error(
      createdVideo.message ||
        "Bunny Stream could not create the video record."
    );
  }

  const videoBytes =
    await file.arrayBuffer();

  const uploadResponse = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos/${createdVideo.guid}`,
    {
      method: "PUT",
      headers: {
        AccessKey: apiKey,
        "Content-Type":
          "application/octet-stream",
      },
      body: Buffer.from(videoBytes),
    }
  );

  if (!uploadResponse.ok) {
    const uploadMessage =
      await uploadResponse.text();

    throw new Error(
      uploadMessage ||
        "Bunny Stream could not upload the video."
    );
  }

  return {
    guid: createdVideo.guid,

    iframeUrl:
      `https://iframe.mediadelivery.net/embed/` +
      `${libraryId}/${createdVideo.guid}`,

    hlsUrl:
      `https://${cdnHost}/` +
      `${createdVideo.guid}/playlist.m3u8`,

    thumbnailUrl:
      `https://${cdnHost}/` +
      `${createdVideo.guid}/thumbnail.jpg`,
  };
}

export async function POST(
  request: Request
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Not logged in.",
        },
        {
          status: 401,
        }
      );
    }

    if (
      user.role !== "partner" &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Only approved SourceTV partners can submit projects.",
        },
        {
          status: 403,
        }
      );
    }

    const contentType =
      request.headers.get("content-type") || "";

    if (
      !contentType.includes(
        "multipart/form-data"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "This endpoint requires a multipart project submission.",
        },
        {
          status: 415,
        }
      );
    }

    const formData =
      await request.formData();

    const title = cleanString(
      formData.get("title")
    );

    const description = cleanString(
      formData.get("description")
    );

    const type =
      cleanString(formData.get("type")) ||
      "Film";

    const genre =
      cleanString(formData.get("genre")) ||
      "Drama";

    const yearValue = cleanString(
      formData.get("year")
    );

    const maturityRating =
      cleanString(
        formData.get("maturityRating")
      ) || "Not Rated";

    const runtime = cleanString(
      formData.get("runtime")
    );

    const creatorName = cleanString(
      formData.get("creatorName")
    );

    const creatorCompany = cleanString(
      formData.get("creatorCompany")
    );

    const mainVideoFile = getFile(
      formData,
      "mainVideoFile"
    );

    const trailerFile = getFile(
      formData,
      "trailerFile"
    );

    const thumbnailFile = getFile(
      formData,
      "thumbnailFile"
    );

    const backdropFile = getFile(
      formData,
      "backdropFile"
    );

    const titleLogoFile = getFile(
      formData,
      "titleLogoFile"
    );

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Project title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          error:
            "Project description is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!mainVideoFile) {
      return NextResponse.json(
        {
          error:
            "A main project video is required.",
        },
        {
          status: 400,
        }
      );
    }

    const mainVideoError =
      validateVideoFile(
        mainVideoFile,
        "Main project video",
        MAX_MAIN_VIDEO_SIZE
      );

    if (mainVideoError) {
      return NextResponse.json(
        {
          error: mainVideoError,
        },
        {
          status: 400,
        }
      );
    }

    if (trailerFile) {
      const trailerError =
        validateVideoFile(
          trailerFile,
          "Trailer",
          MAX_TRAILER_SIZE
        );

      if (trailerError) {
        return NextResponse.json(
          {
            error: trailerError,
          },
          {
            status: 400,
          }
        );
      }
    }

    const imageFiles: Array<{
      file: File | null;
      label: string;
    }> = [
      {
        file: thumbnailFile,
        label: "Poster",
      },
      {
        file: backdropFile,
        label: "Backdrop",
      },
      {
        file: titleLogoFile,
        label: "Title logo",
      },
    ];

    for (const item of imageFiles) {
      if (!item.file) {
        continue;
      }

      const imageError =
        validateImageFile(
          item.file,
          item.label
        );

      if (imageError) {
        return NextResponse.json(
          {
            error: imageError,
          },
          {
            status: 400,
          }
        );
      }
    }

    const parsedYear = yearValue
      ? Number(yearValue)
      : null;

    if (
      parsedYear !== null &&
      (!Number.isFinite(parsedYear) ||
        parsedYear < 1888 ||
        parsedYear > 2100)
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid release year.",
        },
        {
          status: 400,
        }
      );
    }

    const settings =
      await prisma.platformSettings.findFirst({
        select: {
          defaultRevenueShare: true,
        },
      });

    const configuredRevenueShare =
      settings?.defaultRevenueShare ?? 50;

    const safeRevenueShare =
      Number.isFinite(
        configuredRevenueShare
      ) &&
      configuredRevenueShare >= 0 &&
      configuredRevenueShare <= 100
        ? Math.round(
            configuredRevenueShare
          )
        : 50;

    const mainVideo =
      await uploadVideoToBunny(
        title,
        mainVideoFile
      );

    let trailerVideo:
      | BunnyUploadResult
      | null = null;

    if (trailerFile) {
      trailerVideo =
        await uploadVideoToBunny(
          `${title} Trailer`,
          trailerFile
        );
    }

    const uploadedThumbnailUrl =
      await saveImage(
        thumbnailFile,
        `${title}-poster`
      );

    const uploadedBackdropUrl =
      await saveImage(
        backdropFile,
        `${title}-backdrop`
      );

    const uploadedTitleLogoUrl =
      await saveImage(
        titleLogoFile,
        `${title}-title-logo`
      );

    const finalThumbnailUrl =
      uploadedThumbnailUrl ||
      mainVideo.thumbnailUrl;

    const finalBackdropUrl =
      uploadedBackdropUrl ||
      finalThumbnailUrl;

    const submission =
      await prisma.projectSubmission.create({
        data: {
          title,
          description,
          type,
          genre,

          year:
            parsedYear !== null
              ? Math.round(parsedYear)
              : undefined,

          videoUrl: mainVideo.hlsUrl,
          mainVideoUrl:
            mainVideo.hlsUrl,

          trailerUrl:
            trailerVideo?.hlsUrl ||
            null,

          thumbnailUrl:
            finalThumbnailUrl,

          backdropUrl:
            finalBackdropUrl,

          titleLogoUrl:
            uploadedTitleLogoUrl ||
            null,

          maturityRating,
          runtime: runtime || null,

          creatorName:
            creatorName ||
            user.name ||
            "SourceTV Partner",

          creatorEmail: user.email,

          creatorCompany:
            creatorCompany || null,

          revenueShare:
            safeRevenueShare,

          workflowStage: "submission",
          status: "pending",
          scheduledAt: null,
        },
      });

    return NextResponse.json(
      {
        success: true,
        submission,
        uploads: {
          mainVideo,
          trailerVideo,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "SUBMIT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to upload and submit project.",

        message:
          error instanceof Error
            ? error.message
            : "Unknown submission error.",
      },
      {
        status: 500,
      }
    );
  }
}