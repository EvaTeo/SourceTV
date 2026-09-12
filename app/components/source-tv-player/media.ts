export function getHlsUrl(
  url?: string | null
) {
  if (!url) {
    return "";
  }

  const cleanUrl = url.trim();

  if (cleanUrl.includes("playlist.m3u8")) {
    return cleanUrl;
  }

  const bunnyMatch = cleanUrl.match(
    /(?:iframe\.mediadelivery\.net\/(?:embed|play)|(?:embed|play))\/(\d+)\/([a-zA-Z0-9-]+)/
  );

  if (!bunnyMatch) {
    return cleanUrl;
  }

  const videoGuid = bunnyMatch[2];

  const bunnyCdnHost =
    process.env
      .NEXT_PUBLIC_BUNNY_STREAM_CDN_HOST ||
    process.env.NEXT_PUBLIC_BUNNY_CDN_HOST ||
    "vz-ea77d4fd-c11.b-cdn.net";

  return `https://${bunnyCdnHost}/${videoGuid}/playlist.m3u8`;
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const totalSeconds = Math.max(
    0,
    Math.floor(seconds)
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(
      minutes
    ).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(
    secs
  ).padStart(2, "0")}`;
}