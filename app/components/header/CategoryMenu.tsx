"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  moreGenres,
  popularGenres,
} from "./headerLinks";

export default function CategoryMenu() {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      const target = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
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

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className={`text-sm font-semibold transition ${
          open || pathname.startsWith("/genres")
            ? "text-sky-300"
            : "text-white/68 hover:text-white"
        }`}
        aria-expanded={open}
        aria-label="Open categories"
      >
        Categories
      </button>

      <div
        className={`absolute left-0 top-full mt-5 w-[380px] origin-top-left overflow-hidden rounded-2xl border border-white/10 bg-black/92 p-3 shadow-[0_28px_80px_rgba(0,0,0,0.72)] backdrop-blur-2xl transition-all duration-250 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <nav className="grid grid-cols-2 gap-1">
          <div className="col-span-2 px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
            Popular Genres
          </div>

          {popularGenres.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
            >
              {link.label}
            </Link>
          ))}

          <div className="col-span-2 mt-2 px-3 pb-1 pt-2 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
            More Genres
          </div>

          {moreGenres.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/[0.07] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}