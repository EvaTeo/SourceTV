"use client";

import { useState } from "react";

import {
  uploadContentArtwork,
  uploadContentVideo,
} from "../lib/contentEditorApi";

import type {
  ArtworkAssetType,
  ContentEditorForm,
  VideoAssetType,
} from "../types";

type UseContentAssetUploadsInput = {
  id: string;

  onProjectUpdated: (
    project: ContentEditorForm
  ) => void;
};

export default function useContentAssetUploads({
  id,
  onProjectUpdated,
}: UseContentAssetUploadsInput) {
  const [
    posterFile,
    setPosterFile,
  ] = useState<File | null>(
    null
  );

  const [
    backdropFile,
    setBackdropFile,
  ] = useState<File | null>(
    null
  );

  const [
    cardArtFile,
    setCardArtFile,
  ] = useState<File | null>(
    null
  );

  const [
    titleLogoFile,
    setTitleLogoFile,
  ] = useState<File | null>(
    null
  );

  const [
    assetUploading,
    setAssetUploading,
  ] = useState("");

  const [
    mainVideoFile,
    setMainVideoFile,
  ] = useState<File | null>(
    null
  );

  const [
    trailerVideoFile,
    setTrailerVideoFile,
  ] = useState<File | null>(
    null
  );

  const [
    videoUploading,
    setVideoUploading,
  ] = useState("");

  async function uploadAsset(
    assetType: ArtworkAssetType
  ) {
    const selectedFile =
      assetType === "poster"
        ? posterFile
        : assetType ===
            "backdrop"
          ? backdropFile
          : assetType ===
              "cardArt"
            ? cardArtFile
            : titleLogoFile;

    if (!selectedFile) {
      window.alert(
        "Choose a file first."
      );

      return;
    }

    try {
      setAssetUploading(
        assetType
      );

      const project =
        await uploadContentArtwork(
          id,
          assetType,
          selectedFile
        );

      onProjectUpdated(
        project
      );

      if (
        assetType ===
        "poster"
      ) {
        setPosterFile(null);
      }

      if (
        assetType ===
        "backdrop"
      ) {
        setBackdropFile(
          null
        );
      }

      if (
        assetType ===
        "cardArt"
      ) {
        setCardArtFile(null);
      }

      if (
        assetType ===
        "titleLogo"
      ) {
        setTitleLogoFile(
          null
        );
      }

      window.alert(
        "Asset uploaded."
      );
    } catch (error) {
      console.error(
        "CONTENT ASSET UPLOAD ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Asset upload failed"
      );
    } finally {
      setAssetUploading(
        ""
      );
    }
  }

  async function uploadVideoAsset(
    type: VideoAssetType
  ) {
    const selectedFile =
      type === "main"
        ? mainVideoFile
        : trailerVideoFile;

    if (!selectedFile) {
      window.alert(
        "Choose a video first."
      );

      return;
    }

    try {
      setVideoUploading(
        type
      );

      const project =
        await uploadContentVideo(
          id,
          type,
          selectedFile
        );

      onProjectUpdated(
        project
      );

      if (
        type === "main"
      ) {
        setMainVideoFile(
          null
        );
      }

      if (
        type === "trailer"
      ) {
        setTrailerVideoFile(
          null
        );
      }

      window.alert(
        "Video updated."
      );
    } catch (error) {
      console.error(
        "CONTENT VIDEO UPLOAD ERROR:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Video upload failed"
      );
    } finally {
      setVideoUploading(
        ""
      );
    }
  }

  return {
    posterFile,
    backdropFile,
    cardArtFile,
    titleLogoFile,

    assetUploading,

    setPosterFile,
    setBackdropFile,
    setCardArtFile,
    setTitleLogoFile,

    uploadAsset,

    mainVideoFile,
    trailerVideoFile,

    videoUploading,

    setMainVideoFile,
    setTrailerVideoFile,

    uploadVideoAsset,
  };
}