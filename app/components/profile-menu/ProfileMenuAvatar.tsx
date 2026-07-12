import type { StoredProfile } from "./profileMenuStorage";

export default function ProfileMenuAvatar({
  profile,
}: {
  profile: StoredProfile;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br ${
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
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.38),transparent_30%)]" />

          <span className="relative z-10 flex h-full w-full items-center justify-center font-black text-white">
            {profile.avatar}
          </span>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
    </div>
  );
}