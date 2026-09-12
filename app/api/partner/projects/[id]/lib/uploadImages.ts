import { saveImage } from "@/app/api/lib/images";

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