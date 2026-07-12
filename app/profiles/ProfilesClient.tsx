"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import ProfileCard from "./components/ProfileCard";
import ProfileEditor from "./components/ProfileEditor";
import ProfileAvatar from "./components/ProfileAvatar";
import {
  createNewProfile,
  getActiveProfile,
  loadProfiles,
  MAX_PROFILES,
  saveProfiles,
  setActiveProfile,
  type ProfileAccount,
  type SourceProfile,
} from "./lib/profileStorage";

export default function ProfilesClient({
  account,
}: {
  account: ProfileAccount;
}) {
  const [profiles, setProfiles] = useState<
    SourceProfile[]
  >([]);

  const [activeProfileId, setActiveProfileId] =
    useState<string | null>(null);

  const [editingProfile, setEditingProfile] =
    useState<SourceProfile | null>(null);

  const [creatingProfile, setCreatingProfile] =
    useState(false);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadedProfiles = loadProfiles(account);
    const active = getActiveProfile(account.id);

    setProfiles(loadedProfiles);
    setActiveProfileId(active?.id || null);
    setReady(true);
  }, [account]);

  const activeProfile = useMemo(
    () =>
      profiles.find(
        (profile) => profile.id === activeProfileId
      ) || null,
    [activeProfileId, profiles]
  );

  const canAddProfile =
    profiles.length < MAX_PROFILES;

  function persistProfiles(
    nextProfiles: SourceProfile[]
  ) {
    setProfiles(nextProfiles);
    saveProfiles(account.id, nextProfiles);

    const active = nextProfiles.find(
      (profile) => profile.id === activeProfileId
    );

    if (active) {
      setActiveProfile(account.id, active);
    }
  }

  function chooseProfile(profile: SourceProfile) {
    setActiveProfile(account.id, profile);
    setActiveProfileId(profile.id);

    document.body.classList.add("profile-exit");

    window.setTimeout(() => {
      window.location.href = "/browse";
    }, 520);
  }

  function openEditor(profile: SourceProfile) {
    setCreatingProfile(false);
    setEditingProfile(profile);
  }

  function openCreateProfile() {
    if (!canAddProfile) {
      return;
    }

    setCreatingProfile(true);
    setEditingProfile(createNewProfile());
  }

  function closeEditor() {
    setEditingProfile(null);
    setCreatingProfile(false);
  }

  function saveProfile(profile: SourceProfile) {
    if (creatingProfile) {
      persistProfiles(
        [...profiles, profile].slice(
          0,
          MAX_PROFILES
        )
      );

      closeEditor();
      return;
    }

    persistProfiles(
      profiles.map((currentProfile) =>
        currentProfile.id === profile.id
          ? profile
          : currentProfile
      )
    );

    closeEditor();
  }

  function deleteProfile() {
    if (!editingProfile || creatingProfile) {
      return;
    }

    if (profiles.length <= 1) {
      alert("You need at least one profile.");
      return;
    }

    const nextProfiles = profiles.filter(
      (profile) =>
        profile.id !== editingProfile.id
    );

    persistProfiles(nextProfiles);

    if (activeProfileId === editingProfile.id) {
      const nextActive = nextProfiles[0];

      setActiveProfile(account.id, nextActive);
      setActiveProfileId(nextActive.id);
    }

    closeEditor();
  }

  function continueWithActiveProfile() {
    if (activeProfile) {
      chooseProfile(activeProfile);
      return;
    }

    const firstProfile = profiles[0];

    if (firstProfile) {
      chooseProfile(firstProfile);
    }
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="h-1 w-52 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-sky-300" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-32 pt-24 text-white md:px-10 md:pb-16 md:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.16),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(56,189,248,0.08),transparent_30%),linear-gradient(to_bottom,#020617_0%,#000_72%)]" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/62" />

      <div className="pointer-events-none absolute inset-x-0 bottom-[-18vh] h-[38vh] bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.13),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl flex-col items-center justify-center text-center">
        <Link
          href="/"
          className="text-3xl font-black tracking-tight"
        >
          Source
          <span className="text-sky-400">TV</span>
        </Link>

        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.35em] text-sky-300 md:mt-10 md:text-xs">
          Choose Profile
        </p>

        <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight md:text-7xl">
          Who’s watching?
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/48 md:text-base md:leading-7">
          Pick a profile to continue your SourceTV
          experience.
        </p>

        <div className="mt-9 grid w-full max-w-5xl grid-cols-2 gap-6 md:mt-14 md:grid-cols-5 md:gap-8">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              active={
                activeProfileId === profile.id
              }
              index={index}
              onSelect={() =>
                chooseProfile(profile)
              }
              onEdit={() => openEditor(profile)}
            />
          ))}

          <div
            className="group text-center opacity-0 animate-[profileCardIn_560ms_ease_forwards]"
            style={{
              animationDelay: `${profiles.length * 90}ms`,
            }}
          >
            <button
              type="button"
              onClick={openCreateProfile}
              disabled={!canAddProfile}
              className="w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="relative mx-auto flex aspect-square w-full max-w-[155px] items-center justify-center overflow-hidden rounded-[1.35rem] border border-dashed border-white/18 bg-white/[0.025] transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-[1.035] group-hover:border-sky-300/55 group-hover:bg-sky-300/8 group-hover:shadow-[0_0_40px_rgba(56,189,248,0.2)] md:max-w-[190px]">
                <span className="text-5xl font-extralight text-white/42 transition group-hover:text-sky-200 md:text-6xl">
                  +
                </span>

                <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/8" />
              </div>

              <p className="mt-4 text-base font-black text-white/52 transition group-hover:text-white md:text-lg">
                Add Profile
              </p>

              <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/28">
                {canAddProfile
                  ? `${profiles.length}/${MAX_PROFILES}`
                  : "Max"}
              </p>
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={continueWithActiveProfile}
            className="rounded-md bg-white px-8 py-3 text-sm font-black text-black shadow-[0_14px_32px_rgba(0,0,0,0.35)] transition hover:scale-[1.025] hover:bg-sky-200"
          >
            Continue
          </button>

          {activeProfile && (
            <div className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.035] px-5 py-2.5 text-left">
              <div className="h-8 w-8">
                <ProfileAvatar
                  profile={activeProfile}
                  compact
                />
              </div>

              <div>
                <p className="text-xs font-black text-white/72">
                  Active Profile
                </p>

                <p className="text-[10px] text-white/38">
                  {activeProfile.name}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {editingProfile && (
        <ProfileEditor
          profile={editingProfile}
          creating={creatingProfile}
          profileCount={profiles.length}
          canDelete={profiles.length > 1}
          onClose={closeEditor}
          onSave={saveProfile}
          onDelete={deleteProfile}
        />
      )}

      <style jsx>{`
        @keyframes profileCardIn {
          from {
            opacity: 0;
            transform: translateY(18px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        :global(body.profile-exit) main {
          animation: profilePageExit 520ms
            cubic-bezier(0.16, 1, 0.3, 1)
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