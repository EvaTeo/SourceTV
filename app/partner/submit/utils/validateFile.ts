import {
  MAX_IMAGE_SIZE,
  MAX_MAIN_VIDEO_SIZE,
  MAX_TRAILER_SIZE,
} from "../constants";

import type { UploadKey } from "../types";

export function validateFile(
  key: UploadKey,
  file: File
) {
  const videoUpload =
    key === "mainVideoFile" ||
    key === "trailerFile";

  if (
    videoUpload &&
    !file.type.startsWith("video/")
  ) {
    return "Please choose a valid video file.";
  }

  if (
    !videoUpload &&
    !file.type.startsWith("image/")
  ) {
    return "Please choose a valid image file.";
  }

  if (
    key === "mainVideoFile" &&
    file.size > MAX_MAIN_VIDEO_SIZE
  ) {
    return "The main video is larger than the current 10 GB upload limit.";
  }

  if (
    key === "trailerFile" &&
    file.size > MAX_TRAILER_SIZE
  ) {
    return "The trailer is larger than the current 3 GB upload limit.";
  }

  if (
    !videoUpload &&
    file.size > MAX_IMAGE_SIZE
  ) {
    return "Artwork files must be smaller than 20 MB.";
  }

  return "";
}