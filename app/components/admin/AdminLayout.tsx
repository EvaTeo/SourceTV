import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#05070d] text-white">
      <AdminSidebar />

      <div className="ml-72 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#05070d]/90 px-8 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
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
                placeholder="Search SourceTV..."
                className="w-80 rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-sky-300/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-sky-300/40">
              <svg
                className="h-5 w-5 text-white/70"
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

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400 font-black text-black">
                A
              </div>

              <div>
                <p className="text-sm font-bold">Administrator</p>
                <p className="text-xs text-white/40">SourceTV</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}