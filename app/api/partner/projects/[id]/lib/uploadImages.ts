import { mkdir, writeFile } from "fs/promises";
import path from "path";

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

async function saveImage(
  file: File | null,
  prefix: string
) {
  if (!file) {
    return null;
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

  const filename =
    `${safePrefix}-${Date.now()}-${crypto
      .randomUUID()
      .slice(0, 8)}.${extension}`;

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

type UploadImageInput = {
  title: string;
  thumbnailFile: File | null;
  backdropFile: File | null;
  titleLogoFile: File | null;
};

export async function uploadImages({
  title,
  thumbnailFile,
  backdropFile,
  titleLogoFile,
}: UploadImageInput) {
  const thumbnailUrl =
    await saveImage(
      thumbnailFile,
      `${title}-poster`
    );

  const backdropUrl =
    await saveImage(
      backdropFile,
      `${title}-backdrop`
    );

  const titleLogoUrl =
    await saveImage(
      titleLogoFile,
      `${title}-title-logo`
    );

  return {
    thumbnailUrl,
    backdropUrl,
    titleLogoUrl,
  };
}