"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

type SourceProfile = {
  id: string;
  name: string;
  avatar: string;
  color?: string;
  image?: string;
};

const defaultProfiles: SourceProfile[] = [
  {
    id: "main",
    name: "Adan",
    avatar: "A",
    color: "from-sky-300 to-blue-600",
  },
  {
    id: "guest",
    name: "Guest",
    avatar: "G",
    color: "from-white to-zinc-500",
  },
];

const avatarColors = [
  "from-sky-300 to-blue-600",
  "from-fuchsia-300 to-purple-700",
  "from-emerald-300 to-teal-700",
  "from-amber-300 to-orange-700",
  "from-rose-300 to-red-700",
  "from-white to-zinc-500",
];

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<SourceProfile[]>(defaultProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<SourceProfile | null>(
    null
  );
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sourcetv_profiles");

      if (!stored) {
        localStorage.setItem(
          "sourcetv_profiles",
          JSON.stringify(defaultProfiles)
        );

        setProfiles(defaultProfiles);
      } else {
        const parsed = JSON.parse(stored);

        const repaired = parsed.map((profile: any, index: number) => ({
          id: profile.id || `profile-${index}`,
          name: profile.name || `Profile ${index + 1}`,
          avatar:
            typeof profile.avatar === "string" && profile.avatar.length > 0
              ? profile.avatar
              : index === 0
              ? "A"
              : "G",
          color:
            profile.color ||
            (index === 0
              ? "from-sky-300 to-blue-600"
              : "from-white to-zinc-500"),
          image: profile.image || "",
        }));

        setProfiles(repaired);

        localStorage.setItem("sourcetv_profiles", JSON.stringify(repaired));
      }

      const active = localStorage.getItem("sourcetv_active_profile");

      if (active) {
        const parsedActive = JSON.parse(active);

        if (parsedActive?.id) {
          setActiveProfileId(parsedActive.id);
        }
      }
    } catch (error) {
      console.error("PROFILE STORAGE ERROR:", error);

      localStorage.setItem(
        "sourcetv_profiles",
        JSON.stringify(defaultProfiles)
      );

      setProfiles(defaultProfiles);
    }
  }, []);

  function saveProfiles(nextProfiles: SourceProfile[]) {
    setProfiles(nextProfiles);
    localStorage.setItem("sourcetv_profiles", JSON.stringify(nextProfiles));

    const active = nextProfiles.find((profile) => profile.id === activeProfileId);

    if (active) {
      localStorage.setItem("sourcetv_active_profile", JSON.stringify(active));
    }
  }

  function chooseProfile(profile: SourceProfile) {
    localStorage.setItem("sourcetv_active_profile", JSON.stringify(profile));
    setActiveProfileId(profile.id);
    window.location.href = "/browse";
  }

  function openEditor(profile: SourceProfile) {
    setEditingProfile(profile);
    setEditingName(profile.name);
  }

  function closeEditor() {
    setEditingProfile(null);
    setEditingName("");
  }

  function saveProfileEdits() {
    if (!editingProfile) return;

    const nextProfiles = profiles.map((profile) => {
      if (profile.id !== editingProfile.id) return profile;

      const cleanName = editingName.trim() || profile.name;

      return {
        ...profile,
        name: cleanName,
        avatar: cleanName.charAt(0).toUpperCase(),
      };
    });

    saveProfiles(nextProfiles);
    closeEditor();
  }

  function updateColor(color: string) {
    if (!editingProfile) return;

    const updatedProfile = {
      ...editingProfile,
      color,
    };

    setEditingProfile(updatedProfile);

    const nextProfiles = profiles.map((profile) =>
      profile.id === updatedProfile.id ? updatedProfile : profile
    );

    saveProfiles(nextProfiles);
  }

  function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    if (!editingProfile) return;

    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const image = String(reader.result || "");

      const updatedProfile = {
        ...editingProfile,
        image,
      };

      setEditingProfile(updatedProfile);

      const nextProfiles = profiles.map((profile) =>
        profile.id === updatedProfile.id ? updatedProfile : profile
      );

      saveProfiles(nextProfiles);
    };

    reader.readAsDataURL(file);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-32 pt-24 text-white md:px-10 md:pb-16 md:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_34%),linear-gradient(to_bottom,#020617_0%,#000_72%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl flex-col items-center justify-center text-center">
        <Link href="/" className="text-3xl font-black tracking-tight">
          Source<span className="text-sky-400">TV</span>
        </Link>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:mt-10 md:text-sm">
          Profile Selection
        </p>

        <h1 className="mt-4 text-4xl font-black leading-[0.95] md:text-7xl">
          Who’s watching?
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/55 md:text-base md:leading-7">
          Choose a profile to continue watching, save titles, and personalize
          your SourceTV experience.
        </p>

        <div className="mt-9 grid w-full max-w-4xl grid-cols-2 gap-5 md:mt-14 md:grid-cols-4 md:gap-7">
          {profiles.map((profile) => {
            const active = activeProfileId === profile.id;

            return (
              <div key={profile.id} className="group text-center">
                <button
                  onClick={() => chooseProfile(profile)}
                  className="w-full"
                >
                  <ProfileAvatar profile={profile} active={active} />

                  <p
                    className={`mt-4 text-base font-black transition md:text-lg ${
                      active
                        ? "text-sky-200"
                        : "text-white/65 group-hover:text-white"
                    }`}
                  >
                    {profile.name}
                  </p>

                  {active && (
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-300/70">
                      Active
                    </p>
                  )}
                </button>

                <button
                  onClick={() => openEditor(profile)}
                  className="mt-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-white/50 backdrop-blur-xl transition hover:border-sky-300/40 hover:text-sky-200"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/browse"
            className="rounded-full bg-sky-400 px-8 py-3 text-sm font-black text-black shadow-[0_0_35px_rgba(56,189,248,0.4)] transition hover:bg-sky-300"
          >
            Continue
          </Link>

          <button
            onClick={() => openEditor(profiles[0])}
            className="rounded-full border border-white/15 bg-white/[0.05] px-8 py-3 text-sm font-black text-white/65 backdrop-blur-xl transition hover:border-sky-300/40 hover:text-sky-200"
          >
            Manage Profiles
          </button>
        </div>
      </div>

      {editingProfile && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/60 px-4 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-t-[2rem] border border-white/10 bg-[rgba(10,10,10,0.78)] p-5 shadow-[0_0_80px_rgba(0,0,0,0.65)] backdrop-blur-3xl md:rounded-[2rem] md:p-7">
            <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-sky-300/60 to-transparent shadow-[0_0_22px_rgba(56,189,248,0.8)]" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
                  Edit Profile
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {editingProfile.name}
                </h2>
              </div>

              <button
                onClick={closeEditor}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl font-black text-white/65 transition hover:border-sky-300/40 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-[150px_1fr] md:items-start">
              <div className="mx-auto w-[150px]">
                <ProfileAvatar profile={editingProfile} active />

                <label className="mt-4 block cursor-pointer rounded-full border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-xs font-black text-white/70 backdrop-blur-xl transition hover:border-sky-300/50 hover:text-sky-200">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-[0.25em] text-white/45">
                  Profile Name
                </label>

                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/45 px-4 py-3 font-bold text-white outline-none backdrop-blur-xl placeholder:text-white/30 focus:border-sky-300/60"
                  placeholder="Profile name"
                />

                <p className="mt-5 text-xs font-black uppercase tracking-[0.25em] text-white/45">
                  Avatar Glow
                </p>

                <div className="mt-3 grid grid-cols-6 gap-2">
                  {avatarColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateColor(color)}
                      className={`h-9 rounded-full bg-gradient-to-br ${color} transition hover:scale-110 ${
                        editingProfile.color === color
                          ? "ring-2 ring-sky-300 ring-offset-2 ring-offset-black"
                          : ""
                      }`}
                      aria-label="Choose avatar color"
                    />
                  ))}
                </div>

                <div className="mt-7 flex gap-3">
                  <button
                    onClick={saveProfileEdits}
                    className="flex-1 rounded-full bg-sky-400 px-6 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(56,189,248,0.35)] transition hover:bg-sky-300"
                  >
                    Save
                  </button>

                  <button
                    onClick={closeEditor}
                    className="flex-1 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-black text-white/65 backdrop-blur-xl transition hover:border-white/30 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <p className="mt-4 text-xs leading-5 text-white/35">
                  Uploaded photos are saved locally in your browser for now.
                  Later, this can connect to real accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ProfileAvatar({
  profile,
  active,
}: {
  profile: SourceProfile;
  active?: boolean;
}) {
  return (
    <div
      className={`relative mx-auto flex aspect-square w-full max-w-[155px] items-center justify-center overflow-hidden rounded-[2rem] border transition-all duration-300 md:max-w-[190px] ${
        active
          ? "border-sky-300 shadow-[0_0_45px_rgba(56,189,248,0.42)]"
          : "border-white/10 shadow-2xl shadow-black/40 group-hover:border-sky-300/60 group-hover:shadow-[0_0_35px_rgba(56,189,248,0.28)]"
      }`}
    >
      {profile.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${profile.image})` }}
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />

      {active && (
        <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-transparent via-sky-200 to-transparent shadow-[0_0_22px_rgba(56,189,248,0.95)]" />
      )}
    </div>
  );
}