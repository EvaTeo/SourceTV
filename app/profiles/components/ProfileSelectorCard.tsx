"use client";

import type { SourceProfile } from "../lib/profileStorage";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileSelectorCard({
  profile,
  active,
  index,
  selecting,
  onSelect,
}: {
  profile: SourceProfile;
  active: boolean;
  index: number;
  selecting: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={selecting}
      className="group w-full rounded-[1.35rem] text-center opacity-0 outline-none animate-[profileSelectorCardIn_580ms_cubic-bezier(0.16,1,0.3,1)_forwards] focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black disabled:pointer-events-none"
      style={{
        animationDelay: `${index * 90}ms`,
      }}
      aria-label={`Continue as ${profile.name}`}
    >
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          selecting
            ? active
              ? "scale-[1.08] opacity-100"
              : "scale-[0.96] opacity-25 blur-[2px]"
            : ""
        }`}
      >
        <ProfileAvatar
          profile={profile}
          active={active}
        />

        <p
          className={`mt-4 text-base font-black transition duration-300 md:text-lg ${
            active
              ? "text-sky-200"
              : "text-white/58 group-hover:text-white"
          }`}
        >
          {profile.name}
        </p>

        <p
          className={`mt-1 text-[10px] font-black uppercase tracking-[0.18em] transition duration-300 ${
            active
              ? "text-sky-300/65"
              : "text-transparent group-hover:text-white/28"
          }`}
        >
          {active ? "Last Used" : "Select"}
        </p>
      </div>
    </button>
  );
}