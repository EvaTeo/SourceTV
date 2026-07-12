import type { SourceProfile } from "../lib/profileStorage";

export default function ProfileAvatar({
  profile,
  active = false,
  compact = false,
}: {
  profile: SourceProfile;
  active?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${
          profile.color || "from-sky-300 to-blue-600"
        }`}
      >
        {profile.image ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${profile.image})`,
            }}
          />
        ) : (
          <span className="relative z-10 text-sm font-black text-white">
            {profile.avatar}
          </span>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10" />
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto flex aspect-square w-full max-w-[155px] items-center justify-center overflow-hidden rounded-[1.35rem] border transition-all duration-500 md:max-w-[190px] ${
        active
          ? "border-sky-300/80 shadow-[0_0_46px_rgba(56,189,248,0.4)]"
          : "border-white/10 shadow-[0_20px_46px_rgba(0,0,0,0.45)] group-hover:-translate-y-2 group-hover:scale-[1.035] group-hover:border-sky-300/55 group-hover:shadow-[0_0_40px_rgba(56,189,248,0.24)]"
      }`}
    >
      {profile.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url(${profile.image})`,
          }}
        />
      ) : (
        <>
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              profile.color || "from-sky-300 to-blue-600"
            } opacity-90`}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_28%)]" />

          <span className="relative z-10 text-5xl font-black text-white drop-shadow-[0_0_18px_rgba(0,0,0,0.5)] md:text-6xl">
            {profile.avatar}
          </span>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-white/10" />

      <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/10" />

      {active && (
        <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-transparent via-sky-200 to-transparent shadow-[0_0_22px_rgba(56,189,248,0.95)]" />
      )}
    </div>
  );
}