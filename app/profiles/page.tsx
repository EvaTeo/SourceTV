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

const MAX_PROFILES = 5;

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

function createNewProfile(): SourceProfile {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `profile-${Date.now()}`;

  return {
    id,
    name: "",
    avatar: "+",
    color: "from-sky-300 to-blue-600",
    image: "",
  };
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<SourceProfile[]>(defaultProfiles);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<SourceProfile | null>(
    null
  );
  const [editingName, setEditingName] = useState("");
  const [creatingProfile, setCreatingProfile] = useState(false);

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

    const active = nextProfiles.find(
      (profile) => profile.id === activeProfileId
    );

    if (active) {
      localStorage.setItem("sourcetv_active_profile", JSON.stringify(active));
    }
  }

  function chooseProfile(profile: SourceProfile) {
    localStorage.setItem("sourcetv_active_profile", JSON.stringify(profile));
    setActiveProfileId(profile.id);

    document.body.classList.add("profile-exit");

    setTimeout(() => {
      window.location.href = "/browse";
    }, 520);
  }

  function openEditor(profile: SourceProfile) {
    setCreatingProfile(false);
    setEditingProfile(profile);
    setEditingName(profile.name);
  }

  function openCreateProfile() {
    if (profiles.length >= MAX_PROFILES) return;

    const profile = createNewProfile();

    setCreatingProfile(true);
    setEditingProfile(profile);
    setEditingName("");
  }

  function closeEditor() {
    setEditingProfile(null);
    setEditingName("");
    setCreatingProfile(false);
  }

  function saveProfileEdits() {
    if (!editingProfile) return;

    const cleanName =
      editingName.trim() ||
      (creatingProfile ? `Profile ${profiles.length + 1}` : editingProfile.name);

    const updatedProfile = {
      ...editingProfile,
      name: cleanName,
      avatar: cleanName.charAt(0).toUpperCase(),
    };

    if (creatingProfile) {
      const nextProfiles = [...profiles, updatedProfile].slice(0, MAX_PROFILES);
      saveProfiles(nextProfiles);
      closeEditor();
      return;
    }

    const nextProfiles = profiles.map((profile) => {
      if (profile.id !== editingProfile.id) return profile;
      return updatedProfile;
    });

    saveProfiles(nextProfiles);
    closeEditor();
  }

  function deleteProfile() {
    if (!editingProfile || creatingProfile) return;

    if (profiles.length <= 1) {
      alert("You need at least one profile.");
      return;
    }

    const nextProfiles = profiles.filter(
      (profile) => profile.id !== editingProfile.id
    );

    const deletedActive = activeProfileId === editingProfile.id;
    const nextActive = deletedActive ? nextProfiles[0] : null;

    saveProfiles(nextProfiles);

    if (nextActive) {
      setActiveProfileId(nextActive.id);
      localStorage.setItem("sourcetv_active_profile", JSON.stringify(nextActive));
    }

    closeEditor();
  }

  function updateColor(color: string) {
    if (!editingProfile) return;

    const updatedProfile = {
      ...editingProfile,
      color,
    };

    setEditingProfile(updatedProfile);

    if (creatingProfile) return;

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

      if (creatingProfile) return;

      const nextProfiles = profiles.map((profile) =>
        profile.id === updatedProfile.id ? updatedProfile : profile
      );

      saveProfiles(nextProfiles);
    };

    reader.readAsDataURL(file);
  }

  const canAddProfile = profiles.length < MAX_PROFILES;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-32 pt-24 text-white md:px-10 md:pb-16 md:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.16),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(56,189,248,0.08),transparent_30%),linear-gradient(to_bottom,#020617_0%,#000_72%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/62" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[-18vh] h-[38vh] bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.13),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl flex-col items-center justify-center text-center">
        <Link href="/" className="text-3xl font-black tracking-tight">
          Source<span className="text-sky-400">TV</span>
        </Link>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:mt-10 md:text-xs">
          Choose Profile
        </p>

        <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight md:text-7xl">
          Who’s watching?
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/48 md:text-base md:leading-7">
          Pick a profile to continue your SourceTV experience.
        </p>

        <div className="mt-9 grid w-full max-w-5xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-5 md:gap-8">
          {profiles.map((profile, index) => {
            const active = activeProfileId === profile.id;

            return (
              <div
                key={profile.id}
                className="group text-center opacity-0 animate-[profileCardIn_560ms_ease_forwards]"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <button
                  onClick={() => chooseProfile(profile)}
                  className="w-full outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
                >
                  <ProfileAvatar profile={profile} active={active} />

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
                  onClick={() => openEditor(profile)}
                  className="mt-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-black text-white/45 backdrop-blur-xl transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
                >
                  Edit
                </button>
              </div>
            );
          })}

          <div
            className="group text-center opacity-0 animate-[profileCardIn_560ms_ease_forwards]"
            style={{ animationDelay: `${profiles.length * 90}ms` }}
          >
            <button
              onClick={openCreateProfile}
              disabled={!canAddProfile}
              className="w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="relative mx-auto flex aspect-square w-full max-w-[155px] items-center justify-center overflow-hidden rounded-[1.35rem] border border-dashed border-white/18 bg-white/[0.025] transition-all duration-500 md:max-w-[190px] group-hover:-translate-y-2 group-hover:scale-[1.035] group-hover:border-sky-300/55 group-hover:bg-sky-300/8 group-hover:shadow-[0_0_40px_rgba(56,189,248,0.2)]">
                <span className="text-5xl font-extralight text-white/42 transition group-hover:text-sky-200 md:text-6xl">
                  +
                </span>

                <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/8" />
              </div>

              <p className="mt-4 text-base font-black text-white/52 transition group-hover:text-white md:text-lg">
                Add Profile
              </p>

              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/28">
                {canAddProfile ? `${profiles.length}/${MAX_PROFILES}` : "Max"}
              </p>
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/browse"
            className="rounded-md bg-white px-8 py-3 text-sm font-black text-black shadow-[0_14px_32px_rgba(0,0,0,0.35)] transition hover:scale-[1.025] hover:bg-sky-200"
          >
            Continue
          </Link>

          <button
            onClick={() => openEditor(profiles[0])}
            className="rounded-md border border-white/15 bg-white/[0.045] px-8 py-3 text-sm font-black text-white/66 backdrop-blur-xl transition hover:scale-[1.025] hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-200"
          >
            Manage Profiles
          </button>
        </div>
      </div>

      {editingProfile && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/66 px-4 backdrop-blur-sm md:items-center">
          <div className="relative w-full max-w-lg overflow-hidden rounded-t-[2rem] border border-white/10 bg-black/82 p-5 shadow-[0_0_90px_rgba(0,0,0,0.72)] backdrop-blur-3xl animate-[profileEditorIn_260ms_ease-out] md:rounded-[2rem] md:p-7">
            <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-sky-300/60 to-transparent shadow-[0_0_22px_rgba(56,189,248,0.8)]" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.35em] text-sky-300">
                  {creatingProfile ? "Create Profile" : "Edit Profile"}
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  {creatingProfile
                    ? "New Profile"
                    : editingProfile.name || "Profile"}
                </h2>
              </div>

              <button
                onClick={closeEditor}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl font-black text-white/65 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-white"
                aria-label="Close editor"
              >
                ×
              </button>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-[150px_1fr] md:items-start">
              <div className="mx-auto w-[150px]">
                <ProfileAvatar
                  profile={{
                    ...editingProfile,
                    name: editingName || editingProfile.name || "New Profile",
                    avatar: (editingName || editingProfile.name || "+")
                      .charAt(0)
                      .toUpperCase(),
                  }}
                  active
                />

                <label className="mt-4 block cursor-pointer rounded-md border border-white/15 bg-white/[0.05] px-4 py-3 text-center text-xs font-black text-white/70 backdrop-blur-xl transition hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-200">
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
                  autoFocus
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
                    className="flex-1 rounded-md bg-white px-6 py-3 text-sm font-black text-black shadow-[0_12px_30px_rgba(0,0,0,0.32)] transition hover:bg-sky-200"
                  >
                    {creatingProfile ? "Create" : "Save"}
                  </button>

                  <button
                    onClick={closeEditor}
                    className="flex-1 rounded-md border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-black text-white/65 backdrop-blur-xl transition hover:border-white/30 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                {!creatingProfile && (
                  <button
                    onClick={deleteProfile}
                    className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-red-300/55 transition hover:text-red-200"
                  >
                    Delete Profile
                  </button>
                )}

                <p className="mt-4 text-xs leading-5 text-white/35">
                  Uploaded photos are saved locally in your browser for now.
                  Later, this can connect to real accounts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes profileCardIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes profileEditorIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        :global(body.profile-exit) main {
          animation: profilePageExit 520ms cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        @keyframes profilePageExit {
          from {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }

          to {
            opacity: 0;
            transform: scale(1.045);
            filter: blur(10px);
          }
        }
      `}</style>
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
      className={`relative mx-auto flex aspect-square w-full max-w-[155px] items-center justify-center overflow-hidden rounded-[1.35rem] border transition-all duration-500 md:max-w-[190px] ${
        active
          ? "border-sky-300/80 shadow-[0_0_46px_rgba(56,189,248,0.4)]"
          : "border-white/10 shadow-[0_20px_46px_rgba(0,0,0,0.45)] group-hover:-translate-y-2 group-hover:scale-[1.035] group-hover:border-sky-300/55 group-hover:shadow-[0_0_40px_rgba(56,189,248,0.24)]"
      }`}
    >
      {profile.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-white/10" />

      <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/10" />

      {active && (
        <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-transparent via-sky-200 to-transparent shadow-[0_0_22px_rgba(56,189,248,0.95)]" />
      )}
    </div>
  );
}