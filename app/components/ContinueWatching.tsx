"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const fallbackProfile = { id: "main", name: "Adan", avatar: "A" };

function getActiveProfile() {
  try {
    return JSON.parse(
      localStorage.getItem("sourcetv_active_profile") ||
        JSON.stringify(fallbackProfile)
    );
  } catch {
    return fallbackProfile;
  }
}

export default function ContinueWatching() {
  const [items, setItems] = useState<any[]>([]);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    async function loadContinueWatching() {
      const activeProfile = getActiveProfile();
      setProfileName(activeProfile.name || "Your");

      try {
        const res = await fetch("/api/continue-watching", {
          cache: "no-store",
        });

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setItems(
            data.map((entry: any) => {
              const project = entry.project || {};

              return {
                slug: project.id || entry.projectId,
                title: project.title || "Untitled",
                progress: entry.progress || 0,
                artwork:
                  project.cardArtUrl ||
                  project.backdropUrl ||
                  project.thumbnailUrl ||
                  "",
              };
            })
          );

          return;
        }
      } catch (error) {
        console.error("CONTINUE WATCHING API ERROR:", error);
      }

      const profileKey = `sourcetv_continue_${activeProfile.id}`;
      const oldGlobal = JSON.parse(
        localStorage.getItem("sourcetv_continue") || "[]"
      );
      const profileSaved = JSON.parse(localStorage.getItem(profileKey) || "[]");

      if (profileSaved.length === 0 && oldGlobal.length > 0) {
        localStorage.setItem(profileKey, JSON.stringify(oldGlobal));
        setItems(
          oldGlobal.map((item: any) => ({
            ...item,
            artwork: item.cardArtUrl || item.backdropUrl || item.thumbnailUrl,
          }))
        );
        return;
      }

      setItems(
        profileSaved.map((item: any) => ({
          ...item,
          artwork: item.cardArtUrl || item.backdropUrl || item.thumbnailUrl,
        }))
      );
    }

    loadContinueWatching();
  }, []);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-black md:text-3xl">Continue Watching</h2>

        <p className="mt-1 text-xs font-semibold text-white/40">
          For {profileName}
        </p>
      </div>

      <div className="flex touch-pan-x snap-x snap-mandatory gap-4 overflow-x-auto pb-8 scroll-smooth [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/watch/${item.slug}`}
            className="group w-[74vw] max-w-[300px] shrink-0 snap-start md:w-[340px] md:max-w-none"
          >
            <div
              className="relative aspect-video overflow-hidden rounded-[1.6rem] border border-white/10 bg-zinc-950 p-4 transition duration-300 hover:-translate-y-2 hover:border-sky-300/60 hover:shadow-[0_0_45px_rgba(14,165,233,0.3)] md:rounded-3xl"
              style={{
                backgroundImage: item.artwork
                  ? `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.18)), url(${item.artwork})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="relative z-10 flex h-full flex-col justify-end">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-sky-300 md:text-xs">
                  Resume
                </p>

                <h3 className="line-clamp-2 text-lg font-black leading-tight text-white md:text-xl">
                  {item.title}
                </h3>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.65)]"
                    style={{ width: `${item.progress || 50}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-white/45">
                  {item.progress || 50}% watched
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}