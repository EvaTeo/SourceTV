import PageTransition from "@/app/components/PageTransition";
import Header from "@/app/components/Header";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SourceTV",
  description: "Independent films, series, documentaries and creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-black text-white antialiased">
        <Header />

        <PageTransition>{children}</PageTransition>

        <footer className="border-t border-white/10 bg-black px-6 py-10 text-center text-sm text-white/40">
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-6">
            <Link href="/terms" className="transition hover:text-sky-300">
              Terms
            </Link>

            <Link href="/privacy" className="transition hover:text-sky-300">
              Privacy
            </Link>

            <Link href="/dmca" className="transition hover:text-sky-300">
              DMCA
            </Link>

            <Link
              href="/report-content"
              className="transition hover:text-sky-300"
            >
              Report Content
            </Link>

            <Link
              href="/partner/apply"
              className="transition hover:text-sky-300"
            >
              Partner Program
            </Link>
          </div>

          <p className="mt-6 text-white/30">
            © 2026 SourceTV. All rights reserved.
          </p>
        </footer>

        <MobileBottomNav />
      </body>
    </html>
  );
}