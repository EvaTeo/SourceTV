import type { SourceProfile } from "../lib/profileStorage";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileCard({
  profile,
  active,
  index,
  onSelect,
  onEdit,
}: {
  profile: SourceProfile;
  active: boolean;
  index: number;
  onSelect: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className="group text-center opacity-0 animate-[profileCardIn_560ms_ease_forwards]"
      style={{
        animationDelay: `${index * 90}ms`,
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full rounded-[1.35rem] outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      >
        <ProfileAvatar
          profile={profile}
          active={active}
        />

        <p
          className={`mt-4 text-base font-black transition md:text-lg ${
            active
              ? "text-sky-200"
              : "text-white/62 group-hover:text-white"
          }`}
        >
          {profile.name}
        </p>

        <p
          className={`mt-1 text-[10px] font-black uppercase tracking-[0.18em] transition ${
            active
              ? "text-sky-300/70"
              : "text-transparent group-hover:text-white/30"
          }`}
        >
          {active ? "Active" : "Select"}
        </p>
      </button>

      <button
        type="button"
        onClick={onEdit}
        className="mt-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black text-white/45 backdrop-blur-xl transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
      >
        Edit
      </button>
    </div>
  );
}