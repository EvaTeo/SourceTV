import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function PartnerHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/75 px-4 py-4 backdrop-blur-xl md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/partner" className="text-xl font-black text-white">
            Source<span className="text-sky-300">TV</span>
          </Link>

          <nav className="hidden items-center gap-5 text-xs font-black uppercase tracking-[0.16em] text-white/45 md:flex">
            <Link href="/partner" className="transition hover:text-sky-300">
              Dashboard
            </Link>

            <Link href="/partner/inbox" className="transition hover:text-sky-300">
              Inbox
            </Link>

            <Link
              href="/partner/contracts"
              className="transition hover:text-sky-300"
            >
              Contracts
            </Link>

            <Link
              href="/partner/revenue"
              className="transition hover:text-sky-300"
            >
              Revenue
            </Link>

            <Link href="/creator/submit" className="transition hover:text-sky-300">
              Submit Work
            </Link>
          </nav>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}