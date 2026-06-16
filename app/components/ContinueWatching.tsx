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

function cleanProgress(value: any) {
  const number = Number(value || 0);

  if (!Number.isFinite(number)) return 0;

  return Math.min(100, Math.max(0, Math.round(number)));
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M8 5.8v12.4c0 .9 1 1.4 1.7.9l9.5-6.2c.7-.4.7-1.4 0-1.8L9.7 4.9C9 4.4 8 4.9 8 5.8z" />
    </svg>
  );
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
              const progress = cleanProgress(entry.progress || entry.position);

              return {
                slug: project.id || entry.projectId,
                title: project.title || "Untitled",
                progress,
                type: project.type || entry.type || "",
                genre: project.genre || entry.genre || "",
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
            progress: cleanProgress(item.progress),
            artwork: item.cardArtUrl || item.backdropUrl || item.thumbnailUrl,
          }))
        );
        return;
      }

      setItems(
        profileSaved.map((item: any) => ({
          ...item,
          progress: cleanProgress(item.progress),
          artwork: item.cardArtUrl || item.backdropUrl || item.thumbnailUrl,
        }))
      );
    }

    loadContinueWatching();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-visible py-1">
      <div className="mb-0 flex items-end justify-between gap-4 px-5 md:px-12">
        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-white md:text-[1.32rem]">
            Continue Watching
          </h2>

          <p className="mt-0.5 text-[10px] font-semibold text-white/35 md:text-[11px]">
            For {profileName}
          </p>
        </div>
      </div>

      <div className="flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-visible px-5 pb-5 pt-3 scroll-smooth [scrollbar-width:none] md:gap-4 md:px-12 md:pb-6 md:pt-4 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const progress = cleanProgress(item.progress);
          const remaining = Math.max(0, 100 - progress);

          return (
            <Link
              key={item.slug}
              href={`/watch/${item.slug}`}
              className="group w-[72vw] max-w-[300px] shrink-0 snap-start outline-none md:w-[360px] md:max-w-none"
            >
              <div className="relative overflow-hidden rounded-[0.95rem] bg-zinc-950 shadow-[0_10px_28px_rgba(0,0,0,0.35)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] group-focus-visible:ring-2 group-focus-visible:ring-sky-300/70 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-black">
                <div className="pointer-events-none absolute -inset-8 bg-sky-300/0 blur-3xl transition duration-500 group-hover:bg-sky-300/10" />

                <div
                  className="relative aspect-video overflow-hidden bg-zinc-950 bg-cover bg-center"
                  style={{
                    backgroundImage: item.artwork
                      ? `linear-gradient(
                          to top,
                          rgba(0,0,0,0.7),
                          rgba(0,0,0,0.05)
                        ), url(${item.artwork})`
                      : "radial-gradient(circle at 70% 20%, rgba(14,165,233,0.18), transparent 34%), linear-gradient(to right, black, #020617)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-75 transition duration-500 group-hover:opacity-95" />

                  <div className="absolute inset-0 scale-100 transition duration-700 group-hover:scale-105" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition group-hover:scale-105 md:h-12 md:w-12">
                      <PlayIcon />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                    <h3 className="line-clamp-1 text-sm font-black leading-tight text-white md:text-base">
                      {item.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[10px] font-semibold text-white/45 md:text-[11px]">
                      {item.type && <span>{item.type}</span>}
                      {item.genre && <span>• {item.genre}</span>}
                    </div>
                  </div>
                </div>

                <div className="relative bg-black/90 px-3 pb-3 pt-2 backdrop-blur-xl md:px-4 md:pb-4 md:pt-3">
                  <div className="flex items-center justify-between gap-4 text-[10px] font-bold md:text-[11px]">
                    <span className="text-sky-200/90">{progress}% watched</span>
                    <span className="text-white/35">{remaining}% left</span>
                  </div>

                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/12">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-600 via-sky-300 to-white shadow-[0_0_16px_rgba(56,189,248,0.62)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}