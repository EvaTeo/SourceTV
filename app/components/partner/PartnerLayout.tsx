"use client";

import PartnerSidebar from "./PartnerSidebar";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <PartnerSidebar />

      <div className="min-h-screen pl-72">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070d]/95 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/30">
                SourceTV
              </p>

              <p className="mt-0.5 text-sm font-black text-white/80">
                Partner Studio
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <svg
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" strokeWidth="2" />

                  <path
                    d="M20 20L17 17"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-72 rounded-xl border border-white/10 bg-white/[0.035] py-2.5 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/45 focus:bg-white/[0.055]"
                />
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] transition hover:border-sky-300/35 hover:bg-sky-300/10"
              >
                <svg
                  className="h-5 w-5 text-white/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 17h5l-2-2v-4a6 6 0 10-12 0v4l-2 2h5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M10 21a2 2 0 004 0"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-300 text-sm font-black text-black">
                P
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}