"use client";

function getYouTubeId(url: string) {
  if (!url.includes("/embed/")) return "";

  return url.split("/embed/")[1]?.split("?")[0] || "";
}

export default function HeroTrailer({
  videoUrl,
  thumbnailUrl,
}: {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
}) {
  const videoId = videoUrl ? getYouTubeId(videoUrl) : "";

  if (!videoId) {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: thumbnailUrl
            ? `linear-gradient(to right, rgba(0,0,0,0.98), rgba(0,0,0,0.72), rgba(0,0,0,0.2)), url(${thumbnailUrl})`
            : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.35), transparent 34%), linear-gradient(to right, black, #020617)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0`}
        className="h-full w-full scale-125 opacity-35"
        allow="autoplay; fullscreen"
        allowFullScreen
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
    </div>
  );
}