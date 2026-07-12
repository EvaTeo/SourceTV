"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LogoutButton from "../LogoutButton";
import ProfileMenuAvatar from "./ProfileMenuAvatar";
import {
  BillingIcon,
  ChevronIcon,
  ManageProfilesIcon,
  SettingsIcon,
  SwitchProfileIcon,
} from "./ProfileMenuIcons";
import ProfileMenuLink from "./ProfileMenuLink";
import {
  readActiveProfile,
  type StoredProfile,
} from "./profileMenuStorage";

const OPEN_DELAY = 110;
const CLOSE_DELAY = 220;

export default function ProfileMenu() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const openTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);

  const [profile, setProfile] =
    useState<StoredProfile | null>(null);

  function clearHoverTimers() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openMenuSoon() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (open || openTimerRef.current) {
      return;
    }

    openTimerRef.current = setTimeout(() => {
      setOpen(true);
      openTimerRef.current = null;
    }, OPEN_DELAY);
  }

  function closeMenuSoon() {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (!open) {
      return;
    }

    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY);
  }

  function refreshProfile() {
    setProfile(readActiveProfile());
  }

  useEffect(() => {
    refreshProfile();

    function handleProfileChanged() {
      refreshProfile();
    }

    function handleStorage(event: StorageEvent) {
      if (
        event.key === "sourcetv_active_profile" ||
        event.key === "sourcetvUser"
      ) {
        refreshProfile();
      }
    }

    window.addEventListener(
      "sourcetv-profile-changed",
      handleProfileChanged
    );

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "sourcetv-profile-changed",
        handleProfileChanged
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  useEffect(() => {
    clearHoverTimers();
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        clearHoverTimers();
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        clearHoverTimers();
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  useEffect(() => {
    return () => {
      clearHoverTimers();
    };
  }, []);

  const safeProfile = useMemo(
    () =>
      profile || {
        id: "loading",
        name: "Profile",
        avatar: "P",
        color: "from-sky-300 to-blue-600",
        image: "",
      },
    [profile]
  );

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={openMenuSoon}
      onMouseLeave={closeMenuSoon}
    >
      <button
        type="button"
        onClick={() => {
          clearHoverTimers();
          setOpen((value) => !value);
        }}
        onFocus={openMenuSoon}
        className={`group flex items-center gap-1.5 rounded-full border p-1 pr-2 transition duration-300 ${
          open
            ? "border-sky-300/35 bg-sky-300/[0.08]"
            : "border-white/10 bg-black/38 hover:border-white/25 hover:bg-white/[0.07]"
        }`}
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        <div
          className={`h-8 w-8 shrink-0 transition duration-300 ${
            open ? "scale-[1.04]" : "scale-100"
          }`}
        >
          <ProfileMenuAvatar profile={safeProfile} />
        </div>

        <span className="text-white/50 transition group-hover:text-white">
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        className={`absolute right-0 top-full mt-3 w-[250px] origin-top-right overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/92 p-2 shadow-[0_28px_80px_rgba(0,0,0,0.78)] backdrop-blur-3xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.97] opacity-0"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/55 to-transparent" />

        <Link
          href="/account"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.06]"
        >
          <div className="h-10 w-10 shrink-0">
            <ProfileMenuAvatar profile={safeProfile} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">
              {safeProfile.name}
            </p>

            <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/30 transition group-hover:text-sky-300/70">
              Account
            </p>
          </div>
        </Link>

        <div className="h-px bg-white/[0.07]" />

        <div className="py-1.5">
          <ProfileMenuLink
            href="/profiles/select"
            label="Switch Profile"
            icon={<SwitchProfileIcon />}
            onClick={() => setOpen(false)}
          />

          <ProfileMenuLink
            href="/profiles"
            label="Manage Profiles"
            icon={<ManageProfilesIcon />}
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="h-px bg-white/[0.07]" />

        <div className="py-1.5">
          <ProfileMenuLink
            href="/account/settings"
            label="Settings"
            icon={<SettingsIcon />}
            onClick={() => setOpen(false)}
          />

          <ProfileMenuLink
            href="/account/billing"
            label="Subscription"
            icon={<BillingIcon />}
            onClick={() => setOpen(false)}
          />
        </div>

        <div className="h-px bg-white/[0.07]" />

        <div
          onClick={() => setOpen(false)}
          className="px-1 py-1.5 [&_button]:w-full [&_button]:justify-start [&_button]:rounded-xl [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-3 [&_button]:py-2.5 [&_button]:text-left [&_button]:text-sm [&_button]:font-bold [&_button]:text-red-200/60 [&_button]:shadow-none [&_button]:transition [&_button]:hover:bg-red-300/[0.08] [&_button]:hover:text-red-100"
        >
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}