import type {
  ArtworkAssetType,
  ContentEditorForm,
  PartnerMessageInput,
  VideoAssetType,
} from "../types";

async function readJson(
  response: Response
) {
  return response
    .json()
    .catch(() => null);
}

export async function fetchContentEditorItem(
  id: string
): Promise<ContentEditorForm | null> {
  const response = await fetch(
    "/api/admin/content",
    {
      cache: "no-store",
    }
  );

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "Could not load content."
    );
  }

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    data.find(
      (entry: ContentEditorForm) =>
        entry.id === id
    ) || null
  );
}

export async function saveContentEditorItem(
  id: string,
  form: ContentEditorForm
) {
  const response = await fetch(
    `/api/admin/content/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        form
      ),
    }
  );

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        data?.message ||
        "Failed to save changes."
    );
  }

  return data;
}

export async function uploadContentArtwork(
  id: string,
  assetType: ArtworkAssetType,
  file: File
): Promise<ContentEditorForm> {
  const formData =
    new FormData();

  if (
    assetType === "poster"
  ) {
    formData.append(
      "posterFile",
      file
    );
  }

  if (
    assetType === "backdrop"
  ) {
    formData.append(
      "backdropFile",
      file
    );
  }

  if (
    assetType === "cardArt"
  ) {
    formData.append(
      "cardArtFile",
      file
    );
  }

  if (
    assetType === "titleLogo"
  ) {
    formData.append(
      "titleLogoFile",
      file
    );
  }

  const response = await fetch(
    `/api/admin/content/${id}/assets`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Asset upload failed."
    );
  }

  return data.project;
}

export async function uploadContentVideo(
  id: string,
  type: VideoAssetType,
  file: File
): Promise<ContentEditorForm> {
  const formData =
    new FormData();

  if (type === "main") {
    formData.append(
      "mainVideoFile",
      file
    );
  }

  if (type === "trailer") {
    formData.append(
      "trailerFile",
      file
    );
  }

  const response = await fetch(
    `/api/admin/content/${id}/videos`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Video upload failed."
    );
  }

  return data.project;
}

export async function sendContentPartnerMessage(
  id: string,
  input: PartnerMessageInput
) {
  const response = await fetch(
    `/api/admin/content/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        action:
          "send_message",
        ...input,
      }),
    }
  );

  const data =
    await readJson(response);

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "Could not send message."
    );
  }

  return data;
}