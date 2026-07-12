"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getActiveProfile,
  loadProfiles,
  type ProfileAccount,
  type SourceProfile,
} from "../lib/profileStorage";
import { selectProfileAndNavigate } from "../lib/profileSelection";
import ProfileSelectorCard from "./ProfileSelectorCard";

export default function ProfileSelector({
  account,
}: {
  account: ProfileAccount;
}) {
  const [profiles, setProfiles] = useState<
    SourceProfile[]
  >([]);

  const [activeProfileId, setActiveProfileId] =
    useState<string | null>(null);

  const [selectedProfileId, setSelectedProfileId] =
    useState<string | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadedProfiles = loadProfiles(account);
    const activeProfile = getActiveProfile(account.id);

    setProfiles(loadedProfiles);
    setActiveProfileId(activeProfile?.id || null);
    setReady(true);
  }, [account]);

  const activeProfile = useMemo(
    () =>
      profiles.find(
        (profile) =>
          profile.id === activeProfileId
      ) || null,
    [activeProfileId, profiles]
  );

  function chooseProfile(profile: SourceProfile) {
    if (selectedProfileId) {
      return;
    }

    setSelectedProfileId(profile.id);

    selectProfileAndNavigate({
      accountId: account.id,
      profile,
      destination: "/browse",
    });
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="relative h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 w-1/2 animate-[profileLoadSlide_1s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-sky-300 to-white shadow-[0_0_18px_rgba(56,189,248,0.75)]" />
        </div>

        <style jsx>{`
          @keyframes profileLoadSlide {
            0% {
              transform: translateX(-130%);
            }

            50% {
              transform: translateX(80%);
            }

            100% {
              transform: translateX(230%);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 pb-24 pt-24 text-white md:px-10 md:pb-16 md:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.16),transparent_31%),radial-gradient(circle_at_82%_16%,rgba(56,189,248,0.07),transparent_28%),linear-gradient(to_bottom,#020617_0%,#000_72%)]" />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70" />

      <div className="pointer-events-none absolute inset-x-0 bottom-[-18vh] h-[40vh] bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.14),transparent_68%)] blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col items-center justify-center text-center">
        <Link
          href="/"
          className="text-3xl font-black tracking-tight"
        >
          Source
          <span className="text-sky-400">
            TV
          </span>
        </Link>

        <p className="mt-9 text-[10px] font-black uppercase tracking-[0.36em] text-sky-300 md:mt-11 md:text-xs">
          Choose Profile
        </p>

        <h1 className="mt-4 text-4xl font-black leading-[0.94] tracking-[-0.04em] md:text-7xl">
          Who’s watching?
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/45 md:text-base">
          Choose a profile to continue your
          SourceTV experience.
        </p>

        <div
          className={`mt-10 grid w-full max-w-5xl grid-cols-2 gap-6 transition duration-500 md:mt-14 md:grid-cols-5 md:gap-8 ${
            selectedProfileId
              ? "pointer-events-none"
              : ""
          }`}
        >
          {profiles.map((profile, index) => (
            <ProfileSelectorCard
              key={profile.id}
              profile={profile}
              active={
                activeProfile?.id === profile.id
              }
              index={index}
              selecting={
                selectedProfileId !== null
              }
              onSelect={() =>
                chooseProfile(profile)
              }
            />
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/profiles"
            className="rounded-md border border-white/14 bg-white/[0.045] px-7 py-3 text-sm font-black text-white/62 backdrop-blur-xl transition hover:scale-[1.02] hover:border-sky-300/40 hover:bg-sky-300/[0.08] hover:text-sky-100"
          >
            Manage Profiles
          </Link>

          {activeProfile && (
            <button
              type="button"
              onClick={() =>
                chooseProfile(activeProfile)
              }
              disabled={selectedProfileId !== null}
              className="rounded-md bg-white px-7 py-3 text-sm font-black text-black shadow-[0_14px_34px_rgba(0,0,0,0.35)] transition hover:scale-[1.02] hover:bg-sky-200 disabled:pointer-events-none disabled:opacity-50"
            >
              Continue as {activeProfile.name}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes profileSelectorCardIn {
          from {
            opacity: 0;
            transform: translateY(20px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        :global(body.profile-selection-exit main) {
          animation: profileSelectionExit 480ms
            cubic-bezier(0.16, 1, 0.3, 1)
            forwards;
        }

        @keyframes profileSelectionExit {
          from {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }

          to {
            opacity: 0;
            transform: scale(1.035);
            filter: blur(8px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(body.profile-selection-exit main) {
            animation-duration: 1ms;
          }
        }
      `}</style>
    </main>
  );
}