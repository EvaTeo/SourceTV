type BunnyUploadResult = {
  guid: string;
  iframeUrl: string;
  hlsUrl: string;
  thumbnailUrl: string;
};

export async function uploadVideoToBunny(
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
      `https://iframe.mediadelivery.net/embed/${libraryId}/${createdVideo.guid}`,

    hlsUrl:
      `https://${cdnHost}/${createdVideo.guid}/playlist.m3u8`,

    thumbnailUrl:
      `https://${cdnHost}/${createdVideo.guid}/thumbnail.jpg`,
  };
}