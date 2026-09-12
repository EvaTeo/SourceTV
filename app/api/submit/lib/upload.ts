import {
  uploadVideoToBunny,
  type BunnyUploadResult,
} from "@/app/api/lib/bunny";

import type { SubmissionForm } from "./form";
import { saveImage } from "./images";

export type SubmissionUploads = {
  mainVideo: BunnyUploadResult;
  trailerVideo: BunnyUploadResult | null;

  thumbnailUrl: string;
  backdropUrl: string;
  titleLogoUrl: string | null;
};

export async function uploadSubmissionAssets(
  form: SubmissionForm
): Promise<SubmissionUploads> {
  const mainVideo =
    await uploadVideoToBunny(
      form.title,
      form.mainVideoFile
    );

  let trailerVideo:
    | BunnyUploadResult
    | null = null;

  if (form.trailerFile) {
    trailerVideo =
      await uploadVideoToBunny(
        `${form.title} Trailer`,
        form.trailerFile
      );
  }

  const uploadedThumbnailUrl =
    await saveImage(
      form.thumbnailFile,
      `${form.title}-poster`
    );

  const uploadedBackdropUrl =
    await saveImage(
      form.backdropFile,
      `${form.title}-backdrop`
    );

  const uploadedTitleLogoUrl =
    await saveImage(
      form.titleLogoFile,
      `${form.title}-title-logo`
    );

  return {
    mainVideo,
    trailerVideo,

    thumbnailUrl:
      uploadedThumbnailUrl ||
      mainVideo.thumbnailUrl,

    backdropUrl:
      uploadedBackdropUrl ||
      uploadedThumbnailUrl ||
      mainVideo.thumbnailUrl,

    titleLogoUrl:
      uploadedTitleLogoUrl || null,
  };
}