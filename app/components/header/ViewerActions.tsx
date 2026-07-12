"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import ProfileMenu from "../ProfileMenu";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-5 w-5 stroke-[2.4]"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />

      <path
        d="m16 16 4 4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ViewerActions({
  isPremium,
}: {
  isPremium: boolean;
}) {
  const searchRef =
    useRef<HTMLDivElement>(null);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  function runSearch() {
    const cleanQuery = searchQuery.trim();

    if (!cleanQuery) {
      setSearchOpen(true);
      return;
    }

    window.location.href =
      `/search?q=${encodeURIComponent(
        cleanQuery
      )}`;
  }

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      const target = event.target as Node;

      if (
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
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

  return (
    <>
      <div
        ref={searchRef}
        className={`flex items-center overflow-hidden rounded-full border border-white/10 bg-black/42 backdrop-blur-2xl transition-all duration-300 ${
          searchOpen
            ? "w-72 px-4"
            : "w-11 px-0"
        }`}
      >
        <button
          type="button"
          onClick={() => {
            if (!searchOpen) {
              setSearchOpen(true);
              return;
            }

            runSearch();
          }}
          className="flex h-11 w-11 shrink-0 items-center justify-center text-white/80 transition hover:text-white"
          aria-label="Search"
        >
          <SearchIcon />
        </button>

        <input
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              runSearch();
            }

            if (event.key === "Escape") {
              setSearchOpen(false);
              setSearchQuery("");
            }
          }}
          placeholder="Search SourceTV..."
          className={`w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/35 transition ${
            searchOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        />
      </div>

      <Link
        href="/watchlist"
        className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-bold text-white/70 backdrop-blur-xl transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
      >
        My List
      </Link>

      <Link
        href="/account/billing"
        className={`rounded-full border px-4 py-2 text-sm font-black backdrop-blur-xl transition ${
          isPremium
            ? "border-sky-300/45 bg-sky-400/18 text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.22)] hover:bg-sky-400/25"
            : "border-white/10 bg-black/35 text-white/70 hover:border-sky-300/35 hover:bg-sky-300/10 hover:text-sky-100"
        }`}
      >
        {isPremium ? "Premium" : "Upgrade"}
      </Link>

      <ProfileMenu />
    </>
  );
}